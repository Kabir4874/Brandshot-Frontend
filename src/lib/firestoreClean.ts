// Removes undefined and NaN so Firestore accepts the payload.
export function cleanForFirestore<T = Record<string, any>>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    // @ts-expect-error narrow runtime
    return obj
      .map((v) => cleanForFirestore(v))
      .filter((v) => v !== undefined && !(typeof v === "number" && Number.isNaN(v)));
  }

  // Handle objects
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (typeof v === "number" && Number.isNaN(v)) continue;

    if (v && typeof v === "object") {
      const cleaned = cleanForFirestore(v);
      if (cleaned !== undefined) out[k] = cleaned;
    } else {
      out[k] = v;
    }
  }
  // @ts-expect-error narrow runtime
  return out;
}
