import { type HttpStatusCode } from '../enums/httpStatusCode.enum';

export interface HttpMessageResponse {
  key: string;
  error?: string;
  code: HttpStatusCode;
  status: string;
  data?: unknown;
}
