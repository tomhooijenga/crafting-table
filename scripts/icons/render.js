const {ensureNamespace} = require("./util");
const { default: png } = require('@pdf-lib/upng');
const { compose } = require('./png');
const {TextureMap} = require("./texture-map");
const Jimp = require('jimp');

function getModelChain(model, models) {
    const chain = [];

    let m = model;

    while (m) {
        chain.push(m);

        m = models.get(ensureNamespace(m.parent ?? ''));
    }

    return chain;
}

function renderItem(modelChain, textureMap){
    const baseBuffer = new ArrayBuffer(1024);

    for (let i = 0; i < 10; i++) {
        if (!textureMap.has(`layer${i}`)) {
            break;
        }

        const texture = textureMap.get(`layer${i}`);
        const layer = png.decode(texture);
        /** @type ArrayBuffer */
        const layerBuffer = png.toRGBA8(layer)[0];
        compose(baseBuffer, layerBuffer);
    }

    return Buffer.from(
        png.encode([baseBuffer], 16, 16, 0)
    );
}

async function renderEntity(id, modelChain, textureMap) {
    // todo: load entity textures
    // todo: render entity
    // entities render custom

    // conduit: small block

    throw new Error(`No renderer for entity [${id}]`)
}

async function renderBlock(modelChain, textureMap) {
    const elements = modelChain.findLast(({ elements }) => elements).elements;

    return await renderBlockElement(elements[0], textureMap);
}

async function renderBlockElement(element, textureMap) {
    if (element.faces.up) {
        return renderBlockElementFace(element, 'up', textureMap);
    }
}

async function renderBlockElementFace(element, face, textureMap) {
    const faceTexture = element.faces[face].texture;
    const texture = textureMap.get(faceTexture);



    return texture;
}

function overrides(model, itemData, models, textures) {
    for (let i = model.overrides.length - 1; i >= 0; i--) {
        const override = model.overrides[i];

        const match = Object
            .entries(override.predicate)
            .every(([key, value]) => {
                return key in itemData && itemData[key] >= value;
            });

        if (match) {
            return render(override.model, null, models, textures);
        }
    }

    return render(model.id, null, models, textures);
}

function render(id, itemData, models, textures) {
    const nsId = ensureNamespace(id);
    const model = models.get(nsId)

    if (!model) {
        throw new Error(`No model found for [${nsId}]`);
    }

    if (model.overrides && itemData !== null) {
        return overrides(model, itemData, models, textures);
    }

    const modelChain = getModelChain(model, models);
    const renderType = modelChain.findLast(({ parent }) => parent)?.parent;
    const textureMap = new TextureMap(modelChain, textures);

    if (renderType === undefined) {
        return renderItem([], textureMap);
    }
    if (renderType === 'builtin/generated') {
        return renderItem(modelChain, textureMap);
    }
    if (renderType === 'builtin/entity') {
        return renderEntity(nsId, modelChain, textureMap);
    }
    if (renderType === 'block/block') {
        return renderBlock(modelChain, textureMap);
    }

    throw new Error(`Unsupported item type [${renderType}]`);
}

module.exports = {
    render,
}