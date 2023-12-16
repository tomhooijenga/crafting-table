const {ensureNamespace} = require("./util");
const {TextureMap} = require("./texture-map");
const {renderBlock} = require("./render-block");
const {renderItem} = require("./render-item");

function getModelChain(model, models) {
    const chain = [];

    let m = model;

    while (m) {
        chain.push(m);

        m = models.get(ensureNamespace(m.parent ?? ''));
    }

    return chain;
}

async function renderEntity(id, modelChain, textureMap) {
    // todo: load entity textures
    // todo: render entity
    // entities render custom

    // conduit: small block

    throw new Error(`No renderer for entity [${id}]`)
}

function findOverride(model, itemData, models, textures) {
    for (let i = model.overrides.length - 1; i >= 0; i--) {
        const override = model.overrides[i];

        const match = Object
            .entries(override.predicate)
            .every(([key, value]) => {
                return key in itemData && itemData[key] >= value;
            });

        if (match) {
            return override;
        }
    }

    return null;
}

function render(id, itemData, models, textures) {
    const nsId = ensureNamespace(id);
    const model = models.get(nsId)

    if (!model) {
        throw new Error(`No model found for [${nsId}]`);
    }

    if (model.overrides && itemData !== null) {
        const override = findOverride(model, itemData, models, textures);

        if (override) {
            return render(override.model, null, models, textures);
        }
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