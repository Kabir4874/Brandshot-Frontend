export type Generation = {
  id: string;
  projectId: string;
  prompt: string;
  mode: "t2i" | "i2i";
  thumbUrl?: string;
  createdAt: number;
};


export interface GenerationResponse {
  operationStatus: string;
  httpCode: string;
  operationType: string;
  imageOutput: string;      
  fileId: string;
  imageDownloadLink: string;  
}