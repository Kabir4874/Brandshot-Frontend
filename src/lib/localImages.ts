// src/lib/localImages.ts
export type GenMode = "t2i" | "i2i";

export type LocalImageItem = {
  id: string; // image id
  dataUrl: string; // full-size dataURL (or blob: URL)
  thumbUrl?: string; // optional smaller dataURL for grid
  meta?: Record<string, unknown>;
};

export type LocalGeneration = {
  id: string; // generation id
  projectId: string;
  prompt: string;
  mode: GenMode;
  createdAt: number;
  images: LocalImageItem[]; // <-- multiple images per prompt
};

const KEY = "local-generations-v2";

function loadAll(): LocalGeneration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalGeneration[]) : [];
  } catch {
    return [];
  }
}

function saveAll(rows: LocalGeneration[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

// Create a new generation (prompt) with its images
export function saveGeneration(
  input: Omit<LocalGeneration, "id" | "createdAt"> & { id?: string }
) {
  const gen: LocalGeneration = {
    id: input.id ?? cryptoRandomId(),
    createdAt: Date.now(),
    projectId: input.projectId,
    prompt: input.prompt,
    mode: input.mode,
    images: input.images ?? [],
  };
  const all = loadAll();
  all.push(gen);
  saveAll(all);
  return gen;
}

// Append images to an existing generation
export function appendImages(genId: string, imgs: LocalImageItem[]) {
  const all = loadAll();
  const ix = all.findIndex((g) => g.id === genId);
  if (ix === -1) return;
  all[ix].images.push(...imgs);
  saveAll(all);
}

// List all generations (grouped by prompt) for a project
export function listGenerations(projectId: string): LocalGeneration[] {
  return loadAll()
    .filter((g) => g.projectId === projectId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

// Flattened image list for a project (handy for the grid)
export type ProjectImageFlat = {
  genId: string;
  prompt: string;
  mode: GenMode;
  createdAt: number;
  image: LocalImageItem;
};

export function listImagesByProject(projectId: string): ProjectImageFlat[] {
  const gens = listGenerations(projectId);
  const flat: ProjectImageFlat[] = [];
  gens.forEach((g) => {
    g.images.forEach((img) => {
      flat.push({
        genId: g.id,
        prompt: g.prompt,
        mode: g.mode,
        createdAt: g.createdAt,
        image: img,
      });
    });
  });
  // newest first
  flat.sort((a, b) => b.createdAt - a.createdAt);
  return flat;
}

// Remove one image
export function removeImage(projectId: string, genId: string, imageId: string) {
  const all = loadAll();
  const gi = all.findIndex((g) => g.projectId === projectId && g.id === genId);
  if (gi === -1) return;
  all[gi].images = all[gi].images.filter((i) => i.id !== imageId);
  saveAll(all);
}

// Remove a whole generation (prompt)
export function removeGeneration(projectId: string, genId: string) {
  const all = loadAll().filter(
    (g) => !(g.projectId === projectId && g.id === genId)
  );
  saveAll(all);
}

// Utilities
export function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
