const mcData = require("minecraft-data");

const version = mcData.versions.pc.find((version) => {
  return version.releaseType === 'release';
});

const data = mcData(version.minecraftVersion);
// https://minecraft.gamepedia.com/Template:InvSprite#Example
// https://minecraft.gamepedia.com/Module:InvSprite
// https://minecraft.gamepedia.com/Category:Animated_inventory_icons

module.exports = {
  VERSION: version.minecraftVersion,
  data,
};
