const dir = 'C:\\Users\\Tom\\AppData\\Local\\Temp\\1.20.2';
const { loadModels, loadTextures, loadBlockStates} = require('./registry');
const { render } = require('./render');
const fs = require('node:fs/promises');
const { data } = require('../');


(async () => {
    const models = await loadModels(dir);
    const textures = await loadTextures(dir);
    const blockstates = await loadBlockStates(dir);

    const items = [
        // { name: 'oak_button' },
        { name: 'oak_stairs' },
    ];
    // const items = data.itemsArray;

    const blockState = {
        facing: 'north',
        half: 'top',
        shape: 'straight',
    }

    await Promise.all(
        items.map(async ({ name }) => {
            try {
                const buf = await render(`item/${name}`, blockState, models, textures, blockstates);

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