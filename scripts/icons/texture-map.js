const {ensureNamespace} = require("./util");

class TextureMap {
    constructor(modelChain, registry) {
        this.map = Object.assign({}, ...modelChain.map(({ textures }) => textures).reverse());
        this.registry = registry;
    }

    get(name) {
        if (name.startsWith('#')) {
            return this.get(name.slice(1));
        }

        const textureId = this.map[name];
        if (textureId.startsWith('#')) {
            return this.get(textureId.slice(1));
        }

        const nsTextureId = ensureNamespace(textureId + '.png');

        if (!this.registry.has(nsTextureId)) {
            throw new Error(`Unknown texture [${nsTextureId}]`);
        }

        return this.registry.get(nsTextureId);
    }

    has(name) {
        if (name.startsWith('#')) {
            return this.has(name.slice(1));
        }

        return name in this.map;
    }
}

module.exports = {
    TextureMap,
}