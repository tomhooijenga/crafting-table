const {createCanvas, loadImage} = require("canvas");

const SCALE = 10;
const BLOCK_SIZE = 16;
const ISO_WIDTH = 0.5;

async function renderBlock(modelChain, textureMap) {
    const size = BLOCK_SIZE * SCALE;
    const canvas = createCanvas(size * 2, size + size * 1.2);
    const ctx = canvas.getContext('2d');
    const elements = modelChain.find(({elements}) => elements).elements;

    for (const element of elements) {
        const renderedElement = await renderBlockElement(element, textureMap);

        ctx.drawImage(renderedElement, 0, 0, renderedElement.width, renderedElement.height);
    }

    return canvas.toBuffer(undefined, 'image/png');
}

async function renderBlockElement(element, textureMap) {
    const size = BLOCK_SIZE * SCALE;
    const canvas = createCanvas(size * 2, size + size * 1.2);
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    const [top, south, east] = await Promise.all([
        await getElementFaceTexture(element, 'up', textureMap),
        await getElementFaceTexture(element, 'south', textureMap),
        await getElementFaceTexture(element, 'east', textureMap)
    ]);

    if (top) {
        renderElementTop(ctx, element, top);
    }
    if (east) {
        renderElementEast(ctx, element, east);
    }
    if (south) {
        renderElementSouth(ctx, element, south);
    }

    ctx.setTransform(1, -ISO_WIDTH, 1, ISO_WIDTH, 0, 0);
    ctx.strokeRect(-80, 80, 160, 160);
    ctx.strokeRect(-272, 272, 160, 160);

    return await canvas;
}

function renderElementTop(ctx, element, texture) {
    const size = BLOCK_SIZE * SCALE;

    // x, y, z => east, up, south
    const {from, to} = element;
    const east = SCALE * (to[0] - from[0]);
    const south = SCALE * (to[2] - from[2]);

    const topEast = SCALE * from[0];
    const topSouth = SCALE * (BLOCK_SIZE - to[2]);
    const top = size * 0.5 + size * 1.2 - SCALE * to[1] * 1.2;

    ctx.setTransform(1, -ISO_WIDTH, 1, ISO_WIDTH, 0, 0);
    ctx.drawImage(texture, -top + topSouth, top + topEast, south, east + 1.5);
}

function renderElementEast(ctx, element, texture) {
    const size = BLOCK_SIZE * SCALE;
    const skew = ISO_WIDTH * 2;

    // x, y, z => east, up, south
    const {from, to} = element;
    const up = SCALE * (to[1] - from[1]);
    const south = SCALE * (to[2] - from[2])

    const leftEast = SCALE * to[0];
    const leftSouth = SCALE * (BLOCK_SIZE - to[2]);
    const left = leftEast + leftSouth;

    const topUp = SCALE * to[1] * 1.2;
    const topEast = SCALE * (BLOCK_SIZE - to[0]);
    const top = size * 1.5 + size * 1.2 - topUp - topEast;

    ctx.setTransform(1, -ISO_WIDTH, 0, skew, 0, ISO_WIDTH);
    ctx.drawImage(texture, left, top, south, up * 1.2);
}

function renderElementSouth(ctx, element, texture) {
    const size = BLOCK_SIZE * SCALE;
    const skew = ISO_WIDTH * 2;

    // x, y, z => east, up, south
    const {from, to} = element;
    const up = SCALE * (to[1] - from[1]);
    const east = SCALE * (to[0] - from[0]);

    const topUp = SCALE * to[1] * 1.2;
    const topSouth = SCALE * (BLOCK_SIZE - to[2]);
    const top = size * 0.5 + size * 1.2 - topUp - topSouth;

    const leftEast = SCALE * from[0];
    const leftSouth = SCALE * (BLOCK_SIZE - to[2]);
    const left = leftEast + leftSouth;

    ctx.setTransform(1, ISO_WIDTH, 0, skew, 0, 0);
    ctx.drawImage(texture, left, top, east, up * 1.2);
}

async function getElementFaceTexture(element, faceName, textureMap) {
    const face = element.faces[faceName];

    if (!face) {
        return null;
    }

    const img = await loadImage(textureMap.get(face.texture));
    let texture = createCanvas(img.width, img.height);

    texture.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    if (face.uv) {
        texture = cropCanvas(texture, face.uv);
    }

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

    texture = scaleCanvas(texture, SCALE);

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

function cropCanvas(canvas, uv) {
    const [x1, y1, x2, y2] = uv;
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    const croppedCanvas = createCanvas(BLOCK_SIZE, BLOCK_SIZE);
    const ctx = croppedCanvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    ctx.translate(
        x1 > x2 ? croppedCanvas.width : 0,
        y1 > y2 ? croppedCanvas.height : 0
    )
    ctx.scale(
        x1 > x2 ? -1: 1,
        y1 > y2 ? -1: 1
    )
    ctx.drawImage(canvas, Math.min(x1, x2), Math.min(y1, y2), w, h, 0, 0, BLOCK_SIZE, BLOCK_SIZE);

    return croppedCanvas;
}

module.exports = {
    renderBlock,
}