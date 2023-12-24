function ensureNamespace(id) {
    return id.startsWith('minecraft:') ? id : `minecraft:${id}`;
}

function getName(id) {
    return id.split('/')[1];
}

module.exports = {
    ensureNamespace,
    getName,
}