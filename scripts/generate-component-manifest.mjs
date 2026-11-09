import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { generateManifest, loadConfig } from "./manifest/generate.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { values } = parseArgs({
  options: {
    index: { type: "string", default: "storybook-static/index.json" },
    output: { type: "string", default: "component-manifest.json" },
    publish: { type: "string" },
  },
});

try {
  const readJson = (file) =>
    JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8"));
  const config = loadConfig(root);
  const schema = readJson("component-manifest.schema.json");
  const index = readJson(values.index);
  const manifest = generateManifest({ root, config, index, schema });
  const output = `${JSON.stringify(manifest, null, 2)}\n`;
  const destination = path.resolve(root, values.output);
  fs.writeFileSync(destination, output);
  if (values.publish) {
    const directory = path.resolve(root, values.publish);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "component-manifest.json"), output);
    fs.copyFileSync(
      path.join(root, "component-manifest.schema.json"),
      path.join(directory, "component-manifest.schema.json"),
    );
  }
  console.log(
    `${Object.keys(manifest.components).length} components: ${values.output} (generated)`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
