// Groups a subject's set/prompt items by their `week` field, sorted
// ascending. Items missing `week` land in a trailing "Unsorted" group
// instead of being dropped, so a set with no week still shows up.
export function groupByWeek(items) {
  const groups = new Map();

  for (const item of items) {
    const week = typeof item.week === "number" ? item.week : null;
    const key = week ?? "unsorted";
    if (!groups.has(key)) {
      groups.set(key, { week, weekTitle: item.weekTitle || null, items: [] });
    }
    groups.get(key).items.push(item);
  }

  return [...groups.values()].sort((a, b) => {
    if (a.week === null) return 1;
    if (b.week === null) return -1;
    return a.week - b.week;
  });
}
