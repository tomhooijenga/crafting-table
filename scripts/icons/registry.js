const fs = require('fs/promises');
const path = require('path');

class Registry {

    models = new Map();
    textures = new Map();
    blockStates = new Map();

    async load(jarDir) {
        this.models = await this.loadModels(jarDir);
        this.textures = await this.loadTextures(jarDir);
        this.blockStates = await this.loadBlockStates(jarDir);
    }

    async loadModels(jarDir) {
        return new Map([
            ...await this.loadDirOfJson(jarDir, 'assets/minecraft/models/block', 'block'),
            ...await this.loadDirOfJson(jarDir, 'assets/minecraft/models/item', 'item')
        ]);
    }

    async loadTextures(jarDir){
        return new Map([
            ...await this.loadTextureDir(jarDir, 'assets/minecraft/textures/block', 'block'),
            ...await this.loadTextureDir(jarDir, 'assets/minecraft/textures/item', 'item'),
            ...await this.loadTextureDir(jarDir, 'assets/minecraft/textures/entity/chest', 'item/chest'),
            // todo: load sub dirs (trims, entity etc) without hard-coding
        ]);
    }

    async loadBlockStates(jarDir) {
        return await this.loadDirOfJson(jarDir, 'assets/minecraft/blockstates', 'block');
    }

    async loadTextureDir(jarDir, dir, type) {
        const entries = new Map();
        const files = await fs.readdir(path.join(jarDir, dir));

        const promises = files.map(async (file) => {
            const content = await fs.readFile(path.join(jarDir, dir, file));
            entries.set(`minecraft:${type}/${path.basename(file)}`, content);
        });

        await Promise.all(promises);

        return entries;
    }

    async loadDirOfJson(jarDir, dir, type) {
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
}

module.exports = {
    Registry,
}