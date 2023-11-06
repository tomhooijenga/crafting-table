const mcData = require("minecraft-data");

// https://minecraft.gamepedia.com/Module:InvSprite
// https://minecraft.gamepedia.com/Category:Animated_inventory_icons
// https://minecraft.fandom.com/wiki/Module:Inventory_slot/Aliases

const version = mcData.versions.pc.find((version) => {
  return version.releaseType === "release";
});

const data = mcData(version.minecraftVersion);

module.exports = {
  VERSION: version.minecraftVersion,
  data,
};
