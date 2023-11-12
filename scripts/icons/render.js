const {ensureNamespace} = require("./util");
const { default: png } = require('@pdf-lib/upng');
const { compose } = require('./png');

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

async function renderItem(modelChain, textures){
    const textureMap = getTextureMap(modelChain);

    if (textureMap.layer0) {
        return renderItemLayers(textureMap, textures)
    }

    // todo: support overrides
}

async function renderItemLayers(textureMap, textures) {
    const baseBuffer = new ArrayBuffer(1024);

    for (let i = 0; i < 10; i++) {
        if (!textureMap[`layer${i}`]) {
            break;
        }

        const textureId = ensureNamespace(`${textureMap[`layer${i}`]}.png`);

        if (!textures.has(textureId)) {
            throw new Error(`Unknown texture [${textureId}]`)
        }

        const texture = await textures.get(textureId)();
        const layer = png.decode(texture);
        /** @type ArrayBuffer */
        const layerBuffer = png.toRGBA8(layer)[0];
        compose(baseBuffer, layerBuffer);
    }

    return Buffer.from(
        png.encode([baseBuffer], 16, 16, 0)
    );
}

async function renderEntity(modelChain, textures) {
    // todo: load entity textures
    // todo: render entity
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
    const renderType = modelChain.findLast(({ parent }) => parent)?.parent;

    if (renderType === undefined) {
        return renderItemLayers({}, textures);
    }
    if (renderType === 'builtin/generated') {
        return renderItem(modelChain, textures);
    }
    if (renderType === 'builtin/entity') {
        return renderEntity(modelChain, textures);
    }
    if (renderType === 'block/block') {
        return renderBlock(modelChain, textures);
    }

    throw new Error(`Unsupported item type [${renderType}]`);
}

module.exports = {
    render,
}