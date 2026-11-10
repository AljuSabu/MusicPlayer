const KEY = "vibra:recent-searches";
const MAX = 8;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export function addRecentSearch(term: string) {
  const clean = term.trim();
  if (clean.length < 2) return;
  const rest = getRecentSearches().filter(
    (t) => t.toLowerCase() !== clean.toLowerCase(),
  );
  save([clean, ...rest].slice(0, MAX));
}

export function removeRecentSearch(term: string): string[] {
  const list = getRecentSearches().filter((t) => t !== term);
  save(list);
  return list;
}

export function clearRecentSearches() {
  save([]);
}
