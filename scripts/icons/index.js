const dir = 'C:\\Users\\Tom\\AppData\\Local\\Temp\\1.20.2';
const { loadModels, loadTextures } = require('./registry');
const { render } = require('./render');
const fs = require('node:fs');

(async () => {
    const models = await loadModels(dir);
    const textures = await loadTextures(dir);

    const item = await render('minecraft:item/cow_spawn_egg', models, textures);
    // const item = await render('minecraft:item/acacia_boat', models, textures);

    fs.writeFileSync('./output.png', item);
    // fs.writeFileSync('./output2.png', item2);
})()