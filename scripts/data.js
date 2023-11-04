const fs = require("fs/promises");
const { createWriteStream } = require("fs");
const os = require("os");
const path = require("path");
const { data, VERSION } = require("./");
const { pipeline } = require("stream/promises");
const Zip = require("adm-zip");

async function getReleaseUrl(version) {
  const launcherRequest = await fetch(
      "https://launchermeta.mojang.com/mc/game/version_manifest.json"
  );
  const launcherJson = await launcherRequest.json();
  const { url } = launcherJson.versions.find(({ id }) => id === version);

  return url;
}

async function getJarUrl(releaseUrl) {
  const releaseRequest = await fetch(releaseUrl);
  const releaseJson = await releaseRequest.json();

  return releaseJson.downloads.client.url
}

async function downloadJar(jarUrl, jarPath) {
  const jarRequest = await fetch(jarUrl);
  const target = createWriteStream(jarPath);
  await pipeline(jarRequest.body, target);
}

async function extractJarToDir(jarPath, dir) {
  const jar = new Zip(jarPath, {});

  jar.extractAllTo(dir, true);
}

async function writeItems() {
  await fs.writeFile(
      "../src/assets/data/items.json",
      JSON.stringify(data.itemsByName, null, 2)
  );
}

function removeMinecraftNamespace(key, value) {
  if (typeof value === 'string') {
    return value.replace(/minecraft:/, '');
  }
  return value;
}

async function writeRecipes(extractedJarPath) {
  const entries = await fs.readdir(path.join(extractedJarPath, "data/minecraft/recipes"));

  const recipes = entries.map((name) => {
    const content = require(path.join(extractedJarPath, "data/minecraft/recipes", name));

    if (content.type === "minecraft:crafting_shaped") {
      // Convert shaped recipe to flat array of 9 slots
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

    return content;
  });

  const recipeJson = JSON.stringify(recipes, removeMinecraftNamespace, 2);

  await fs.writeFile("../src/assets/data/recipes.json", recipeJson);
}

async function writeTags(extractedJarPath) {
  const tags = {};
  const tagEntries = await fs.readdir(
      path.join(extractedJarPath, "data/minecraft/tags/items")
  );

  for (const tag of tagEntries) {
    const content = require(path.join(extractedJarPath, "data/minecraft/tags/items", tag));

    tags[path.basename(tag, '.json')] = content.values;
  }

  const tagJson = JSON.stringify(tags, removeMinecraftNamespace, 2);
  await fs.writeFile("../src/assets/data/tags.json", tagJson);
}

(async () => {
  const jarPath = path.join(os.tmpdir(), `${VERSION}.jar`);
  const extractedJarPath = path.join(os.tmpdir(), VERSION);

  const releaseUrl = await getReleaseUrl(VERSION);
  const jarUrl = await getJarUrl(releaseUrl);
  await downloadJar(jarUrl, jarPath);
  await extractJarToDir(jarPath, extractedJarPath);

  await writeItems();
  await writeRecipes(extractedJarPath);
  await writeTags(extractedJarPath);
})()