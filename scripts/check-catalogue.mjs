import { readFile, stat } from "node:fs/promises";
import { parseCatalogue } from "../src/catalogue.ts";

const publicRoot = new URL("../public/", import.meta.url);
try {
  const projects = parseCatalogue(JSON.parse(await readFile(new URL("projects.json", publicRoot), "utf8")));
  for (const project of projects) {
    const image = await stat(new URL(project.thumbnail, publicRoot));
    if (!image.isFile()) throw new Error(`${project.name}: thumbnail is not a file`);
  }
  console.log(`Catalogue checked: ${projects.length} entries and thumbnails.`);
} catch (error) {
  console.error(`Invalid public/projects.json: ${error.message}`);
  process.exitCode = 1;
}
