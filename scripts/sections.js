const fs = require('fs');
const makeSprite = require('./sprite');

// Take sections from https://minecraft.gamepedia.com/Module:InvSprite
// Remove what is not in Java MC
let sections = fs.readFileSync('sections.txt', 'utf-8');

sections = sections
  .replace(/=/g, ':')
  .replace(/'/g, '"')
  .replace(/name/g, '"name"')
  .replace(/ id /g, ' "id" ');
sections = JSON.parse(`[${sections}]`);
sections = sections.reduce((obj, section) => {
  obj[section.id] = {
    ...section,
    items: [],
  };
  return obj;
}, {});

for (const [id, item] of Object.entries(makeSprite())) {
  if (sections[item.section]) {
    sections[item.section].items.push(+id);
  }
}

fs.writeFileSync('../src/assets/data/sections.json', JSON.stringify(sections, null, 2));
