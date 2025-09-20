export type Project = {
  id: string;
  name: string;
  client?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  totalGenerations: number;
  ownerId: string;
  archived: boolean;
};
