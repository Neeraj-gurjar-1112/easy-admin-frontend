// Shapes of the Easy admin API (Easy-Backend-v2, Express). Legacy handlers answer with
// ad-hoc JSON, so each endpoint has its own response type in src/types/<entity>.ts.
// Errors come in three flavours; CoreAPIService folds them into ApiError.

/** `res.success(data, message)` from lib/http/response.js (newer handlers). */
export interface EasyEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

/** Error bodies: legacy `{ error }`, Joi `{ error, details[] }`, newer `{ success:false, message }`. */
export interface EasyErrorBody {
  error?: string;
  message?: string;
  success?: boolean;
  details?: { field: string; message: string }[];
  errors?: string[] | Record<string, string[]>;
}

/** POST /api/admin/login */
export interface AdminLoginResponse {
  success: boolean;
  token: string;
  admin: { id: string; email: string; name: string; role: string };
}

/** Normalised error thrown by CoreAPIService so screens can show one message. */
export class ApiError extends Error {
  readonly statusCode: number;
  /** Every message, in order (validation errors first). */
  readonly errors: string[];
  /** Validation messages by field name, for forms to show under the right input. */
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, statusCode: number, errors: string[] = [], fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.fieldErrors = fieldErrors;
  }
}
