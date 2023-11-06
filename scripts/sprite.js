const { data } = require("./");
const fs = require("fs");
const { pipeline } = require("stream/promises");
const crypto = require("crypto");
const path = require("path");

function parseLuaSprite(spriteText) {
  // https://minecraft.fandom.com/wiki/Module:InvSprite
  // update sprite.txt

  return spriteText
    .trim()
    .split("\n")
    .map((line) => {
      // ['Acacia Planks'] = { pos = 854, section = 12 },
      const [, displayName, position] = line.match(
        /(?:\[['"])?(.+?)(?:["']])? = { pos = (\d+)/
      );

      // Try to construct an item name from the display name. Does not always work, for example
      // bottle o' enchanting => experience_bottle.
      const name = displayName
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^a-z\d_]/g, "")
        .replace(/_?revision_1/, "");

      // Sprite data is 1-indexed. Sprite is 1024 wide.
      const x = ((position - 1) * 32) % 1024;
      const y = Math.floor((position - 1) / 32) * 32;

      return {
        name,
        displayName,
        position: parseInt(position),
        animated: false,
        x,
        y,
      };
    });
}

function writeSpriteJson(spriteItems, aliases, animated) {
  const jsonEntries = data.itemsArray.map((item) => {
    if (animated.has(item.name)) {
      return [
        item.id,
        {
          id: item.id,
          name: item.name,
          animated: true,
        },
      ];
    }

    const spriteEntry = spriteItems.find((icon) => {
      return (
        icon.name === item.name ||
        icon.displayName === item.displayName ||
        icon.name === aliases[item.name]
      );
    });

    return [
      item.id,
      {
        id: item.id,
        name: item.name,
        animated: false,
        x: spriteEntry.x,
        y: spriteEntry.y,
      },
    ];
  });

  const spriteJson = JSON.stringify(Object.fromEntries(jsonEntries), null, 2);

  fs.writeFileSync("../src/assets/data/sprite.json", spriteJson);
}

async function writeSpritePng() {
  const request = await fetch(
    "https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/44/InvSprite.png/revision/latest"
  );
  const target = fs.createWriteStream("../src/assets/sprite.png");
  await pipeline(request.body, target);
}

async function writeAnimated(animated) {
  const requests = [...animated].map((icon) => {
    const { displayName } = data.itemsByName[icon];
    const slug = "Invicon_" + displayName.replaceAll(" ", "_") + ".gif";
    const hash = crypto.createHash("md5").update(slug).digest("hex");
    const url = `https://static.wikia.nocookie.net/minecraft_gamepedia/images/${hash.slice(
      0,
      1
    )}/${hash.slice(0, 2)}/${slug}`;

    return fetch(url).then((response) => {
      if (!response.ok) {
        return Promise.resolve();
      }

      const target = fs.createWriteStream(
        path.join("../src/assets/icons", icon + ".gif")
      );

      return pipeline(response.body, target);
    });
  });

  return await Promise.all(requests);
}

(async () => {
  const luaSprite = fs.readFileSync("./sprite.txt", "utf8");
  const luaSpriteItems = parseLuaSprite(luaSprite);

  const aliases = {
    flower_banner_pattern: "banner_pattern",
    creeper_banner_pattern: "banner_pattern",
    skull_banner_pattern: "banner_pattern",
    mojang_banner_pattern: "banner_pattern",
    globe_banner_pattern: "banner_pattern",
    piglin_banner_pattern: "banner_pattern",
    potion: "water_bottle",
    lingering_potion: "lingering_water_bottle",
    splash_potion: "splash_water_bottle",
    light: "light_0",
  };

  const animated = new Set([
    "calibrated_sculk_sensor",
    "chain_command_block",
    "clock",
    "command_block",
    "compass",
    "crimson_hyphae",
    "crimson_stem",
    "debug_stick",
    "enchanted_book",
    "enchanted_golden_apple",
    "end_crystal",
    "experience_bottle", // Bottle o' enchanting
    "magma_block",
    "nether_star",
    "prismarine",
    "prismarine_slab",
    "prismarine_stairs",
    "prismarine_wall",
    "recovery_compass",
    "repeating_command_block",
    "sculk",
    "sculk_sensor",
    "sculk_shrieker",
    "sculk_vein",
    "sea_lantern",
    "stonecutter",
    "warped_hyphae",
    "warped_stem",
    "written_book",
  ]);

  writeSpriteJson(luaSpriteItems, aliases, animated);

  await writeSpritePng(aliases, animated);
  await writeAnimated(animated);
})();
