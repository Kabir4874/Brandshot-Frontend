export type AppUserDoc = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string | null;
  plan?: "free" | "pro";
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

export type PromptPreset = {
  id?: string;
  category: "social" | "marketing" | "ecom";
  platform: string; // e.g., instagram | twitter | tiktok | linkedin
  contentType: string; // e.g., caption | post | ad | script
  prompt: string;
  createdAt: number;
  updatedAt: number;
};
