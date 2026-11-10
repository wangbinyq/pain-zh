import fs from "node:fs";
import path from "node:path";
import { chapters, skipIndices } from "../data/chapters.js";

const dataDir = path.join(process.cwd(), "src", "data");

function readZh(slug) {
  const file = path.join(dataDir, "zh", `${slug}.txt`);
  if (!fs.existsSync(file)) return null;
  const map = new Map();
  let current = null;
  for (const raw of fs.readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^@@\s+(\d+)/);
    if (m) {
      current = Number(m[1]);
      continue;
    }
    if (current !== null && !map.has(current)) map.set(current, line);
  }
  return map;
}

const figures = JSON.parse(fs.readFileSync(path.join(dataDir, "figures.json"), "utf8"));

export function loadChapter(slug) {
  const meta = chapters.find((c) => c.slug === slug);
  if (!meta) return null;
  const source = JSON.parse(fs.readFileSync(path.join(dataDir, "source", `${slug}.json`), "utf8"));
  const zh = readZh(slug);
  const skip = new Set(skipIndices[slug] ?? [1, 2]);
  const figs = figures[slug] ?? {};
  const blocks = [];
  source.forEach((block, i) => {
    if (block.type === "figure" || skip.has(i)) return;
    blocks.push({
      type: block.type,
      en: block.text,
      zh: zh?.get(i) ?? null,
      images: figs[String(i)] ?? [],
    });
  });
  return { meta, blocks, translated: Boolean(zh) };
}

export function translatedChapters() {
  return chapters.filter((c) => fs.existsSync(path.join(dataDir, "zh", `${c.slug}.txt`)));
}

export function chapterIndex(slug) {
  return chapters.findIndex((c) => c.slug === slug);
}
