figma.showUI(__html__, { width: 340, height: 460 });

// Types that can carry fills/strokes — used with findAllWithCriteria (native,
// fast path). If the running Figma API version rejects any type here, we fall
// back to a manual tree walk below.
var PAINTABLE_TYPES = [
  "BOOLEAN_OPERATION", "COMPONENT", "COMPONENT_SET", "ELLIPSE", "FRAME",
  "INSTANCE", "LINE", "POLYGON", "RECTANGLE", "STAR", "TEXT", "VECTOR",
  "STICKY", "SHAPE_WITH_TEXT", "CODE_BLOCK", "TABLE", "TABLE_CELL", "SECTION"
];

function hexToRgb(hex) {
  var h = String(hex || "").trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255
  };
}

function colorsMatch(a, b) {
  return Math.round(a.r * 255) === Math.round(b.r * 255) &&
    Math.round(a.g * 255) === Math.round(b.g * 255) &&
    Math.round(a.b * 255) === Math.round(b.b * 255);
}

function rgbToHex(rgb) {
  function toHex(v) {
    var h = Math.round(v * 255).toString(16);
    return h.length === 1 ? "0" + h : h;
  }
  return "#" + (toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b)).toUpperCase();
}

function firstSolidColor(paints) {
  if (!Array.isArray(paints)) return null;
  for (var i = 0; i < paints.length; i++) {
    if (paints[i].type === "SOLID" && paints[i].visible !== false) return paints[i].color;
  }
  return null;
}

function safeColor(node) {
  try {
    return firstSolidColor(node.fills) || firstSolidColor(node.strokes);
  } catch (e) {
    return null;
  }
}

function pickColorFromSelection() {
  var sel = figma.currentPage.selection;
  if (!sel.length) return null;
  var node = sel[0];
  var color = safeColor(node);
  if (color) return color;
  if (typeof node.findOne === "function") {
    var found = node.findOne(function (n) { return !!safeColor(n); });
    if (found) return safeColor(found);
  }
  return null;
}

function collectTargets(roots) {
  var targets = [];
  var seen = new Set();

  function add(node) {
    if (!seen.has(node.id)) {
      seen.add(node.id);
      targets.push(node);
    }
  }

  for (var i = 0; i < roots.length; i++) {
    var root = roots[i];
    if (PAINTABLE_TYPES.indexOf(root.type) !== -1) add(root);

    if (typeof root.findAllWithCriteria === "function") {
      try {
        var found = root.findAllWithCriteria({ types: PAINTABLE_TYPES });
        for (var j = 0; j < found.length; j++) add(found[j]);
        continue;
      } catch (e) {
        // Unsupported type on this API version — fall back below.
      }
      if (typeof root.findAll === "function") {
        var manual = root.findAll(function (n) {
          return "fills" in n || "strokes" in n;
        });
        for (var k = 0; k < manual.length; k++) add(manual[k]);
      }
    }
  }
  return targets;
}

function findReplacement(paint, pairs) {
  if (paint.type !== "SOLID") return null;
  if (paint.boundVariables && paint.boundVariables.color) return null;
  for (var i = 0; i < pairs.length; i++) {
    if (colorsMatch(paint.color, pairs[i].oldColor)) return pairs[i].newColor;
  }
  return null;
}

function replaceOnNode(node, pairs, doFill, doStroke) {
  var fillHits = 0, strokeHits = 0;

  // Some instance sublayer / table cell nodes throw internally on property
  // access even though findAllWithCriteria returned them — skip those rather
  // than aborting the whole run.
  try {
    if (doFill && Array.isArray(node.fills) && node.fills !== figma.mixed) {
      var changedFill = false;
      var newFills = node.fills.map(function (paint) {
        var repl = findReplacement(paint, pairs);
        if (repl) {
          changedFill = true;
          fillHits++;
          return Object.assign({}, paint, { color: { r: repl.r, g: repl.g, b: repl.b } });
        }
        return paint;
      });
      if (changedFill) node.fills = newFills;
    }
  } catch (e) {
    fillHits = 0;
  }

  try {
    if (doStroke && Array.isArray(node.strokes) && node.strokes !== figma.mixed) {
      var changedStroke = false;
      var newStrokes = node.strokes.map(function (paint) {
        var repl = findReplacement(paint, pairs);
        if (repl) {
          changedStroke = true;
          strokeHits++;
          return Object.assign({}, paint, { color: { r: repl.r, g: repl.g, b: repl.b } });
        }
        return paint;
      });
      if (changedStroke) node.strokes = newStrokes;
    }
  } catch (e) {
    strokeHits = 0;
  }

  return { fillHits: fillHits, strokeHits: strokeHits };
}

figma.ui.onmessage = function (msg) {
  if (msg.type === "close") {
    figma.closePlugin();
    return;
  }

  if (msg.type === "grabColor") {
    var picked = pickColorFromSelection();
    figma.ui.postMessage({ type: "pickedColor", hex: picked ? rgbToHex(picked) : null });
    if (!picked) figma.notify("No solid color found in the current selection");
    return;
  }

  if (msg.type !== "replace") return;

  var rawPairs = Array.isArray(msg.pairs) ? msg.pairs : [];
  var pairs = [];
  for (var p = 0; p < rawPairs.length; p++) {
    var oldColor = hexToRgb(rawPairs[p].old);
    var newColor = hexToRgb(rawPairs[p].new);
    if (oldColor && newColor) pairs.push({ oldColor: oldColor, newColor: newColor });
  }

  if (!pairs.length) {
    figma.ui.postMessage({ type: "result", error: "No valid color pairs. Use the format #RRGGBB, #RRGGBB." });
    return;
  }

  var roots;
  if (msg.scope === "selection") {
    roots = figma.currentPage.selection.slice();
    if (roots.length === 0) {
      figma.ui.postMessage({ type: "result", error: "Nothing is selected on the page." });
      return;
    }
  } else {
    roots = figma.currentPage.children.slice();
  }

  var t0 = Date.now();
  var targets = collectTargets(roots);

  var nodesChanged = 0, fillHits = 0, strokeHits = 0;
  for (var i = 0; i < targets.length; i++) {
    var res = replaceOnNode(targets[i], pairs, !!msg.fill, !!msg.stroke);
    if (res.fillHits || res.strokeHits) {
      nodesChanged++;
      fillHits += res.fillHits;
      strokeHits += res.strokeHits;
    }
  }
  var ms = Date.now() - t0;

  figma.ui.postMessage({
    type: "result",
    nodesScanned: targets.length,
    nodesChanged: nodesChanged,
    fillHits: fillHits,
    strokeHits: strokeHits,
    ms: ms
  });

  if (nodesChanged > 0) {
    figma.notify("Replaced " + (fillHits + strokeHits) + " colors on " + nodesChanged + " nodes (" + ms + "ms)");
  } else {
    figma.notify("No matching colors found to replace");
  }
};
