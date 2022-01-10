import { computed, ref } from "vue";

type SpriteEntry = {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
};

const sprites = {
  crafting_book: {
    url: "/src/assets/gui/crafting_table.png",
    x: 0,
    y: 168,
    width: 20,
    height: 18,
    scale: 2,
  },
  crafting_book_hover: {
    url: "/src/assets/gui/crafting_table.png",
    x: 0,
    y: 187,
    width: 20,
    height: 18,
    scale: 2,
  },
  crafting_arrow: {
    url: "/src/assets/gui/crafting_table.png",
    x: 90,
    y: 35,
    width: 22,
    height: 15,
    scale: 2,
  },
} as const;

type SpriteId = keyof typeof sprites;

export function getEntry(id: SpriteId | null): SpriteEntry | null {
  if (id === null) {
    return null;
  }
  return sprites[id];
}

export function useSprite(initialId: SpriteId | null = null) {
  const id = ref<SpriteId | null>(initialId);
  const entry = computed(() => getEntry(id.value));
  const style = computed(() => {
    if (entry.value === null) {
      return {};
    }

    const { url, x, y, width, height, scale } = entry.value;

    return {
      width: `${width * scale}px`,
      height: `${height * scale}px`,
      backgroundImage: `url(${url})`,
      backgroundPosition: `-${x * scale}px -${y * scale}px`,
      backgroundSize: `512px 512px`,
      imageRendering: "pixelated",
    };
  });

  return {
    id,
    entry,
    style,
  };
}
