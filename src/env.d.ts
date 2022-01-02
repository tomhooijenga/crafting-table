/// <reference types="vite/client" />
import { DefineComponent } from "vue";
import { Item, Icon } from "@/types";

declare module "*.vue" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "items.json" {
  const items: Record<number | string, Item>;
  export default items;
}

declare module "sprite.json" {
  const icons: Record<number | string, Icon>;
  export default icons;
}
