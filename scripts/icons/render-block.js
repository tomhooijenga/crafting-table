const {createCanvas, loadImage} = require("canvas");

const SCALE = 10;
const SIZE = 16;

async function renderBlock(modelChain, textureMap) {
    const elements = modelChain.findLast(({elements}) => elements).elements;

    return await renderBlockElement(elements[0], textureMap);
}

async function renderBlockElement(element, textureMap) {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    const [top, left, right] = await Promise.all([
        await getElementFaceTexture(element, 'up', textureMap),
        await getElementFaceTexture(element, 'south', textureMap),
        await getElementFaceTexture(element, 'east', textureMap)
    ]);

    const isoWidth = 0.5;
    const skew = isoWidth * 2;
    const z = SCALE * SIZE / 2;
    const sideHeight = top.height * 1.2;

    canvas.width = top.width * 2;
    canvas.height = top.height + left.height * 1.2;

    ctx.imageSmoothingEnabled = false;

    ctx.setTransform(1, -isoWidth, 1, isoWidth, 0, 0);
    ctx.drawImage(top, -z - 1, z, top.width, top.height + 1.5);

    // draw RIGHT
    const x = SIZE * SCALE;
    ctx.setTransform(1, -isoWidth, 0, skew, 0, isoWidth);
    ctx.drawImage(right, x, x + z, right.width, sideHeight);

    // draw LEFT
    ctx.setTransform(1, isoWidth, 0, skew, 0, 0);
    ctx.drawImage(left, 0, z, left.width, sideHeight);

    return await canvas.toBuffer(undefined, 'image/png');
}

async function getElementFaceTexture(element, faceName, textureMap) {
    const face = element.faces[faceName];
    let texture = await loadImage(textureMap.get(face.texture));

    texture = scaleCanvas(texture, SCALE);

    if (face.rotation) {
        texture = rotateCanvas(texture, face.rotation);
    }

    const shades = {
        south: 1.5, // left
        east: 2, // right
    }

    if (faceName in shades) {
        texture = darkenCanvas(texture, shades[faceName]);
    }

    return texture;
}

function scaleCanvas(canvas, scale) {
    const w = canvas.width * scale;
    const h = canvas.height * scale;

    const scaledCanvas = createCanvas(w, h);
    const ctx = scaledCanvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, w, h);

    return scaledCanvas;
}

function darkenCanvas(canvas, multiplier) {
    const ctx = canvas.getContext('2d');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const numPixels = pixels.length;

    for (let i = 0; i < numPixels; i += 4) {
        const val = 1.25;
        pixels[i] /= val * multiplier;
        pixels[i + 1] /= val * multiplier;
        pixels[i + 2] /= val * multiplier;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

function rotateCanvas(canvas, amount) {
    const rotatedCanvas = createCanvas(canvas.width, canvas.height);
    const ctx = rotatedCanvas.getContext('2d');

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(amount * Math.PI / 180);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.width / 2);
    ctx.restore();

    return rotatedCanvas;
}

module.exports = {
    renderBlock,
}