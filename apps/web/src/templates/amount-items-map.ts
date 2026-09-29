export const ids = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

export type AmountIds = (typeof ids)[number];

export const AmountItemsMap = ids.map((num) => ({
  id: num,
  value: num,
}));
