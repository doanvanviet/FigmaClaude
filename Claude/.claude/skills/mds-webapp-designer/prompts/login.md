# Prompt: Web Login Screen — MDS Web App

Màn hình đăng nhập web app chuẩn MDS. Frame 1440×900.

---

## Layout tổng thể

```
Frame: Login (1440×900, HORIZONTAL)
├── Left Panel (720×900, bg Brand gradient hoặc ảnh minh hoạ)
└── Right Panel (720×900, bg white, VERTICAL CENTER)
    └── Login Box (400×auto, VERTICAL, gap 32)
        ├── Logo + App name
        ├── Heading + Subtext
        ├── Form Fields
        ├── Actions
        └── Footer links
```

---

## Script mẫu

```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

// 1. Wrapper frame
let maxX = 0;
for (const c of figma.currentPage.children) maxX = Math.max(maxX, c.x + c.width);

const wrapper = figma.createAutoLayout("HORIZONTAL");
wrapper.name = "Login";
wrapper.resize(1440, 900);
wrapper.layoutSizingHorizontal = "FIXED";
wrapper.layoutSizingVertical = "FIXED";
wrapper.itemSpacing = 0;
wrapper.x = maxX + 200; wrapper.y = 0;

// 2. Left panel — brand panel
const leftPanel = figma.createAutoLayout("VERTICAL");
leftPanel.name = "Brand Panel";
leftPanel.fills = [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 } }];
leftPanel.resize(720, 900);
leftPanel.layoutSizingHorizontal = "FIXED";
leftPanel.layoutSizingVertical = "FILL";
leftPanel.primaryAxisAlignItems = "CENTER";
leftPanel.counterAxisAlignItems = "CENTER";
wrapper.appendChild(leftPanel);

// 3. Right panel
const rightPanel = figma.createAutoLayout("VERTICAL");
rightPanel.name = "Login Panel";
rightPanel.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
rightPanel.primaryAxisAlignItems = "CENTER";
rightPanel.counterAxisAlignItems = "CENTER";
wrapper.appendChild(rightPanel);
rightPanel.layoutSizingHorizontal = "FILL";
rightPanel.layoutSizingVertical = "FILL";

// 4. Login box
const loginBox = figma.createAutoLayout("VERTICAL");
loginBox.name = "Login Box";
loginBox.fills = [];
loginBox.itemSpacing = 24;
loginBox.primaryAxisAlignItems = "MIN";
loginBox.counterAxisAlignItems = "MIN";
loginBox.resize(400, 100);
loginBox.layoutSizingHorizontal = "FIXED";
rightPanel.appendChild(loginBox);

// 5. Logo
const logo = await figma.importComponentByKeyAsync("36553cc07ac41fc19f5cb0133650400c07c13337");
const logoInst = logo.createInstance();
loginBox.appendChild(logoInst);

// 6. Heading
const headingGroup = figma.createAutoLayout("VERTICAL");
headingGroup.fills = [];
headingGroup.itemSpacing = 8;
loginBox.appendChild(headingGroup);
headingGroup.layoutSizingHorizontal = "FILL";

const heading = figma.createText();
heading.characters = "Đăng nhập";
heading.fontSize = 28;
heading.fontName = { family: "Inter", style: "Bold" };
heading.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
headingGroup.appendChild(heading);

const subtext = figma.createText();
subtext.characters = "Chào mừng bạn quay lại! Hãy đăng nhập để tiếp tục.";
subtext.fontSize = 14;
subtext.fontName = { family: "Inter", style: "Regular" };
subtext.fills = [{ type: "SOLID", color: { r: 0.420, g: 0.447, b: 0.502 } }];
headingGroup.appendChild(subtext);

// 7. Form fields — dùng TextField component hoặc custom input (xem screen-patterns.md)
// Email field
const emailGroup = figma.createAutoLayout("VERTICAL");
emailGroup.fills = [];
emailGroup.itemSpacing = 6;
loginBox.appendChild(emailGroup);
emailGroup.layoutSizingHorizontal = "FILL";

const emailLabel = figma.createText();
emailLabel.characters = "Email";
emailLabel.fontSize = 13;
emailLabel.fontName = { family: "Inter", style: "Medium" };
emailLabel.fills = [{ type: "SOLID", color: { r: 0.157, g: 0.204, b: 0.294 } }];
emailGroup.appendChild(emailLabel);
emailLabel.layoutSizingHorizontal = "FILL";

// Thử TextField component
try {
  const tfSet = await figma.importComponentSetByKeyAsync("cec0aa5278edf04622d2f6de6eb1ae7f4ede92ea");
  const tf = tfSet.children.find(c =>
    c.name.includes("Type=Default") && c.name.includes("State=Placeholder")
  ) || tfSet.defaultVariant;
  const tfInst = tf.createInstance();
  emailGroup.appendChild(tfInst);
  tfInst.layoutSizingHorizontal = "FILL";
} catch(e) {
  // Fallback custom input
  const input = figma.createAutoLayout("HORIZONTAL");
  input.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  input.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
  input.strokeWeight = 1;
  input.cornerRadius = 8;
  input.paddingLeft = 12; input.paddingRight = 12;
  input.paddingTop = 10; input.paddingBottom = 10;
  input.counterAxisAlignItems = "CENTER";
  emailGroup.appendChild(input);
  input.layoutSizingHorizontal = "FILL";
  const t = figma.createText();
  t.characters = "Nhập email của bạn";
  t.fontSize = 14;
  t.fontName = { family: "Inter", style: "Regular" };
  t.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
  t.layoutGrow = 1;
  input.appendChild(t);
}

// 8. Primary login button
const btnSet = await figma.importComponentSetByKeyAsync("1127e80302210bea3d222691252f2a630ce7cbef");
const primaryBtn = btnSet.children.find(c =>
  c.name.includes("Color=Brand") &&
  c.name.includes("Style=Solid") &&
  c.name.includes("State=Default")
) || btnSet.defaultVariant;
const btnInst = primaryBtn.createInstance();
loginBox.appendChild(btnInst);
btnInst.layoutSizingHorizontal = "FILL";

return { success: true, wrapperId: wrapper.id };
```

---

## Checklist

- [ ] Logo MISA AMIS ở top
- [ ] Heading "Đăng nhập" + subtext
- [ ] Email field (TextField component hoặc custom fallback)
- [ ] Password field (TextField + eye icon hoặc custom)
- [ ] Remember me (Checkbox Label component)
- [ ] Quên mật khẩu link (Inter Medium 13, Brand color)
- [ ] Nút "Đăng nhập" (Button Medium, Color=Brand, Style=Solid, FILL width)
- [ ] Hoặc divider + SSO options nếu cần
- [ ] Footer: "Chưa có tài khoản? Đăng ký"
