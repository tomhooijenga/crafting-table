const {createCanvas, loadImage} = require("canvas");

async function renderItem(modelChain, textureMap){
    const canvas = createCanvas(16, 16);
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < 10; i++) {
        if (!textureMap.has(`layer${i}`)) {
            break;
        }

        const texture = textureMap.get(`layer${i}`);
        const img = await loadImage(texture);

        ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    return canvas.toBuffer(undefined, 'image/png');
}

module.exports = {
    renderItem,
}