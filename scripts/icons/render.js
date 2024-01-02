const {ensureNamespace, getName} = require("./util");
const {TextureMap} = require("./texture-map");
const {renderBlock} = require("./render-block");
const {renderItem} = require("./render-item");
const {renderEntity} = require("./render-entity");

function getModelChain(model, models) {
    const chain = [];

    let m = model;

    while (m) {
        chain.push(m);

        m = models.get(ensureNamespace(m.parent ?? ''));
    }

    return chain;
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

function findBlockState(nsId, conditions, blockStatesRegistry) {
    const modelName = getName(nsId);
    const blockStates = blockStatesRegistry.get(`minecraft:block/${modelName}`);

    if (!blockStates) {
        return null;
    }

    if (blockStates.variants) {
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

        const blockState = blockStates.variants[blockStateName];

        if (!blockState) {
            return null;
        }

        return Array.isArray(blockState) ? blockState[0] : blockState;
    }

    // todo: multipart?
}

function render(id, registry, conditions) {
    const nsId = ensureNamespace(id);
    const model = registry.models.get(nsId)

    if (!model) {
        throw new Error(`No model found for [${nsId}]`);
    }

    const modelChain = getModelChain(model, registry.models);
    const renderType = modelChain.findLast(({parent}) => parent)?.parent;
    const textureMap = new TextureMap(modelChain, registry.textures);

    if (renderType === undefined) {
        return renderItem([], textureMap);
    }

    if (renderType === 'builtin/generated') {
        const override = findOverride(model, conditions);

        if (override) {
            return render(override.model, registry);
        }

        return renderItem(modelChain, textureMap);
    }

    if (renderType === 'builtin/entity') {
        return renderEntity(nsId, registry.textures);
    }

    if (renderType === 'block/block') {
        const blockState = findBlockState(nsId, conditions, registry.blockStates);

        if (blockState) {
            const blockStateModelChain = [
                ...getModelChain(registry.models.get(blockState.model), registry.models),
                ...modelChain
            ]

            return renderBlock(blockStateModelChain, textureMap, blockState);
        }

        return renderBlock(modelChain, textureMap, blockState);
    }

    throw new Error(`Unsupported item type [${renderType}]`);
}

module.exports = {
    render,
}