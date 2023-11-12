// adapted from jimp: https://github.com/jimp-dev/jimp/blob/af334eff862cc8091378cd6b1e194086e36d445e/packages/core/src/composite/index.js
function compose(src, layer) {
    const srcView = new Uint8ClampedArray(src);
    const layerView = new Uint8ClampedArray(layer);

    for (let i = 0; i < srcView.length; i += 4) {
        const pixel = dstOver({
            r: srcView[i + 0] / 255,
            g: srcView[i + 1] / 255,
            b: srcView[i + 2] / 255,
            a: srcView[i + 3] / 255,
        },  {
            r: layerView[i + 0] / 255,
            g: layerView[i + 1] / 255,
            b: layerView[i + 2] / 255,
            a: layerView[i + 3] / 255,
        });

        srcView[i + 0] = pixel.r * 255;
        srcView[i + 1] = pixel.g * 255;
        srcView[i + 2] = pixel.b * 255;
        srcView[i + 3] = pixel.a * 255;
    }
}


function dstOver(src, dst) {
    const a = dst.a + src.a - dst.a * src.a;
    const r = (dst.r * dst.a + src.r * src.a * (1 - dst.a)) / a;
    const g = (dst.g * dst.a + src.g * src.a * (1 - dst.a)) / a;
    const b = (dst.b * dst.a + src.b * src.a * (1 - dst.a)) / a;

    return { r, g, b, a };
}

module.exports = {
    compose,
}