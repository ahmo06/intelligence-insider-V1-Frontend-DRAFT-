export interface AuthUser {
  id: number;
  email: string;
  email_verified: boolean;
  name: string;
  sub: string;
  created_at: string;
  updated_at: string;
  picture?: string;
}

export interface AuthSession {
  id: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  ip_address?: string;
  user_agent?: string;
}
