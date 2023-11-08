import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import type { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';

export const customResponse = ({ key, code, error, status, data }: HttpMessageResponse): HttpMessageResponse => {
  return {
    key,
    error,
    code,
    status,
    data
  };
};
export const created = (message: string, data?: unknown): HttpMessageResponse => {
  const response = {
    key: 'OK',
    message,
    code: HttpStatusCode.CREATED,
    data,
    status: 'success'
  };
  return response;
};

export const updated = (message: string, data?: unknown): HttpMessageResponse => {
  const response = {
    key: 'UPDATE',
    message,
    code: HttpStatusCode.OK,
    data,
    status: 'success'
  };

  return response;
};

export const ok = (message: string, data?: unknown): HttpMessageResponse => {
  const response = {
    key: 'OK',
    message,
    code: HttpStatusCode.OK,
    data,
    status: 'success'
  };

  return response;
};

export const badRequest = (message: string, data?: unknown): HttpMessageResponse => {
  let response;
  if (data != null) {
    response = {
      key: 'BAD_REQUEST',
      error: message,
      code: HttpStatusCode.BAD_REQUEST,
      status: 'error',
      data
    };
  }

  response = {
    key: 'BAD_REQUEST',
    error: message,
    code: HttpStatusCode.BAD_REQUEST,
    status: 'error'
  };

  return response;
};

export const badCredentials = (message: string): HttpMessageResponse => {
  const response = {
    key: 'BAD_REQUEST',
    code: HttpStatusCode.USER_BAD_CREDENTIALS,
    error: message,
    status: 'error'
  };
  return response;
};
export const notFound = (message: string): HttpMessageResponse => {
  const response = {
    key: 'NOT_FOUND',
    error: message,
    code: HttpStatusCode.NOT_FOUND,
    status: 'error'
  };

  return response;
};

export const forbidden = (message: string, data?: unknown): HttpMessageResponse => {
  const response = {
    key: 'FORBIDDEN',
    error: message,
    code: HttpStatusCode.FORBBIDEN,
    status: 'error',
    data
  };

  return response;
};

export const unauthorized = (message: string): HttpMessageResponse => {
  const response = {
    key: 'UNAUTHORIZED',
    error: message,
    code: HttpStatusCode.UNAUTHORIZED,
    status: 'error'
  };

  return response;
};

export const deleted = (message: string): HttpMessageResponse => {
  const response = {
    key: 'DELETED',
    message,
    code: HttpStatusCode.OK,
    status: 'success'
  };

  return response;
};

export const serverError = (message = 'Internal Server Error'): HttpMessageResponse => {
  const response = {
    key: 'SERVER_ERROR',
    error: message,
    code: HttpStatusCode.SERVER_ERROR,
    status: 'error'
  };

  return response;
};
