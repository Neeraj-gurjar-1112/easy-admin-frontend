import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { ApiError, type EasyErrorBody } from "@/types/api";
import { ADMIN_TOKEN_KEY } from "@/utils/constants";

// Layer 2 of 3: the axios wrapper every domain service uses.
// - baseURL from NEXT_PUBLIC_API_BASE_URL (Easy admin API root, /api/admin)
// - attaches the admin JWT (Bearer) when one is stored (login page)
// - returns the response body as-is (no data.data.data surprises)
// - turns any failure into ApiError { message, statusCode, errors, fieldErrors } for the UI
// - on 401 drops the token and sends the browser to /login (session expired)

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const REQUEST_TIMEOUT_MS = 20_000;
const LOGIN_PATH = "/login";

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // storage blocked — the user simply has to log in again next time
  }
}

class CoreAPIService {
  private readonly http: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.http = axios.create({
      baseURL,
      timeout: REQUEST_TIMEOUT_MS,
      headers: { "Content-Type": "application/json" },
    });

    this.http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = readToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError<EasyErrorBody>) => {
        const apiError = toApiError(error);
        if (apiError.statusCode === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith(LOGIN_PATH)) {
          storeToken(null);
          window.location.assign(`${LOGIN_PATH}?next=${encodeURIComponent(window.location.pathname)}`);
        }
        return Promise.reject(apiError);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.get<T>(url, config);
    return data;
  }

  async post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.post<T>(url, body, config);
    return data;
  }

  async put<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.put<T>(url, body, config);
    return data;
  }

  async patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.patch<T>(url, body, config);
    return data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.delete<T>(url, config);
    return data;
  }
}

/**
 * Folds the Easy error shapes into one ApiError:
 *  - legacy `{ error }`
 *  - Joi   `{ error: "Validation failed", details: [{ field, message }] }`  → fieldErrors + first message
 *  - newer `{ success:false, message, errors }`
 */
function toApiError(error: AxiosError<EasyErrorBody>): ApiError {
  if (!error.response) {
    return new ApiError("Cannot reach the server. Check that the API is running and try again.", 0);
  }

  const body = error.response.data;
  const status = error.response.status;
  const fieldErrors: Record<string, string> = {};
  for (const detail of body?.details ?? []) {
    if (detail.field && !fieldErrors[detail.field]) fieldErrors[detail.field] = detail.message;
  }
  const errors = [...Object.values(fieldErrors), ...flattenErrors(body?.errors)];
  const generic = body?.error || body?.message;
  const message = (generic === "Validation failed" && errors[0]) || generic || errors[0] || error.message || "Something went wrong.";
  return new ApiError(message, status, errors, fieldErrors);
}

function flattenErrors(errors: EasyErrorBody["errors"]): string[] {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors;
  return Object.values(errors).flat();
}

export default CoreAPIService;
