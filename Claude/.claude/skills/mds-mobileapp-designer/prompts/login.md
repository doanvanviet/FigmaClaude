# Prompt: Mobile Login Screen — MDS Mobile App

Màn hình đăng nhập mobile app chuẩn MDS. Frame 390×844 (iPhone 14 Pro).

---

## Layout tổng thể

```
Frame: Login (390×844, VERTICAL, bg BG/Page)
├── Status Bar (component, FILL)
├── Content (FILL×FILL, VERTICAL, CENTER)
│   ├── Logo + App name (CENTER)
│   ├── Greeting text (CENTER)
│   ├── Form section (VERTICAL, gap 16, paddingH 24)
│   │   ├── Email field (TextField component hoặc custom)
│   │   └── Password field (TextField + eye hoặc custom)
│   ├── Options row (HORIZONTAL, SPACE_BETWEEN, paddingH 24)
│   │   ├── Remember me (Checkbox Label component)
│   │   └── Quên mật khẩu (link text)
│   ├── Login button (Button Medium, Brand/Solid, FILL, marginH 24)
│   ├── Divider với "hoặc" text
│   └── SSO button (Button Medium, Gray/Outline, FILL, marginH 24)
└── Footer: Chưa có tài khoản? Đăng ký
```

---

## Script mẫu đầy đủ

```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

// 1. Frame wrapper
let maxX = 0;
for (const c of figma.currentPage.children) maxX = Math.max(maxX, c.x + c.width);

const wrapper = figma.createAutoLayout("VERTICAL");
wrapper.name = "Login";
wrapper.resize(390, 844);
wrapper.layoutSizingHorizontal = "FIXED";
wrapper.layoutSizingVertical = "FIXED";
wrapper.fills = [{ type: "SOLID", color: { r: 0.953, g: 0.957, b: 0.965 } }];
wrapper.primaryAxisAlignItems = "MIN";
wrapper.counterAxisAlignItems = "MIN";
wrapper.itemSpacing = 0;
wrapper.clipsContent = true;
wrapper.x = maxX + 200; wrapper.y = 0;

// 2. Status Bar
const sbSet = await figma.importComponentSetByKeyAsync("600b05b4627ac58c286648585bc9c2329138a2b4");
const sb = sbSet.children.find(c =>
  c.name.includes("Theme=Default") &&
  c.name.includes("Device=iPhone (Notch)") &&
  c.name.includes("Portrait")
) || sbSet.defaultVariant;
const sbInst = sb.createInstance();
wrapper.appendChild(sbInst);
sbInst.layoutSizingHorizontal = "FILL";

// 3. Content area (scrollable zone)
const content = figma.createAutoLayout("VERTICAL");
content.name = "Content";
content.fills = [];
content.paddingTop = 40;
content.paddingBottom = 32;
content.paddingLeft = 24;
content.paddingRight = 24;
content.itemSpacing = 24;
content.primaryAxisAlignItems = "MIN";
content.counterAxisAlignItems = "CENTER";
wrapper.appendChild(content);
content.layoutSizingHorizontal = "FILL";
content.layoutSizingVertical = "FILL";

// 4. Logo (MISA AMIS)
const logo = await figma.importComponentByKeyAsync("36553cc07ac41fc19f5cb0133650400c07c13337");
const logoInst = logo.createInstance();
content.appendChild(logoInst);

// 5. Greeting
const greetGroup = figma.createAutoLayout("VERTICAL");
greetGroup.fills = [];
greetGroup.itemSpacing = 8;
greetGroup.counterAxisAlignItems = "CENTER";
content.appendChild(greetGroup);
greetGroup.layoutSizingHorizontal = "FILL";

const greetTitle = figma.createText();
greetTitle.characters = "Chào mừng bạn!";
greetTitle.fontSize = 24;
greetTitle.fontName = { family: "Inter", style: "Bold" };
greetTitle.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
greetTitle.textAlignHorizontal = "CENTER";
greetGroup.appendChild(greetTitle);
greetTitle.layoutSizingHorizontal = "FILL";

const greetSub = figma.createText();
greetSub.characters = "Đăng nhập để tiếp tục sử dụng ứng dụng";
greetSub.fontSize = 14;
greetSub.fontName = { family: "Inter", style: "Regular" };
greetSub.fills = [{ type: "SOLID", color: { r: 0.420, g: 0.447, b: 0.502 } }];
greetSub.textAlignHorizontal = "CENTER";
greetGroup.appendChild(greetSub);
greetSub.layoutSizingHorizontal = "FILL";

// 6. Form section
const formSection = figma.createAutoLayout("VERTICAL");
formSection.fills = [];
formSection.itemSpacing = 16;
content.appendChild(formSection);
formSection.layoutSizingHorizontal = "FILL";

// Email field
const emailGroup = figma.createAutoLayout("VERTICAL");
emailGroup.fills = [];
emailGroup.itemSpacing = 8;
formSection.appendChild(emailGroup);
emailGroup.layoutSizingHorizontal = "FILL";

const emailLabel = figma.createText();
emailLabel.characters = "Email";
emailLabel.fontSize = 13;
emailLabel.fontName = { family: "Inter", style: "Medium" };
emailLabel.fills = [{ type: "SOLID", color: { r: 0.157, g: 0.204, b: 0.294 } }];
emailGroup.appendChild(emailLabel);

// TextField component hoặc custom
try {
  const tfSet = await figma.importComponentSetByKeyAsync("cec0aa5278edf04622d2f6de6eb1ae7f4ede92ea");
  const tf = tfSet.children.find(c =>
    c.name.includes("Type=Default") && c.name.includes("State=Placeholder")
  ) || tfSet.defaultVariant;
  const tfInst = tf.createInstance();
  emailGroup.appendChild(tfInst);
  tfInst.layoutSizingHorizontal = "FILL";
} catch(e) {
  const box = figma.createAutoLayout("HORIZONTAL");
  box.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.980, b: 0.988 } }];
  box.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
  box.strokeWeight = 1.5;
  box.cornerRadius = 12;
  box.paddingLeft = 16; box.paddingRight = 16;
  box.paddingTop = 14; box.paddingBottom = 14;
  box.counterAxisAlignItems = "CENTER";
  emailGroup.appendChild(box);
  box.layoutSizingHorizontal = "FILL";
  const t = figma.createText();
  t.characters = "Nhập email của bạn";
  t.fontSize = 15;
  t.fontName = { family: "Inter", style: "Regular" };
  t.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
  t.layoutGrow = 1;
  box.appendChild(t);
}

// 7. Options row (Remember + Forgot)
const optionsRow = figma.createAutoLayout("HORIZONTAL");
optionsRow.fills = [];
optionsRow.primaryAxisAlignItems = "SPACE_BETWEEN";
optionsRow.counterAxisAlignItems = "CENTER";
content.appendChild(optionsRow);
optionsRow.layoutSizingHorizontal = "FILL";

// Checkbox Label component
try {
  const cbSet = await figma.importComponentSetByKeyAsync("d59202792d9b8aa4772a432ce665647efc106663");
  const cb = cbSet.children.find(c =>
    c.name.includes("Status=Unchecked") && c.name.includes("Disabled=off")
  ) || cbSet.defaultVariant;
  const cbInst = cb.createInstance();
  optionsRow.appendChild(cbInst);
} catch(e) {
  const remText = figma.createText();
  remText.characters = "Ghi nhớ đăng nhập";
  remText.fontSize = 13;
  remText.fontName = { family: "Inter", style: "Regular" };
  remText.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
  optionsRow.appendChild(remText);
}

const forgotText = figma.createText();
forgotText.characters = "Quên mật khẩu?";
forgotText.fontSize = 13;
forgotText.fontName = { family: "Inter", style: "Medium" };
forgotText.fills = [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 } }];
optionsRow.appendChild(forgotText);

// 8. Login button (Button Medium Brand/Solid)
const btnSet = await figma.importComponentSetByKeyAsync("1127e80302210bea3d222691252f2a630ce7cbef");
const primaryV = btnSet.children.find(c =>
  c.name.includes("Color=Brand") &&
  c.name.includes("Style=Solid") &&
  c.name.includes("State=Default")
) || btnSet.defaultVariant;
const loginBtn = primaryV.createInstance();
content.appendChild(loginBtn);
loginBtn.layoutSizingHorizontal = "FILL";

// 9. Divider "hoặc"
const dividerRow = figma.createAutoLayout("HORIZONTAL");
dividerRow.fills = [];
dividerRow.counterAxisAlignItems = "CENTER";
dividerRow.itemSpacing = 12;
content.appendChild(dividerRow);
dividerRow.layoutSizingHorizontal = "FILL";

const divSet = await figma.importComponentSetByKeyAsync("116bc5d9d9475271ebfe0aef292c0c54c98831c9");
const divV = divSet.children.find(c =>
  c.name.includes("Size=1") && c.name.includes("Horizontal=True")
) || divSet.defaultVariant;

const div1 = divV.createInstance();
dividerRow.appendChild(div1);
div1.layoutSizingHorizontal = "FILL";

const orText = figma.createText();
orText.characters = "hoặc";
orText.fontSize = 13;
orText.fontName = { family: "Inter", style: "Regular" };
orText.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
dividerRow.appendChild(orText);

const div2 = divV.createInstance();
dividerRow.appendChild(div2);
div2.layoutSizingHorizontal = "FILL";

// 10. SSO button (Button Medium Gray/Outline)
const ssoV = btnSet.children.find(c =>
  c.name.includes("Color=Gray") &&
  c.name.includes("Style=Outline") &&
  c.name.includes("State=Default")
) || btnSet.defaultVariant;
const ssoBtn = ssoV.createInstance();
content.appendChild(ssoBtn);
ssoBtn.layoutSizingHorizontal = "FILL";

// 11. Home Indicator
const hiSet = await figma.importComponentSetByKeyAsync("a3d0ec72f838dc7ce3241e4d54e2d2b7070e9029");
const hi = hiSet.children.find(c =>
  c.name.includes("Device=iPhone") && c.name.includes("Portrait")
) || hiSet.defaultVariant;
const hiInst = hi.createInstance();
wrapper.appendChild(hiInst);
hiInst.layoutSizingHorizontal = "FILL";

return { success: true, wrapperId: wrapper.id };
```

---

## Checklist

- [ ] Status Bar (component, iPhone Notch, Default theme)
- [ ] Logo MISA AMIS hoặc logo sản phẩm
- [ ] Greeting heading + subtext (CENTER align)
- [ ] Email field (TextField component + label)
- [ ] Password field (TextField + eye icon + label)
- [ ] Remember me (Checkbox Label component) + Quên mật khẩu link
- [ ] Nút "Đăng nhập" (Button Medium Brand/Solid, FILL)
- [ ] Divider "hoặc"
- [ ] SSO / đăng nhập khác (Button Medium Gray/Outline, FILL)
- [ ] Footer text: Chưa có tài khoản? Đăng ký
- [ ] Home Indicator (component, iPhone, Portrait)
