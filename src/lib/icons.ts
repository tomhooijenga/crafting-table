import _sprite from "@/assets/data/sprite.json";
import { Icon } from "@/types";

const sprite = _sprite as Record<string, Icon>;

export function getIcon(id: string | number): Icon {
  return sprite[id];
}
