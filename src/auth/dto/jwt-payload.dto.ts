export interface JwtPayload {
  id(id: any): unknown;
  user: {
    id: number;
    username: string;
  };
}
