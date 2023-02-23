import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { HttpMessageResponse } from '../interfaces/httpMessageResponse.interface';
class APIResponse {
  constructor({ key, code, error, status, data }: HttpMessageResponse) {
    const response = {
      key,
      error,
      code,
      status,
      data
    };
    return response;
  }
  static created(message: string, data: object) {
    const response = {
      key: 'OK',
      message,
      code: HttpStatusCode.CREATED,
      data,
      status: 'success'
    };

    return response;
  }

  static updated(message: string, data: object) {
    const response = {
      key: 'UPDATE',
      message,
      code: HttpStatusCode.OK,
      data,
      status: 'success'
    };

    return response;
  }

  static ok(message: string, data: object) {
    const response = {
      key: 'OK',
      message,
      code: HttpStatusCode.OK,
      data,
      status: 'success'
    };

    return response;
  }

  static badRequest(message: string, data?: string) {
    let response;
    if (data) {
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
  }

  static badCredentials(message: string) {
    const response = {
      key: 'BAD_REQUEST',
      code: HttpStatusCode.USER_BAD_CREDENTIALS,
      error: message,
      status: 'error'
    };
    return response;
  }
  static notFound(message: string) {
    const response = {
      key: 'NOT_FOUND',
      error: message,
      code: HttpStatusCode.NOT_FOUND,
      status: 'error'
    };

    return response;
  }

  static forbidden(message: string) {
    const response = {
      key: 'FORBIDDEN',
      error: message,
      code: HttpStatusCode.FORBBIDEN,
      status: 'error'
    };

    return response;
  }

  static unauthorized(message: string) {
    const response = {
      key: 'UNAUTHORIZED',
      error: message,
      code: HttpStatusCode.UNAUTHORIZED,
      status: 'error'
    };

    return response;
  }

  static deleted(message: string) {
    const response = {
      key: 'DELETED',
      message,
      code: HttpStatusCode.OK,
      status: 'success'
    };

    return response;
  }

  static serverError(message: string) {
    const response = {
      key: 'SERVER_ERROR',
      error: message,
      code: HttpStatusCode.SERVER_ERROR,
      status: 'error'
    };

    return response;
  }
}

export default APIResponse;
