export interface SessionPayload {
  sessionId?: string;
  userId: string;
  email?: string;
  stationId?: string;
}
export interface jwtSignReturnType {
  accessToken: string;
  refreshToken: string;
}