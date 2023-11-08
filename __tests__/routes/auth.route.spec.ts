import AuthController from '../../src/controllers/auth.controller';
import { authSessionMiddleware } from '../../src/middlewares/auth.middleware';
import { validateCreateUser } from '../../src/validators/user.validator';

const getSpy = jest.fn();
const postSpy = jest.fn();

jest.mock('express', () => {
  const router = {
    post: postSpy,
    get: getSpy
  };

  return {
    Router: () => router
  };
});

describe('Auth test routes', () => {
  const authController = new AuthController();
  const { signup, login, logout } = authController;

  import('../../src/routes/auth.route');

  describe('POST /api/v1/auth/signup', () => {
    it('should call the router', () => {
      expect(postSpy).toHaveBeenCalledWith('/signup', validateCreateUser, signup);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should call the router', () => {
      expect(postSpy).toHaveBeenCalledWith('/login', login);
    });
  });

  describe('GET /api/v1/auth/logout', () => {
    it('should call the router', () => {
      expect(getSpy).toHaveBeenCalledWith('/logout', authSessionMiddleware, logout);
    });
  });
});
