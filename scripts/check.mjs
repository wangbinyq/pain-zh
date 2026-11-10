import fs from "node:fs";
import path from "node:path";
import { chapters, skipIndices } from "../src/data/chapters.js";

const dataDir = path.join(process.cwd(), "src", "data");
let failed = false;

for (const chapter of chapters) {
  const zhFile = path.join(dataDir, "zh", `${chapter.slug}.txt`);
  const source = JSON.parse(fs.readFileSync(path.join(dataDir, "source", `${chapter.slug}.json`), "utf8"));
  const skip = new Set(skipIndices[chapter.slug] ?? [1, 2]);
  const expected = source.map((b, i) => (b.type === "figure" || skip.has(i) ? null : i)).filter((i) => i !== null);

  if (!fs.existsSync(zhFile)) {
    console.log(`pending  ${chapter.slug}  (${expected.length} blocks untranslated)`);
    continue;
  }

  const seen = new Map();
  let current = null;
  for (const raw of fs.readFileSync(zhFile, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^@@\s+(\d+)/);
    if (m) {
      current = Number(m[1]);
      if (seen.has(current)) {
        console.error(`dup      ${chapter.slug} block ${current}`);
        failed = true;
      }
      seen.set(current, line.slice(m[0].length).trim());
      continue;
    }
    if (current === null) {
      console.error(`orphan   ${chapter.slug}: ${line.slice(0, 30)}`);
      failed = true;
      continue;
    }
    seen.set(current, `${seen.get(current)}${line}`);
  }

  const missing = expected.filter((i) => !seen.has(i) || !seen.get(i));
  const extra = [...seen.keys()].filter((i) => !expected.includes(i));
  if (missing.length || extra.length) {
    console.error(`mismatch ${chapter.slug} missing=[${missing}] extra=[${extra}]`);
    failed = true;
  } else {
    const chars = [...seen.values()].join("").replace(/\s/g, "").length;
    console.log(`ok       ${chapter.slug}  ${expected.length} blocks  ${chars} chars`);
  }
}

if (failed) {
  console.error("\ncheck failed");
  process.exit(1);
}
console.log("\nall chapters aligned");
