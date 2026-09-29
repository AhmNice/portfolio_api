import {
  CreateProjectDTO,
  ProjectDTO,
  UpdateProjectDTO,
} from "@/interface/project.dto.js";
import { prisma } from "@/lib/prisma.js";

export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<ProjectDTO>;
  list(): Promise<ProjectDTO[]>;
  listPublished(): Promise<ProjectDTO[]>;
  get(id: string): Promise<ProjectDTO | null>;
  getBySlug(slug: string): Promise<ProjectDTO | null>;
  update(id: string, data: UpdateProjectDTO): Promise<ProjectDTO>;
  delete(id: string): Promise<ProjectDTO>;
  deleteAll(): Promise<void>;
}

export class ProjectRepository implements IProjectRepository {
  async create(data: CreateProjectDTO): Promise<ProjectDTO> {
    const { links, ...projectData } = data;
    return prisma.project.create({
      data: {
        ...projectData,
        links: links?.length
          ? {
              createMany: {
                data: links,
              },
            }
          : undefined,
      },
      include: {
        links: true,
      },
    });
  }

  async list(): Promise<ProjectDTO[]> {
    return prisma.project.findMany({
      include: {
        links: true,
      },
    });
  }
  async listPublished(): Promise<ProjectDTO[]> {
    return prisma.project.findMany({
      where: { status: "PUBLISHED" },
      include: {
        links: true,
      },
    });
  }

  async get(id: string): Promise<ProjectDTO | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        links: true,
      },
    });
  }
  async getBySlug(slug: string): Promise<ProjectDTO | null> {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        links: true,
      },
    });
  }

  async update(id: string, data: UpdateProjectDTO): Promise<ProjectDTO> {
    const { links, ...updateData } = data;

    return prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(links && {
          links: {
            deleteMany: {}, // Reset existing links
            createMany: {
              data: links,
            },
          },
        }),
      },
      include: {
        links: true,
      },
    });
  }

  async delete(id: string): Promise<ProjectDTO> {
    return prisma.project.delete({
      where: { id },
      include: {
        links: true,
      },
    });
  }

  async deleteAll(): Promise<void> {
    await prisma.project.deleteMany();
  }
}

const projectRepository = new ProjectRepository();
export default projectRepository;
