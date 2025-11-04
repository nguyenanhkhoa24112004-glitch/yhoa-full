// Simple in-memory caches to avoid repeated external requests
const SINGLE_CACHE = new Map<string, { v: string | null; ts: number }>();
const TTL_MS = 6 * 3600 * 1000; // 6 hours

function getCachedSingle(key: string): string | null | undefined {
  const k = key.trim().toLowerCase();
  const c = SINGLE_CACHE.get(k);
  if (!c) return undefined;
  if (Date.now() - c.ts > TTL_MS) {
    SINGLE_CACHE.delete(k);
    return undefined;
  }
  return c.v;
}

function setCachedSingle(key: string, v: string | null) {
  SINGLE_CACHE.set(key.trim().toLowerCase(), { v, ts: Date.now() });
}

export async function fetchWikiImage(keyword: string): Promise<string | null> {
  const cached = getCachedSingle(keyword);
  if (cached !== undefined) return cached;

  const trySummary = async (lang: string, title: string) => {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
      const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.originalimage?.source || data?.thumbnail?.source || null;
    } catch {
      return null;
    }
  };

  // Try VN then EN
  const vn = await trySummary("vi", keyword);
  if (vn) { setCachedSingle(keyword, vn); return vn; }
  const en = await trySummary("en", keyword);
  if (en) { setCachedSingle(keyword, en); return en; }

  // Fallback generic topic
  const generic = await trySummary("vi", "Y học cổ truyền");
  setCachedSingle(keyword, generic || null);
  return generic || null;
}

export async function fetchWikiImages(keywords: string[], limit = 4): Promise<string[]> {
  const seen = new Set<string>();
  const add = (url?: string | null) => {
    if (url && !seen.has(url)) seen.add(url);
  };

  const uniq = Array.from(new Set(keywords.filter(Boolean).map((k) => k.trim())));
  // Limit initial requests to reduce external calls
  const initialBatch = uniq.slice(0, Math.max(3, Math.min(uniq.length, limit)));
  const initialResults = await Promise.all(initialBatch.map((kw) => fetchWikiImage(kw)));
  initialResults.forEach(add);

  if (seen.size < limit) {
    // Try English variants for common YHCT topics
    const extras = [
      "Traditional Chinese medicine",
      "Acupuncture",
      "Herbalism",
      "Ginger",
      "Cinnamon",
      "Peppermint",
    ];
    const extraBatch = extras.slice(0, Math.max(3, limit - seen.size));
    const extraResults = await Promise.all(extraBatch.map((kw) => fetchWikiImage(kw)));
    extraResults.forEach(add);
  }

  // Basic fallbacks (known working Wikipedia images in repo's data)
  const fallbacks = [
    "https://upload.wikimedia.org/wikipedia/commons/7/70/Ginger.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/8/88/Mentha_piperita_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-097.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/39/Cinnamomum_verum.jpg",
  ];
  for (const u of fallbacks) {
    if (seen.size >= limit) break;
    add(u);
  }

  return Array.from(seen).slice(0, limit);
}