function ensureNamespace(id) {
    return id.startsWith('minecraft:') ? id : `minecraft:${id}`;
}

module.exports = {
    ensureNamespace
}