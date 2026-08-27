/**
 * Control-name keyword lists used to recognize which layers are "controls"
 * for the height/radius checks. Default numeric token values (height, radius,
 * spacing, font size/family) live as editable defaults in rulesConfig.ts
 * instead of here, so they can be tuned from the plugin's rule panel without
 * a rebuild.
 */
export const CONTROL_HEIGHT_KEYWORDS = [
  "button",
  "textbox",
  "textarea",
  "numberbox",
  "datetimebox",
  "combobox",
  "searchbox",
];

/**
 * Deliberately excluded from CONTROL_HEIGHT_KEYWORDS:
 * - checkbox, radio, switch (toggle), tag — small compact controls with their
 *   own natural sizing, never meant to match the 32px control-height standard.
 * - dropdown — "Dropdown Menu" is the floating list/menu container (its own
 *   height depends on how many items it shows), a different kind of
 *   component from the actual 32px input controls above. Combobox already
 *   covers the real trigger control that opens one.
 */

/**
 * Plain icons (nested inside a control, or floating loose on a page) aren't
 * controls themselves and don't have a required height — a chevron icon
 * inside a Dropdown, or a search glyph inside a SearchBox, shouldn't be held
 * to the 32px control height just because its name embeds the parent
 * control's keyword. "Button Icon" / "Icon Button" is the one deliberate
 * exception: that's its own dedicated icon-button component with a real
 * height requirement, recognized by also matching the "button" keyword.
 */
export const ICON_KEYWORDS = ["icon"];

/** Hyperlink's own 4px Gap (e.g. between an external-link icon and its label) is intentional, not a violation. */
export const HYPERLINK_KEYWORDS = ["hyperlink"];

export const LARGE_RADIUS_KEYWORDS = ["card", "modal", "popup", "dialog"];

// Kept separate from CONTROL_HEIGHT_KEYWORDS on purpose: checkbox/radio/switch
// don't have the 32px control height, but they DO have their own bo-góc
// standard, so they still belong in the radius check.
export const CONTROL_RADIUS_KEYWORDS = [
  "button",
  "textbox",
  "textarea",
  "numberbox",
  "datetimebox",
  "combobox",
  "dropdown",
  "searchbox",
  "checkbox",
  "radio",
  "switch",
  ...LARGE_RADIUS_KEYWORDS,
  "tooltip",
];

export function matchesKeyword(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}
