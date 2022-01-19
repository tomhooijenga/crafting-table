const { data } = require("./");
const util = require("util");
const fs = require("fs");
const request = util.promisify(require("request"));

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
  "prismarine",
  "prismarine_stairs",
  "prismarine_slab",
  "magma_block",
  "command_block",
  "chain_command_block",
  "repeating_command_block",
  "sea_lantern",
  "compass",
  "experience_bottle", // Bottle o' enchanting
  "enchanted_book",
  "end_crystal",
  "enchanted_golden_apple",
  "debug_stick",
  "lodestone",
  "nether_star",
  "stonecutter",
  "warped_hyphae",
  "warped_stem",
]);

function parseSprite(spriteText) {
  return spriteText
    .trim()
    .split("\n")
    .map((line) => {
      const [, displayName, position] = line.match(
        /(?:\[['"])?(.+?)(?:["']\])? = { pos = (\d+)/
      );

      return {
        displayName,
        position: parseInt(position),
        animated: false,
      };
    })
    .map((icon) => {
      // Try to construct an item name from the display name. Does not always work, for example
      // bottle o' enchanting => experience_bottle.
      const name = icon.displayName
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^a-z\d_]/g, "")
        .replace(/_?revision_1/, "");

      return {
        name,
        ...icon,
      };
    })
    .map((icon) => {
      const position = icon.position;

      // Sprite data is 1-indexed. Sprite is 1024 wide.
      const x = ((position - 1) * 32) % 1024;
      const y = Math.floor((position - 1) / 32) * 32;

      return {
        x,
        y,
        ...icon,
      };
    });
}

const sprite = parseSprite(fs.readFileSync("./sprite.txt", "utf-8"));
const icons = Object.entries(data.itemsByName)
  // Air was removed from items but we still need it.
  .concat([
    [
      "air",
      {
        id: -1,
        name: "air",
        displayName: "Air",
      },
    ],
  ])
  .map(([name, item]) => {
    if (animated.has(name)) {
      return {
        id: item.id,
        name,
        animated: true,
      };
    }

    const { x, y } = sprite.find((icon) => {
      return (
        icon.name === name ||
        icon.displayName === item.displayName ||
        icon.name === aliases[name]
      );
    });

    return {
      id: item.id,
      name,
      animated: false,
      x,
      y,
    };
  })
  .reduce((obj, icon) => {
    obj[icon.id] = icon;
    return obj;
  }, {});

request
  .get(
    "https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/44/InvSprite.png/revision/latest"
  )
  .pipe(fs.createWriteStream("../src/assets/sprite.png"));

fs.writeFileSync(
  "../src/assets/data/sprite.json",
  JSON.stringify(icons, null, 2)
);
