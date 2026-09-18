#!/usr/bin/env node

/**
 * CLI Runner for Vidioteip
 * Usage:
 *   node scripts/render-cli.mjs --composition=NewsVertical --out=out/news.mp4
 *   node scripts/render-cli.mjs --composition=NewsHorizontal --frames=0-60
 */

import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const args = process.argv.slice(2);
let composition = "NewsVertical";
let out = "out/news-vertical.mp4";
let frames = "";

for (const arg of args) {
  if (arg.startsWith("--composition=")) {
    composition = arg.split("=")[1];
    if (composition === "NewsHorizontal") {
      out = "out/news-horizontal.mp4";
    }
  } else if (arg.startsWith("--out=")) {
    out = arg.split("=")[1];
  } else if (arg.startsWith("--frames=")) {
    frames = `--frames=${arg.split("=")[1]}`;
  }
}

// Ensure output directory exists
const outDir = path.dirname(path.resolve(process.cwd(), out));
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`\n🎬 [Vidioteip CLI] Starting render...`);
console.log(`   Composition: ${composition}`);
console.log(`   Destination: ${out}`);
if (frames) console.log(`   Frames:      ${frames}`);

const cmd = `npx remotion render ${composition} ${out} ${frames}`.trim();
console.log(`   Command:     ${cmd}\n`);

try {
  execSync(cmd, { stdio: "inherit" });
  console.log(`\n✅ Render completed successfully -> ${out}\n`);
} catch (error) {
  console.error(`\n❌ Render failed:`, error.message);
  process.exit(1);
}
