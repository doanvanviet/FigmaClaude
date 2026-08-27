import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

const watch = process.argv.includes("--watch");
const outDir = "dist";

fs.mkdirSync(outDir, { recursive: true });

/** @type {import('esbuild').BuildOptions} */
const codeOptions = {
  entryPoints: ["src/code.ts"],
  bundle: true,
  outfile: "dist/code.js",
  target: "es2017",
  format: "iife",
  logLevel: "info",
};

/** @type {import('esbuild').BuildOptions} */
const uiOptions = {
  entryPoints: ["src/ui.ts"],
  bundle: true,
  outfile: "dist/ui.bundle.js",
  target: "es2017",
  format: "iife",
  logLevel: "info",
};

function inlineUiHtml() {
  const template = fs.readFileSync("src/ui.html", "utf8");
  const script = fs.readFileSync("dist/ui.bundle.js", "utf8");
  const html = template.replace(
    "<!--UI_SCRIPT-->",
    `<script>\n${script}\n</script>`
  );
  fs.writeFileSync(path.join(outDir, "ui.html"), html);
  console.log("built dist/ui.html");
}

async function run() {
  if (watch) {
    const codeCtx = await esbuild.context(codeOptions);
    const uiCtx = await esbuild.context({
      ...uiOptions,
      plugins: [
        {
          name: "inline-html-on-rebuild",
          setup(build) {
            build.onEnd(() => inlineUiHtml());
          },
        },
      ],
    });
    await codeCtx.watch();
    await uiCtx.watch();
    console.log("watching for changes...");
  } else {
    await esbuild.build(codeOptions);
    await esbuild.build(uiOptions);
    inlineUiHtml();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
