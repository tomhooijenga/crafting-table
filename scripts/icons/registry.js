const fs = require('fs/promises');
const path = require('path');

async function loadModels(jarDir) {
    return new Map([
        ...await loadModelsDir(jarDir, 'assets/minecraft/models/block', 'block'),
        ...await loadModelsDir(jarDir, 'assets/minecraft/models/item', 'item')
    ]);
}

async function loadModelsDir(jarDir, dir, type) {
    const entries = new Map();
    const files = await fs.readdir(path.join(jarDir, dir));

    const promises = files.map(async (file) => {
        const content = await fs.readFile(path.join(jarDir, dir, file), 'utf-8');
        const json = JSON.parse(content);

        entries.set(`minecraft:${type}/${path.basename(file, '.json')}`, json);
    });

    await Promise.all(promises);

    return entries;
}

async function loadTextures(jarDir){
    return new Map([
        ...await loadTextureDir(jarDir, 'assets/minecraft/textures/block', 'block'),
        ...await loadTextureDir(jarDir, 'assets/minecraft/textures/item', 'item'),
        // todo: load sub dirs (trims, entity etc) without hard-coding
    ]);
}

async function loadTextureDir(jarDir, dir, type) {
    const entries = new Map();
    const files = await fs.readdir(path.join(jarDir, dir));

    const promises = files.map(async (file) => {
        const content = () => {
            return fs.readFile(path.join(jarDir, dir, file))
        }

        entries.set(`minecraft:${type}/${path.basename(file)}`, content);
    });

    await Promise.all(promises);

    return entries;
}

module.exports = {
    loadModels,
    loadTextures,
}