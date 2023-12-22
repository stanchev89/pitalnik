export interface IJwtTokenPayload {
  userId: number;
  username: string;
}

export interface IJwtRefreshTokenPayload {
  id: number;
  substr: string;
}
