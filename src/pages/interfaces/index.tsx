export interface User {
  username: string;
  email: string;
  id: number;
  password?: string;
  __v?: number;
  created_at: Date;
  updated_at: Date;
}
