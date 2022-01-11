import { computed, Ref, ref, unref, watch } from "vue";

function contains(query: string, string: string): boolean {
  if (!query) {
    return true;
  }

  return string.toLowerCase().includes(query);
}

export function useSearch<T>(
  source: T[] | Ref<T[]>,
  pageSize: number,
  searchValue: (item: T) => string
) {
  const search = ref("");
  const index = ref(0);

  const filtered = computed(() => {
    const query = search.value.trim().toLowerCase();
    return unref(source).filter((item) => contains(query, searchValue(item)));
  });

  const page = computed(() => {
    const start = index.value * pageSize;

    return filtered.value.slice(start, start + pageSize);
  });

  const pages = computed(() => {
    return Math.ceil(filtered.value.length / pageSize);
  });

  watch(pages, (count) => {
    if (count < index.value) {
      index.value = 0;
    }
  });

  return {
    search,
    index,
    page,
    pages,
    filtered,
  };
}
