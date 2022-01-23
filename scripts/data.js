const fs2 = require("fs/promises");
const { createWriteStream } = require("fs");
const os = require("os");
const path = require("path");
const fetch = require("node-fetch");
const { data, VERSION } = require("./");
const { pipeline } = require("stream/promises");
const Zip = require("adm-zip");

async function processJar() {
  const dir = path.join(os.tmpdir(), VERSION);

  try {
    await fs2.mkdir(dir);
    const launcherRequest = await fetch(
        "https://launchermeta.mojang.com/mc/game/version_manifest.json"
    );
    const launcherJson = await launcherRequest.json();
    const releaseUrl = launcherJson.versions.find(({ id }) => id === VERSION).url;

    const releaseRequest = await fetch(releaseUrl);
    const releaseJson = await releaseRequest.json();

    const jarRequest = await fetch(releaseJson.downloads.client.url);
    const jarPath = path.join(os.tmpdir(), `${VERSION}.jar`);
    const jar = new Zip(jarPath, {});
    const target = createWriteStream(jarPath);
    await pipeline(jarRequest.body, target);
    jar.extractAllTo(dir, true);
  } catch (e) {
    if (e.code !== "EEXIST") {
      throw e;
    }
  }

  return dir;
}

(async () => {
  const dir = await processJar();

  await fs2.writeFile(
    "../src/assets/data/items.json",
    JSON.stringify(data.itemsByName, null, 2)
  );

  const entries = await fs2.readdir(path.join(dir, "data/minecraft/recipes"));
  const recipes = [];
  for (const entry of entries) {
    const content = require(path.join(dir, "data/minecraft/recipes", entry));

    if (content.type === "minecraft:crafting_shaped") {
      content.pattern = content.pattern
        .map((row) => {
          return row
            .split("")
            .map((char) => (char === null ? null : content.key[char]))
            .concat(null, null, null)
            .slice(0, 3);
        })
        .flat()
        .concat(null, null, null, null, null, null, null)
        .slice(0, 9);
      delete content.key;
    }

    if (content.result) {
      content.result.count ??= 1;
    }
    recipes.push(content);
  }

  const recipeJson = JSON.stringify(recipes, null, 2);
  await fs2.writeFile("../src/assets/data/recipes.json", cleanup(recipeJson));

  const tags = {};
  const tagEntries = await fs2.readdir(
    path.join(dir, "data/minecraft/tags/items")
  );

  for (const tag of tagEntries) {
    const content = require(path.join(dir, "data/minecraft/tags/items", tag));

    tags[tag.split(".")[0]] = content.values;
  }

  const tagJson = JSON.stringify(tags, null, 2);
  await fs2.writeFile("../src/assets/data/tags.json", cleanup(tagJson));
})();

function cleanup(str) {
  return str.replace(/minecraft:/g, "");
}
