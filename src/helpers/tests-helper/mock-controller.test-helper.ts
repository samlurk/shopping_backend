import type { Request, Response } from 'express';
export const mockResponse = (): Response => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn()
  };
  return res as Response;
};

export const mockRequest = (body: object, cookies = {}): Request => {
  const req: Partial<Request> = {
    body
  };
  return req as Request;
};
