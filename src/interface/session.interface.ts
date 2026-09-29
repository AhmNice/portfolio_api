export interface SessionPayload {
  sessionId?: string;
  userId: string;
  email?: string;
  role: "ADMIN" | "USER" | "GUEST" | "SYSTEM_ADMIN";
}
export interface jwtSignReturnType {
  accessToken: string;
  refreshToken: string;
}
