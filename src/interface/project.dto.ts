import { Status } from "@/generated/prisma/browser.js";
import { ArticleDTO } from "./article.dto.js";
import { UserDTO } from "./user.dto.js";

type LinkType = "SOURCE_CODE" | "LIVE_DEMO" | "DOCUMENTATION" | "OTHER";
// Link DTOs
export interface ProjectLinkDTO {
  id?: string;
  type: LinkType;
  url: string;
}

export interface CreateProjectLinkInput {
  type: LinkType;
  url: string;
}

// Project DTOs
export interface CreateProjectDTO {
  name: string;
  slug: string;
  description?: string;
  content:string;
  coverImage: string;
  status?: Status;
  techStack?: string[];
  links?: CreateProjectLinkInput[];
  ownerId: string;
}

export interface UpdateProjectDTO {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  status?: Status;
  techStack?: string[];
  links?: CreateProjectLinkInput[];
}

export interface ProjectDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string;
  status: Status;
  techStack: string[];
  links?: ProjectLinkDTO[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended DTOs with relations
export interface ArticleWithRelationsDTO extends ArticleDTO {
  author: UserDTO;
  project?: ProjectDTO | null;
}

export interface ProjectWithRelationsDTO extends ProjectDTO {
  owner: UserDTO;
  links: ProjectLinkDTO[];
  articles?: ArticleDTO[];
}

export interface UserWithRelationsDTO extends UserDTO {
  articles?: ArticleDTO[];
  projects?: ProjectDTO[];
}
