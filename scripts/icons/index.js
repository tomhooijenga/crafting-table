const dir = 'C:\\Users\\Tom\\AppData\\Local\\Temp\\1.20.2';
const { Registry } = require('./registry');
const { render } = require('./render');
const fs = require('node:fs/promises');
const { data } = require('../');


(async () => {
    const registry = new Registry();

    await registry.load(dir);

    // const items = [
    //     // { name: 'oak_button' },
    //     { name: 'oak_stairs' },
    //     // { name: 'blue_ice' },
    // ];
    const items = data.itemsArray;

    const blockState = {
        facing: 'north',
        half: 'top',
        shape: 'straight',
    }

    await Promise.all(
        items.map(async ({ name }) => {
            try {
                const buf = await render(`item/${name}`, registry, blockState);

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