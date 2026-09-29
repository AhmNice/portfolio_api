interface CreateConfigDTO {
  secretKeyHash: string;
}

interface UpdateConfigDTO {
  secretKeyHash?: string;
}

export interface ConfigDTO {
  id: number;
  secretKeyHash: string;
  createdAt: Date;
  updatedAt: Date;
}