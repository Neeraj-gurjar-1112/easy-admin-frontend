import CoreAPIService, { readToken, storeToken } from "./CoreAPIService";
import { API_ENDPOINTS } from "@/utils/api-integration";
import type { AdminLoginResponse } from "@/types/api";

// Admin login against Easy's `POST /api/admin/login` (email + password → JWT with role "admin").
// The token is kept in localStorage; CoreAPIService attaches it to every request.

interface TokenPayload {
  email?: string;
  exp?: number;
}

function decodePayload(token: string): TokenPayload | null {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return null;
    return JSON.parse(window.atob(base64)) as TokenPayload;
  } catch {
    return null;
  }
}

class AuthService {
  private readonly api = new CoreAPIService();

  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const res = await this.api.post<AdminLoginResponse, { email: string; password: string }>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    storeToken(res.token);
    return res;
  }

  logout(): void {
    storeToken(null);
  }

  /** True when a token exists and has not expired (expiry comes from the JWT itself). */
  isAuthenticated(): boolean {
    const token = readToken();
    if (!token) return false;
    const payload = decodePayload(token);
    if (!payload?.exp) return true;
    return payload.exp * 1000 > Date.now();
  }

  /** Email inside the stored token, for the top bar. */
  currentEmail(): string | null {
    const token = readToken();
    return token ? (decodePayload(token)?.email ?? null) : null;
  }
}

const authService = new AuthService();
export default authService;
