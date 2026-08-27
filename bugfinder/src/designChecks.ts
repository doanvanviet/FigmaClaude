import type { DesignFixAction, IssueType, ScannedNode, TextIssue } from "./types";
import { t } from "./i18n";
import {
  defaultRulesConfig,
  defaultRuleValues,
  getRuleValue,
  isRuleEnabled,
  parseHexList,
  parseNumberList,
  type RulesConfig,
  type RuleValues,
} from "./rulesConfig";
import {
  CONTROL_HEIGHT_KEYWORDS,
  CONTROL_RADIUS_KEYWORDS,
  HYPERLINK_KEYWORDS,
  ICON_KEYWORDS,
  LARGE_RADIUS_KEYWORDS,
  matchesKeyword,
} from "./designTokens";

/**
 * `fix` is set only for findings with exactly one unambiguous correct value
 * (a single configured font/height/radius/spacing/shadow name) — it makes the
 * finding auto-fixable via a dedicated apply-design-fix action, distinct from
 * the plain text search/replace used for content issues.
 */
function makeIssue(
  type: IssueType,
  original: string,
  message: string,
  fix?: {
    suggestion: string;
    designFix?: DesignFixAction;
    fixOptions?: { label: string; designFix: DesignFixAction }[];
  }
): TextIssue {
  return {
    type,
    original,
    suggestion: fix?.suggestion ?? "",
    message,
    source: "local",
    fixable: !!(fix?.designFix || fix?.fixOptions?.length),
    designFix: fix?.designFix,
    fixOptions: fix?.fixOptions,
  };
}

/**
 * Style/layout lint against the Design System tokens. Runs only when
 * "Review Web App" is used — report-only (no auto-fix), since a style
 * violation isn't a text substring you can safely search/replace. Most
 * expected values come from `values` (editable in the plugin's rule panel);
 * fill/stroke color is the exception — rather than matching against a fixed
 * hex list (which drifts out of sync with the library), a color only needs to
 * be linked to SOME Paint Style or Variable to pass; a raw/detached color is
 * always flagged regardless of its role. `node.insideIgnored` (self or an
 * ancestor's name matched a user-defined ignore pattern) skips every check
 * for that node entirely.
 */
export function runDesignChecks(
  node: ScannedNode,
  config: RulesConfig = defaultRulesConfig(),
  values: RuleValues = defaultRuleValues()
): TextIssue[] {
  const style = node.style;
  if (!style || node.insideIgnored || node.occluded) return [];

  const out: TextIssue[] = [];
  const seen = new Set<string>();
  const push = (issue: TextIssue) => {
    const key = `${issue.type}|${issue.original}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(issue);
  };

  if (node.type === "TEXT") {
    if (isRuleEnabled(config, "design-font-family") && style.fontFamilies.length > 0) {
      const expectedFont = getRuleValue(values, "design-font-family").trim();
      if (expectedFont) {
        // Check every distinct font used in the text, not just one representative
        // value — a mixed-style run (part correct, part wrong) still gets caught.
        for (const font of style.fontFamilies) {
          if (font === expectedFont) continue;
          push(
            makeIssue(
              "design_font",
              font,
              t("designCheck.fontMismatch", { font, expected: expectedFont }),
              { suggestion: expectedFont, designFix: { kind: "font-family", fontFamily: expectedFont } }
            )
          );
        }
      }
    }

    if (isRuleEnabled(config, "design-font-size") && style.fontSizes.length > 0) {
      const allowedSizes = parseNumberList(getRuleValue(values, "design-font-size"));
      if (allowedSizes.length > 0) {
        for (const size of style.fontSizes) {
          if (allowedSizes.includes(size)) continue;
          push(
            makeIssue(
              "design_font_size",
              `${size}px`,
              t("designCheck.fontSizeOffScale", { size, allowed: allowedSizes.join("/") })
            )
          );
        }
      }
    }

    if (isRuleEnabled(config, "design-text-color") && style.fills.length > 0 && !style.fillsLinked) {
      // Report-only: grays are too close to auto-match or even auto-suggest
      // reliably by hex alone — left for the designer to link manually. An
      // unlinked color that exactly matches the configured allowlist (typed
      // in by hand, e.g. when the file has no local Styles/Variables to link
      // to) is treated as compliant even though it isn't linked.
      const allowedTextHexes = parseHexList(getRuleValue(values, "design-text-color"));
      for (const hex of style.fills) {
        if (allowedTextHexes.includes(hex)) continue;
        push(makeIssue("design_color", `#${hex}`, t("designCheck.fillRawColor", { hex })));
      }
    }
  }

  if (isRuleEnabled(config, "design-border-color") && style.strokes.length > 0 && !style.strokesLinked) {
    const allowedBorderHexes = parseHexList(getRuleValue(values, "design-border-color"));
    for (const hex of style.strokes) {
      if (allowedBorderHexes.includes(hex)) continue;
      push(
        makeIssue("design_color", `#${hex}`, t("designCheck.strokeRawColor", { hex }), {
          suggestion: "",
          designFix: { kind: "stroke-color", hex },
        })
      );
    }
  }

  if (
    node.type !== "TEXT" &&
    isRuleEnabled(config, "design-control-height") &&
    matchesKeyword(node.name, CONTROL_HEIGHT_KEYWORDS) &&
    // A plain icon isn't a control and has no required height — unless it's
    // specifically a "Button Icon"/"Icon Button" component.
    (!matchesKeyword(node.name, ICON_KEYWORDS) || matchesKeyword(node.name, ["button"]))
  ) {
    const [expectedHeight] = parseNumberList(getRuleValue(values, "design-control-height"));
    const height = Math.round(style.height);
    if (expectedHeight != null && height !== expectedHeight) {
      push(
        makeIssue(
          "design_dimension",
          `${height}px`,
          t("designCheck.heightMismatch", { name: node.name, height, expected: expectedHeight }),
          { suggestion: `${expectedHeight}px`, designFix: { kind: "height", height: expectedHeight } }
        )
      );
    }
  }

  if (
    node.type !== "TEXT" &&
    isRuleEnabled(config, "design-control-radius") &&
    style.cornerRadius != null &&
    // No fill and no stroke means the corner radius has nothing to round visually.
    (style.fills.length > 0 || style.strokes.length > 0) &&
    matchesKeyword(node.name, CONTROL_RADIUS_KEYWORDS)
  ) {
    const [normalRadius, largeRadius] = parseNumberList(
      getRuleValue(values, "design-control-radius")
    );
    const expected = matchesKeyword(node.name, LARGE_RADIUS_KEYWORDS)
      ? largeRadius ?? normalRadius
      : normalRadius;
    if (expected != null && style.cornerRadius !== expected) {
      const currentLabel = t("designCheck.radiusValueLabel", { value: style.cornerRadius });
      const expectedLabel = t("designCheck.radiusValueLabel", { value: expected });
      push(
        makeIssue(
          "design_dimension",
          currentLabel,
          t("designCheck.radiusMismatch", { name: node.name, expected, current: style.cornerRadius }),
          { suggestion: expectedLabel, designFix: { kind: "corner-radius", radius: expected } }
        )
      );
    }
  }

  if (
    style.layoutMode !== "NONE" &&
    style.itemSpacing != null &&
    style.itemSpacing !== 0 &&
    // Gap only means something between at least 2 items.
    style.childCount > 1 &&
    // "Auto" gap (primary axis = space between) distributes space dynamically —
    // itemSpacing isn't a real fixed value in that mode, so there's nothing to check.
    !style.isAutoGap &&
    // Hyperlink's own 4px Gap (icon-to-label) is intentional, not a violation.
    !(matchesKeyword(node.name, HYPERLINK_KEYWORDS) && style.itemSpacing === 4)
  ) {
    if (style.isButtonRow && isRuleEnabled(config, "design-button-row-gap")) {
      // A horizontal row of buttons has its own fixed Gap standard — checked
      // instead of (not in addition to) the general rules below.
      const [expectedButtonGap] = parseNumberList(getRuleValue(values, "design-button-row-gap"));
      if (expectedButtonGap > 0 && style.itemSpacing !== expectedButtonGap) {
        push(
          makeIssue(
            "design_spacing",
            `Gap ${style.itemSpacing}px`,
            t("designCheck.buttonRowGapMismatch", { expected: expectedButtonGap, current: style.itemSpacing }),
            {
              suggestion: `Gap ${expectedButtonGap}px`,
              designFix: { kind: "item-spacing", spacing: expectedButtonGap },
            }
          )
        );
      }
    } else if (isRuleEnabled(config, "design-control-spacing")) {
      if (node.type === "INSTANCE") {
        // Instance pulled from the library: only flag when this specific
        // instance's spacing was manually changed from the main component's.
        if (style.spacingOverridden) {
          const mainSpacing = style.mainComponentSpacing;
          push(
            makeIssue(
              "design_spacing",
              `Gap ${style.itemSpacing}px`,
              t("designCheck.instanceGapOverride", { current: style.itemSpacing, name: node.name }),
              mainSpacing != null
                ? {
                    suggestion: `Gap ${mainSpacing}px`,
                    designFix: { kind: "item-spacing", spacing: mainSpacing },
                  }
                : undefined
            )
          );
        }
      } else if (!node.insideInstance) {
        // Not part of any component instance — check it's a multiple of the base unit
        // (e.g. any multiple of 4 is fine: 4, 8, 48, 100... not just an enumerated list).
        const [unit] = parseNumberList(getRuleValue(values, "design-control-spacing"));
        if (unit > 0 && style.itemSpacing % unit !== 0) {
          const lower = Math.floor(style.itemSpacing / unit) * unit;
          const upper = Math.ceil(style.itemSpacing / unit) * unit;
          const fixOptions: { label: string; designFix: DesignFixAction }[] = [];
          if (lower > 0) {
            fixOptions.push({
              label: `${lower}px`,
              designFix: { kind: "item-spacing", spacing: lower },
            });
          }
          fixOptions.push({
            label: `${upper}px`,
            designFix: { kind: "item-spacing", spacing: upper },
          });
          push(
            makeIssue(
              "design_spacing",
              `Gap ${style.itemSpacing}px`,
              t("designCheck.gapNotMultiple", { current: style.itemSpacing, unit }),
              { suggestion: "", fixOptions }
            )
          );
        }
      }
      // Nested inside an instance but not an instance itself: trust the library's internal spacing, skip.
    }
  }

  if (
    // Only plain boxes sitting directly on the page — anything nested inside
    // a component/instance is managed by the library's own internal
    // structure (shadow or no shadow), not a raw page-level card.
    (node.type === "FRAME" || node.type === "RECTANGLE") &&
    !node.insideInstance &&
    isRuleEnabled(config, "design-card-shadow") &&
    style.fills.includes("FFFFFF") &&
    style.cornerRadius === 8
  ) {
    const expectedShadow = getRuleValue(values, "design-card-shadow").trim();
    if (expectedShadow) {
      const shadowFix: DesignFixAction = { kind: "effect-style", styleName: expectedShadow };
      if (!style.hasDropShadow || !style.effectStyleName) {
        push(
          makeIssue(
            "design_effect",
            t("designCheck.noDropShadowLabel"),
            t("designCheck.missingDropShadow", { name: node.name, expected: expectedShadow }),
            { suggestion: expectedShadow, designFix: shadowFix }
          )
        );
      } else if (style.effectStyleName !== expectedShadow) {
        push(
          makeIssue(
            "design_effect",
            style.effectStyleName,
            t("designCheck.wrongDropShadow", { name: node.name, current: style.effectStyleName, expected: expectedShadow }),
            { suggestion: expectedShadow, designFix: shadowFix }
          )
        );
      }
    }
  }

  if (
    node.type === "INSTANCE" &&
    isRuleEnabled(config, "design-instance-override") &&
    style.overriddenAppearance &&
    style.overriddenAppearance.length > 0
  ) {
    const details = style.overriddenAppearance
      .map((o) => {
        const changesText = o.changes
          .map((c) => `${t(`overrideField.${c.field}`)} ${c.before} → ${c.after}`)
          .join(", ");
        return `${o.nodeName}: ${changesText}`;
      })
      .join("; ");
    push(
      makeIssue(
        "design_override",
        details,
        t("designCheck.instanceOverride", { name: node.name, details })
      )
    );
  }

  return out;
}
