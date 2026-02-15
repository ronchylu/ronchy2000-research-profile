import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const source = join(projectRoot, "edgeone.json");
const targetDir = join(projectRoot, ".next");
const target = join(targetDir, "edgeone.json");

// EdgeOne Pages "Clean URL" support is enabled by a top-level `clean-url.json`
// in the published directory. Copy it into common publish roots used by Pages.
const cleanUrlSource = join(projectRoot, "public", "clean-url.json");
const cleanUrlTargets = [
  join(projectRoot, ".next", "clean-url.json"),
  join(projectRoot, ".next", "server", "app", "clean-url.json")
];

if (!existsSync(source)) {
  process.exit(0);
}

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

cpSync(source, target);

if (existsSync(cleanUrlSource)) {
  for (const cleanUrlTarget of cleanUrlTargets) {
    const dir = dirname(cleanUrlTarget);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cpSync(cleanUrlSource, cleanUrlTarget);
  }
}
