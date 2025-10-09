export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
