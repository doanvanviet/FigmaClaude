figma.showUI(__html__, { width: 540, height: 680 });

/**
 * PHẦN 1: LOGIC PHÂN TÍCH CODE (PARSER)
 * Chuyển đổi mã từ AI Studio (JSX/TSX) thành cấu trúc cây để Figma có thể đọc được.
 */
function parseJSX(code) {
  let jsx = code;

  // 1. Loại bỏ các phần không phải giao diện để Parser không bị rối
  jsx = jsx.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, ""); // Xóa imports
  jsx = jsx.replace(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/g, ""); // Xóa khai báo hàm
  jsx = jsx.replace(/<[A-Z][A-Za-z0-9]*\s*<[^>]+>>/g, ""); // Xóa Generic TypeScript như <number[]>

  // 2. Tìm khối return cuối cùng (nơi chứa UI thực sự)
  const lastReturn = jsx.lastIndexOf("return");
  if (lastReturn !== -1) {
    jsx = jsx.substring(lastReturn + 6).trim();
  }

  // 3. Xóa các dấu ngoặc bao quanh return (...)
  if (jsx.startsWith("(")) jsx = jsx.substring(1);
  if (jsx.endsWith(");") || jsx.endsWith(")")) {
    jsx = jsx.substring(0, jsx.lastIndexOf(")"));
  }

  // 4. Xử lý các biểu thức { condition ? <Tag/> : <Tag/> }
  // Thay thế các dấu {} bằng thẻ ảo <Fragment> để parser đọc được nội dung bên trong
  jsx = jsx.replace(/\{/g, "<Expression>").replace(/\}/g, "</Expression>");

  const firstTag = jsx.search(/<[A-Za-z]/);
  if (firstTag === -1) return null;

  jsx = jsx.substring(firstTag);
  const result = parseElement(jsx, 0);
  return result ? result.node : null;
}

function parseElement(code, pos) {
  while (pos < code.length && /\s/.test(code[pos])) pos++;
  if (code[pos] !== "<") return null;
  pos++;
  
  let tagName = "";
  while (pos < code.length && /[A-Za-z0-9.]/.test(code[pos])) tagName += code[pos++];
  
  let className = "";
  let selfClosing = false;
  
  while (pos < code.length && code[pos] !== ">") {
    if (code[pos] === "/" && code[pos+1] === ">") { selfClosing = true; pos += 2; break; }
    if (code.substring(pos, pos+9) === "className") {
      pos += 9; while (pos < code.length && code[pos] !== "=") pos++; pos++;
      if (code[pos] === '"') {
        pos++; let start = pos; while (pos < code.length && code[pos] !== '"') pos++;
        className = code.substring(start, pos); pos++;
      } else pos++;
    } else pos++;
  }
  if (!selfClosing) pos++;

  const node = { tagName, className, text: "", children: [] };
  if (selfClosing) return { node, nextPos: pos };

  const closeTag = `</${tagName}>`;
  while (pos < code.length) {
    if (code.substring(pos, pos + closeTag.length) === closeTag) {
      pos += closeTag.length;
      return { node, nextPos: pos };
    }
    if (code[pos] === "<" && code[pos+1] !== "/") {
      const child = parseElement(code, pos);
      if (child) { node.children.push(child.node); pos = child.nextPos; continue; }
    }
    if (code[pos] !== "<") node.text += code[pos++];
    else pos++;
  }
  return null;
}

/**
 * PHẦN 2: LOGIC VẼ VÀO FIGMA
 * Sử dụng Mapping để thay thế các thẻ code bằng Component thật trong Figma.
 */
async function renderNode(node, parent, mappings) {
  if (!node) return;
  
  // Kiểm tra nếu Tag này đã được người dùng Map sang một Component cụ thể
  if (mappings[node.tagName]) {
    try {
      const comp = await figma.importComponentByKeyAsync(mappings[node.tagName].key);
      const inst = comp.createInstance();
      parent.appendChild(inst);
      return; // Đã vẽ xong component này, không cần duyệt con bên trong (vì nó là instance)
    } catch (e) {
      console.error("Lỗi nạp component: " + node.tagName, e);
    }
  }

  // Nếu không map hoặc không tìm thấy component, tạo một Frame mặc định (Auto Layout)
  const frame = figma.createFrame();
  frame.name = node.tagName;
  
  // Áp dụng Auto Layout cơ bản dựa trên ClassName của Tailwind
  frame.layoutMode = node.className.includes('flex-col') ? "VERTICAL" : "HORIZONTAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  
  // Tính toán Item Spacing (Gap)
  const gapMatch = node.className.match(/gap-([\d.]+)/);
  if (gapMatch) frame.itemSpacing = parseFloat(gapMatch[1]) * 4;
  
  parent.appendChild(frame);

  // Nếu có text bên trong tag
  if (node.text.trim()) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const t = figma.createText();
    t.characters = node.text.trim();
    frame.appendChild(t);
  }

  // Duyệt các con bên trong
  for (const child of node.children) {
    await renderNode(child, frame, mappings);
  }
}

/**
 * PHẦN 3: GIAO TIẾP VỚI UI.HTML
 * Xử lý các lệnh từ giao diện gửi xuống.
 */
figma.ui.onmessage = async (msg) => {
  // Lệnh 1: Phân tích các Tag có trong code
  if (msg.type === "detect") {
    const tree = parseJSX(msg.code);
    const counts = {};
    const walk = (n) => {
      if (!n) return;
      // Chỉ lấy các tag tùy chỉnh (Chữ hoa) hoặc các tag input quan trọng
      if (/^[A-Z]/.test(n.tagName) || ["button", "input", "img", "textarea"].includes(n.tagName)) {
        counts[n.tagName] = (counts[n.tagName] || 0) + 1;
      }
      n.children.forEach(walk);
    };
    walk(tree);
    
    const controls = Object.keys(counts).map(k => ({ name: k, count: counts[k] }));
    figma.ui.postMessage({ type: "detected", controls: controls });
  } 
  
  // Lệnh 2: Lấy danh sách tất cả Component đang có trong file và thư viện đã bật
  else if (msg.type === "load-components") {
    const components = figma.root.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })
      .map(c => ({ key: c.key, name: c.name }));
    figma.ui.postMessage({ type: "components-loaded", components: components });
  } 
  
  // Lệnh 3: Thực hiện vẽ UI vào canvas Figma
  else if (msg.type === "convert") {
    const tree2 = parseJSX(msg.code);
    if (!tree2) {
      figma.notify("⚠️ Không thể đọc được cấu trúc code!");
      return;
    }

    const root = figma.createFrame();
    root.name = "AI Generated Screen";
    root.layoutMode = "VERTICAL";
    root.primaryAxisSizingMode = "AUTO";
    root.counterAxisSizingMode = "AUTO";
    root.itemSpacing = 20;
    root.paddingTop = root.paddingBottom = root.paddingLeft = root.paddingRight = 40;
    
    figma.currentPage.appendChild(root);
    
    await renderNode(tree2, root, msg.mappings || {});
    
    figma.viewport.scrollAndZoomIntoView([root]);
    figma.ui.postMessage({ type: "done", text: "🎉 Đã vẽ xong thiết kế!" });
  }
};