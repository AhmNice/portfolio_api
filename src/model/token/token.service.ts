import { TokenRepository } from "./sessionToken.js";

export class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  async isActiveToken(userId: string, sessionId: string): Promise<boolean> {
    const session = await this.tokenRepository.findSession(userId, sessionId);
    if (!session) {
      return false;
    }
    return !session.revoked;
  }

  async invalidateToken(userId: string, sessionId: string) {
    return this.tokenRepository.markAsRotated(userId, sessionId);
  }

  async deleteToken(userId: string, sessionId: string) {
    return this.tokenRepository.deleteSession(userId, sessionId);
  }

  async deleteAllUserTokens(userId: string) {
    return this.tokenRepository.deleteAllUserSessions(userId);
  }

  async rotateSession(userId: string, sessionId: string) {
    if (typeof this.tokenRepository.markAsRotated === "function") {
      await this.tokenRepository.markAsRotated(userId, sessionId);
    } else {
      await this.tokenRepository.deleteSession(userId, sessionId);
    }
  }
  async rotateSessionAtomically(
    userId: string,
    oldSessionId: string,
    newSessionId: string,
  ) {
    return await this.tokenRepository.rotateSessionAtomically(
      userId,
      oldSessionId,
      newSessionId,
    );
  }

  revokeAllUserSessions(userId: string) {
    return this.tokenRepository.deleteAllUserSessions(userId);
  }
}
