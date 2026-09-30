import { ConfigDTO } from "@/interface/config.dto.js";
import { CreateUserDTO, BaseUserDTO } from "@/interface/user.dto.js";
import { prisma } from "@/lib/prisma.js";

export interface IAuthRepository {
  createUser(user: CreateUserDTO): Promise<any>;
  findUserByEmail(email: string): Promise<BaseUserDTO | null>;
  updateUser(id: string, user: any): Promise<any>;
  createSecretKey(secretKeyHash: string): Promise<ConfigDTO>;
  getSecretKey(): Promise<ConfigDTO | null>;
}

export class AuthRepository implements IAuthRepository {
  async createUser(user: CreateUserDTO): Promise<any> {
    return await prisma.user.create({
      data: user,
    });
  }

  async findUserByEmail(email: string): Promise<BaseUserDTO | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateUser(id: string, user: any): Promise<any> {
    return await prisma.user.update({
      where: {
        id,
      },
      data: user,
    });
  }
  async createSecretKey(secretKeyHash: string): Promise<ConfigDTO> {
    return prisma.config.upsert({
      where: { secretKeyHash },
      update: {},
      create: { secretKeyHash },
    });
  }
  async getSecretKey(): Promise<ConfigDTO | null> {
    const config = await prisma.config.findUnique({
      where: {
        id: 1,
      },
    });

    return config;
  }
}
