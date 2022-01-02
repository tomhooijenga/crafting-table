const fs = require("fs");
const data = require("minecraft-data")("1.16.1");

fs.writeFileSync("../src/assets/data/items.json", JSON.stringify(data.items));
fs.writeFileSync(
  "../src/assets/data/recipes.json",
  JSON.stringify(data.recipes)
);
