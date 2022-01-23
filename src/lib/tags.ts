import _tags from "@/assets/data/tags.json";

const tags = _tags as Record<string, string[]>;

export function itemHasTag(tag: string, name: string): boolean {
  return getTagItems(tag).includes(name);
}

export function getTagItems(tag: string): string[] {
  return tags[tag].flatMap((item) => {
    if (item[0] === "#") {
      return getTagItems(item.slice(1));
    }
    return item;
  });
}
