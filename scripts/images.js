const cheerio = require('cheerio');
const util = require('util');
const request = util.promisify(require('request'));
const fs = require('fs');

async function get(index) {
  const indexPage = await request(index);
  const $ = cheerio.load(indexPage.body);

  const images = $('.image > img')
    .map((_, img) => {
      return {
        src: img.attribs.srcset.split(' ')[0],
        id: img.attribs.alt
          .toLowerCase()
          .replace(/\(.+\)/, '')
          .replace(/[jb]e\d/g, '')
          .replace(/\.(png|gif)/, '')
          .trim()
          .replace(/ /g, '_'),
        ext: img.attribs.alt.slice(-3),
      }
    })
    .map((_, data) => {
      return new Promise((resolve => {
        request.get(data.src)
          .pipe(fs.createWriteStream(`../src/assets/items/${data.id}.${data.ext}`))
          .on('close', resolve);
      }))
    });

  await Promise.all(images.get());
}

(async () => {
  await get('https://minecraft.gamepedia.com/Category:Inventory_icons');
  // await get('https://minecraft.gamepedia.com/index.php?title=Category:Inventory_icons&filefrom=Iron+Ingot+JE2+BE2.png#mw-category-media');
})();
