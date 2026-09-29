import Fuse from "fuse.js";

function filterItemsBySearchName(
  searchTerm: string,
  items: unknown[],
  keys: string[]
) {
  const options = {
    includeScore: false,
    keys: keys,
  };
  if (searchTerm.length > 0) {
    const fuse = new Fuse(items, options);
    const result = fuse.search(searchTerm);
    return result.map((obj) => obj.item);
  } else {
    return items;
  }
}

export default filterItemsBySearchName;
