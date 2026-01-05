
export interface AuthResponse {
  error: string | null;
  success: boolean;
}

export enum FormType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}
