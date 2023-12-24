const {ensureNamespace, getName} = require("./util");
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

function findOverride(model, conditions) {
    if (!model.overrides || conditions === null) {
        return null;
    }

    for (let i = model.overrides.length - 1; i >= 0; i--) {
        const override = model.overrides[i];

        const match = Object
            .entries(override.predicate)
            .every(([key, value]) => {
                return key in conditions && conditions[key] >= value;
            });

        if (match) {
            return override;
        }
    }

    return null;
}

function findBlockState(nsId, conditions, blockStates) {
    const modelName = getName(nsId);
    const blockState = blockStates.get(`minecraft:block/${modelName}`);

    if (!blockState) {
        return null;
    }

    if (blockState.variants) {
        const blockStateName =
            conditions === null
                ? ''
                : Object
                    .keys(conditions)
                    .sort((a, b) => a.localeCompare(b))
                    .map((key) => {
                        const value = conditions[key].toString()

                        return `${key}=${value}`;
                    })
                    .join(',');

        return blockState.variants[blockStateName] ?? null;
    }

    // todo: multipart?
}

function render(id, conditions, models, textures, blockStates) {
    const nsId = ensureNamespace(id);
    const model = models.get(nsId)

    if (!model) {
        throw new Error(`No model found for [${nsId}]`);
    }

    const modelChain = getModelChain(model, models);
    const renderType = modelChain.findLast(({parent}) => parent)?.parent;
    const textureMap = new TextureMap(modelChain, textures);

    if (renderType === undefined) {
        return renderItem([], textureMap);
    }

    if (renderType === 'builtin/generated') {
        const override = findOverride(model, conditions, models, textures);

        if (override) {
            return render(override.model, null, models, textures);
        }

        return renderItem(modelChain, textureMap);
    }

    if (renderType === 'builtin/entity') {
        return renderEntity(nsId, modelChain, textureMap);
    }

    if (renderType === 'block/block') {
        const override = findBlockState(nsId, conditions, blockStates);

        if (override) {
            return render(override.model, null, models, textures);
        }

        return renderBlock(modelChain, textureMap);
    }

    throw new Error(`Unsupported item type [${renderType}]`);
}

module.exports = {
    render,
}