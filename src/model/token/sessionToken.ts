import { prisma } from "@/lib/prisma.js";

export interface ITokenRepository {
  saveSession(userId: string, sessionId: string): Promise<any>;
  findSession(userId: string, sessionId: string): Promise<any>;
  markAsRotated(userId: string, sessionId: string): Promise<any>;
  deleteSession(userId: string, sessionId: string): Promise<any>;
  rotateSessionAtomically(
    userId: string,
    oldSessionId: string,
    newSessionId: string,
  ): Promise<boolean>;
  deleteAllUserSessions(userId: string): Promise<any>;
}
export class TokenRepository implements ITokenRepository {
  rotateSessionAtomically(
    userId: string,
    oldSessionId: string,
    newSessionId: string,
  ): Promise<boolean> {
    return TokenRepository.rotateSessionAtomically(
      userId,
      oldSessionId,
      newSessionId,
    );
  }
  saveSession(userId: string, sessionId: string) {
    return prisma.sessionToken.create({
      data: {
        sessionTokenId: sessionId,
        userId,
      },
    });
  }
  static async rotateSessionAtomically(
    userId: string,
    oldSessionId: string,
    newSessionId: string,
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Consume the old session.
      const result = await tx.sessionToken.updateMany({
        where: {
          userId,
          sessionTokenId: oldSessionId,
          revoked: false,
        },
        data: {
          revoked: true,
          usedAt: new Date(),
        },
      });

      // Nobody successfully consumed this session.
      if (result.count !== 1) {
        return false;
      }

      // 2. Create the new session.
      await tx.sessionToken.create({
        data: {
          sessionTokenId: newSessionId,
          userId,
        },
      });

      return true;
    });
  }
  findSession(userId: string, sessionId: string) {
    return prisma.sessionToken.findFirst({
      where: {
        userId,
        sessionTokenId: sessionId,
      },
    });
  }
  markAsRotated(userId: string, sessionId: string) {
    return prisma.sessionToken.updateMany({
      where: {
        userId,
        sessionTokenId: sessionId,
      },
      data: {
        revoked: true,
        usedAt: new Date(),
      },
    });
  }
  deleteSession(userId: string, sessionId: string) {
    return prisma.sessionToken.deleteMany({
      where: {
        userId,
        sessionTokenId: sessionId,
      },
    });
  }
  deleteAllUserSessions(userId: string) {
    return prisma.sessionToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
