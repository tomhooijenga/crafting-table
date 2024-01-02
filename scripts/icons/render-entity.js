const {TextureMap} = require("./texture-map");
const {renderBlock} = require("./render-block");

function renderChest(chestTexture, textures) {
    const modelChain = [
        {
            textures: {
                chest: chestTexture,
            },
            elements: [
                // lid top
                {
                    from: [0, 0, 0],
                    to: [16, 16, 16],
                    faces: {
                        up: {
                            texture: 'chest',
                            uv: [28, 0, 42, 14]
                        }
                    }
                },
                // lower sides
                {
                    from: [0, 0, 0],
                    to: [16, 11, 16],
                    faces: {
                        south: {
                            texture: 'chest',
                            uv: [0, 33, 14, 43],
                            rotation: 180
                        },
                        east: {
                            texture: 'chest',
                            uv: [42, 33, 56, 43],
                            rotation: 180
                        },
                    }
                },
                // upper sides
                {
                    from: [0, 10, 0],
                    to: [16, 16, 16],
                    faces: {
                        // top
                        south: {
                            texture: 'chest',
                            uv: [0, 14, 14, 19],
                            rotation: 180
                        },
                        // top with lock
                        east: {
                            texture: 'chest',
                            uv: [42, 14, 56, 19],
                            rotation: 180
                        },
                    }
                },
                // lock
                {
                    from: [14, 6, 5],
                    to: [15, 11, 7],
                    faces: {
                        up: {
                            texture: 'chest',
                            uv: [2, 0, 4, 1],
                            rotation: 180,
                        },
                        south: {
                            texture: 'chest',
                            uv: [1, 0, 2, 5],
                            // rotation: 180
                        },
                        east: {
                            texture: 'chest',
                            uv: [2, 0, 4, 5],
                            // rotation: 180
                        },
                    }
                },
            ]
        },
    ];

    const textureMap = new TextureMap(modelChain, textures);

    return renderBlock(modelChain, textureMap);
}

const entities = {
    'minecraft:item/chest': (textures) => renderChest('minecraft:item/chest/normal', textures),
    'minecraft:item/ender_chest': (textures) => renderChest('minecraft:item/chest/ender', textures),
    'minecraft:item/trapped_chest': (textures) => renderChest('minecraft:item/chest/trapped', textures),
}

function renderEntity(nsId, textures) {
    if (nsId in entities) {
        return entities[nsId](textures);
    }

    throw new Error(`No renderer for entity [${nsId}]`)
}

module.exports = {
    renderEntity,
}