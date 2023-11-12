const dir = 'C:\\Users\\Tom\\AppData\\Local\\Temp\\1.20.2';
const { loadModels, loadTextures } = require('./registry');
const { render } = require('./render');
const fs = require('node:fs');

(async () => {
    const models = await loadModels(dir);
    const textures = await loadTextures(dir);


    await Promise.all(
        [...data.itemsArray].map(async ({ name }) => {
            try {
                const buf = await render(`item/${name}`, models, textures);

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