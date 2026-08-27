export type RuleScope = "local" | "ai-en" | "ai-vi" | "design-app";

export interface RuleEditable {
  /** i18n key for the label shown next to the value input in the config panel */
  labelKey: string;
  placeholder?: string;
  /** stored/parsed as a plain string; consumers parse numbers/lists themselves */
  default: string;
}

export interface RuleDefinition {
  id: string;
  /** i18n key resolved via t() at render time, not a literal string — the same rule list serves every UI language */
  labelKey: string;
  descriptionKey: string;
  scope: RuleScope;
  enabledByDefault: boolean;
  /** when present, the config panel shows an editable value input for this rule */
  editable?: RuleEditable;
}

/**
 * Rule catalogue shown in the plugin's config panel. "local" rules run as
 * regex checks with no API key needed. "ai-en"/"ai-vi" rules are issue types
 * the Gemini prompt is instructed to look for — disabling one removes it from
 * the prompt for that mode instead of just hiding it from the UI. "design-app"
 * rules lint node style properties against Design System tokens and only
 * run when "Review Web App" is used. Labels/descriptions are i18n keys (see
 * i18n.ts) rather than literal text, editable placeholders/defaults are
 * literal data values (numbers, technical names) so they don't need
 * translating.
 */
export const RULE_DEFINITIONS: RuleDefinition[] = [
  {
    id: "spacing-double-space",
    labelKey: "rule.spacingDoubleSpace.label",
    descriptionKey: "rule.spacingDoubleSpace.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "spacing-split-known-term",
    labelKey: "rule.spacingSplitKnownTerm.label",
    descriptionKey: "rule.spacingSplitKnownTerm.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "spacing-edge",
    labelKey: "rule.spacingEdge.label",
    descriptionKey: "rule.spacingEdge.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "spacing-before-punct",
    labelKey: "rule.spacingBeforePunct.label",
    descriptionKey: "rule.spacingBeforePunct.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "spacing-after-punct",
    labelKey: "rule.spacingAfterPunct.label",
    descriptionKey: "rule.spacingAfterPunct.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "punct-repeated",
    labelKey: "rule.punctRepeated.label",
    descriptionKey: "rule.punctRepeated.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "number-thousand-separator",
    labelKey: "rule.numberThousandSeparator.label",
    descriptionKey: "rule.numberThousandSeparator.description",
    scope: "local",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.numberThousandSeparator.editableLabel",
      placeholder: ".",
      default: ".",
    },
  },
  {
    id: "text-case-consistency",
    labelKey: "rule.textCaseConsistency.label",
    descriptionKey: "rule.textCaseConsistency.description",
    scope: "local",
    enabledByDefault: true,
  },
  {
    id: "ai-non-english",
    labelKey: "rule.aiNonEnglish.label",
    descriptionKey: "rule.aiNonEnglish.description",
    scope: "ai-en",
    enabledByDefault: true,
  },
  {
    id: "ai-spelling-en",
    labelKey: "rule.aiSpellingEn.label",
    descriptionKey: "rule.aiSpellingEn.description",
    scope: "ai-en",
    enabledByDefault: true,
  },
  {
    id: "ai-grammar-en",
    labelKey: "rule.aiGrammarEn.label",
    descriptionKey: "rule.aiGrammarEn.description",
    scope: "ai-en",
    enabledByDefault: false,
  },
  {
    id: "ai-nonsense-vi",
    labelKey: "rule.aiNonsenseVi.label",
    descriptionKey: "rule.aiNonsenseVi.description",
    scope: "ai-vi",
    enabledByDefault: true,
  },
  {
    id: "ai-proper-noun-vi",
    labelKey: "rule.aiProperNounVi.label",
    descriptionKey: "rule.aiProperNounVi.description",
    scope: "ai-vi",
    enabledByDefault: false,
  },
  {
    id: "ai-grammar-vi",
    labelKey: "rule.aiGrammarVi.label",
    descriptionKey: "rule.aiGrammarVi.description",
    scope: "ai-vi",
    enabledByDefault: false,
  },
  {
    id: "design-font-family",
    labelKey: "rule.designFontFamily.label",
    descriptionKey: "rule.designFontFamily.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designFontFamily.editableLabel",
      placeholder: "Inter",
      default: "Inter",
    },
  },
  {
    id: "design-font-size",
    labelKey: "rule.designFontSize.label",
    descriptionKey: "rule.designFontSize.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designFontSize.editableLabel",
      placeholder: "20, 16, 13, 12",
      default: "20,16,13,12",
    },
  },
  {
    id: "design-text-color",
    labelKey: "rule.designTextColor.label",
    descriptionKey: "rule.designTextColor.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designTextColor.editableLabel",
      placeholder: "0D6EFD, 212529, 6C757D",
      default: "",
    },
  },
  {
    id: "design-border-color",
    labelKey: "rule.designBorderColor.label",
    descriptionKey: "rule.designBorderColor.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designBorderColor.editableLabel",
      placeholder: "0D6EFD, DEE2E6",
      default: "",
    },
  },
  {
    id: "design-control-height",
    labelKey: "rule.designControlHeight.label",
    descriptionKey: "rule.designControlHeight.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designControlHeight.editableLabel",
      placeholder: "32",
      default: "32",
    },
  },
  {
    id: "design-control-radius",
    labelKey: "rule.designControlRadius.label",
    descriptionKey: "rule.designControlRadius.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designControlRadius.editableLabel",
      placeholder: "8, 12",
      default: "8,12",
    },
  },
  {
    id: "design-control-spacing",
    labelKey: "rule.designControlSpacing.label",
    descriptionKey: "rule.designControlSpacing.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designControlSpacing.editableLabel",
      placeholder: "4",
      default: "4",
    },
  },
  {
    id: "design-button-row-gap",
    labelKey: "rule.designButtonRowGap.label",
    descriptionKey: "rule.designButtonRowGap.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designButtonRowGap.editableLabel",
      placeholder: "8",
      default: "8",
    },
  },
  {
    id: "design-card-shadow",
    labelKey: "rule.designCardShadow.label",
    descriptionKey: "rule.designCardShadow.description",
    scope: "design-app",
    enabledByDefault: true,
    editable: {
      labelKey: "rule.designCardShadow.editableLabel",
      placeholder: "Drop Shadow/Neutral/All 2",
      default: "Drop Shadow/Neutral/All 2",
    },
  },
  {
    id: "design-instance-override",
    labelKey: "rule.designInstanceOverride.label",
    descriptionKey: "rule.designInstanceOverride.description",
    scope: "design-app",
    enabledByDefault: true,
  },
];

export type RulesConfig = Record<string, boolean>;
export type RuleValues = Record<string, string>;

export function defaultRulesConfig(): RulesConfig {
  const config: RulesConfig = {};
  for (const rule of RULE_DEFINITIONS) {
    config[rule.id] = rule.enabledByDefault;
  }
  return config;
}

export function defaultRuleValues(): RuleValues {
  const values: RuleValues = {};
  for (const rule of RULE_DEFINITIONS) {
    if (rule.editable) values[rule.id] = rule.editable.default;
  }
  return values;
}

export function isRuleEnabled(config: RulesConfig, ruleId: string): boolean {
  return config[ruleId] !== false;
}

export function getRuleValue(values: RuleValues, ruleId: string): string {
  const rule = RULE_DEFINITIONS.find((r) => r.id === ruleId);
  const raw = values[ruleId];
  return raw !== undefined && raw.trim() !== "" ? raw : rule?.editable?.default ?? "";
}

export function parseNumberList(value: string): number[] {
  return value
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

/** Normalizes a comma-separated hex list ("#0D6EFD, 212529") to bare uppercase 6-digit hex strings, dropping anything that isn't a valid hex color. */
export function parseHexList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim().replace(/^#/, "").toUpperCase())
    .filter((s) => /^[0-9A-F]{6}$/.test(s));
}
