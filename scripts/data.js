const fs = require("fs");
const { data } = require("./");

fs.writeFileSync(
  "../src/assets/data/items.json",
  JSON.stringify(data.items, null, 2)
);
fs.writeFileSync(
  "../src/assets/data/recipes.json",
  JSON.stringify(data.recipes, null, 2)
);
