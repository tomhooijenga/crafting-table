const data = require('minecraft-data')('1.16.1');
const fs = require('fs');

// https://minecraft.gamepedia.com/Template:InvSprite#Example
// https://minecraft.gamepedia.com/Module:InvSprite

// https://minecraft.gamepedia.com/Category:Animated_inventory_icons


let sprite = fs.readFileSync('./items.txt', 'utf-8');

const itemsByDisplayName = data.itemsArray.reduce((obj, item) => {
  obj[item.displayName] = item;
  return obj;
}, {})

const itemsByName = data.itemsByName;
let notFound = 0;

function makeSprite(sprite) {
  return sprite
    .trim()
    .split('\n')
    .map((line) => {
      const [, displayName, pos, section] = line.match(/(?:\[['"])?(.+?)(?:["']\])? = { pos = (\d+), section = (\d+)/);
      const name = displayName
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^a-z\d_]/g, '')
        .replace(/_?revision_1/, '');

      const x = (pos - 1) * 32 % 1024;
      const y = Math.floor((pos - 1) / 32) * 32;
      return {
        displayName,
        name,
        pos: +pos,
        section,
        x,
        y
      };
    })
    .reduce((obj, item) => {
      let id;

      if (!itemsByDisplayName[item.displayName] && !itemsByName[item.name]) {
        return obj;
      } else {
        id = (itemsByDisplayName[item.displayName] || itemsByName[item.name]).id
      }

      obj[id] = {
        id,
        ...item
      };
      return obj;
    }, {})
}

const x = [
  'prismarine',
  'prismarine_stairs',
  'prismarine_slab',
  'command_block',
  'chain_command_block',
  'repeating_command_block',
  'sea_lantern',
];

const spriteData = Object.fromEntries(
  Object
    .values(makeSprite(sprite))
    .map(({x, y, id}) => [id, {x, y, id}])
)
fs.writeFileSync('../src/assets/data/sprite.json', JSON.stringify(spriteData, null, 2));

module.exports = makeSprite.bind(null, sprite);
