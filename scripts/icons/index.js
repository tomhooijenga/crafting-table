const dir = 'C:\\Users\\Tom\\AppData\\Local\\Temp\\1.20.2';
const { loadModels, loadTextures } = require('./registry');
const { render } = require('./render');
const fs = require('node:fs/promises');
const { data } = require('../');


(async () => {
    const models = await loadModels(dir);
    const textures = await loadTextures(dir);


    const items = [
        { name: 'item/crossbow' },
        { name: 'item/crafting_table' },
        { name: 'block/dirt' },
        { name: 'block/acacia_log' },
        { name: 'block/acacia_log_horizontal' }
    ];
    // const items = data.itemsArray;

    await Promise.all(
        items.map(async ({ name }) => {
            try {
                const buf = await render(name, null, models, textures);

                if (buf === undefined) {
                    console.log('skipping', name);
                    return;
                }

                await fs.writeFile(`./output/${name}.png`, buf);
            } catch (e) {
                console.log(name, e);
            }
        })
    );
})()