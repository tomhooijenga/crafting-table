const {ensureNamespace} = require("./util");

function getModelChain(model, models) {
    const chain = [];

    let m = model;

    while (m) {
        chain.push(m);

        m = models.get(ensureNamespace(m.parent ?? ''));
    }

    return chain;
}

function getTextureMap(modelChain) {
    const map = Object.assign({}, ...modelChain.map(({ textures }) => textures));

    // Resolve texture refs
    // assuming there are no nested refs
    Object.entries(map).forEach(([name, texture]) => {
        if (!texture.startsWith('#')) {
            return;
        }

        map[name] = map[texture.slice(1)];
    });

    return map;
}

async function renderGenerated(modelChain, textures){
    const textureMap = getTextureMap(modelChain);
    const content = textures.get(ensureNamespace(textureMap.layer0) + '.png');

    return await content();
}

async function renderBlock(modelChain, textures) {
    const textureMap = getTextureMap(modelChain);

    const x = 1;
}

function render(id, models, textures) {
    const model = models.get(ensureNamespace(id))

    if (!model) {
        throw new Error(`No model found for [${id}]`);
    }

    const modelChain = getModelChain(model, models);
    const renderType = modelChain.findLast(({ parent }) => parent).parent;

    if (renderType === 'builtin/generated') {
        return renderGenerated(modelChain, textures);
    }
    if (renderType === 'block/block') {
        return renderBlock(modelChain, textures);
    }

    throw new Error(`Unsupported block type [${renderType}]`);
}

module.exports = {
    render,
}