# Overview

The Minecraft Renderer is a JavaScript tool created to render item icons and blocks from Minecraft.

# How to use

```js
import { render, loadModels, loadTextures, loadBlockStates } from ''

const models = await loadModels(dir);
const textures = await loadTextures(dir);
const blockstates = await loadBlockStates(dir);

const pickaxe = await render(`item/diamond_pickaxe`, null, models, textures, blockstates)
const stone = await render(`item/stone`, null, models, textures, blockstates)
```

# To do

- [ ] Items models (`builtin/generated`)
  - [x] Simple items 
  - [x] Overrides
  - [ ] Animated items
- [ ] Blocks (`block/block`)
  - [x] Simple blocks
  - [ ] Block state
- [ ] Entities (`builtin/entity`)
  - [x] Chest
  - [x] Ender chest
  - [x] Trapped chest
  - [ ] Mob head
  - [ ] Shield
  - [ ] Banners
  - [ ] Beds
  - [ ] Conduit
  - [ ] Shulker box
- [ ] All models
  - [x] parent
  - [ ] ambientocclusion
  - [ ] display
  - [x] textures
  - [ ] elements
    - [x] from
    - [x] to
    - [ ] rotation
    - [x] shade
    - [ ] faces
      - [x] uv
      - [x] texture
      - [x] cullface
      - [x] rotation
      - [x] tintindex