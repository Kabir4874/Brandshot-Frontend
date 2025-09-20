export type Generation = {
  id: string;
  projectId: string;
  prompt: string;
  mode: "t2i" | "i2i";
  thumbUrl?: string;
  createdAt: number;
};
