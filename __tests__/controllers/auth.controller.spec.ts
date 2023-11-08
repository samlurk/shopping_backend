import { badCredentials, created, ok, serverError } from '../../src/helpers/api-response.helper';
import AuthController from '../../src/controllers/auth.controller';
import AuthService from '../../src/services/auth.service';
import { HttpStatusCode } from '../../src/enums/httpStatusCode.enum';
import { mockLoginUserDto, mockSignUpUserDto } from '../../src/fixtures/auth.fixture';
import { mockRequest, mockResponse } from '../../src/helpers/tests-helper/mock-controller.test-helper';

jest.mock('../../src/services/auth.service');

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController(authService);
  });

  describe('should test #loginUser', () => {
    afterEach(() => {
      authService.loginUser.mockClear();
    });

    it('should handle when login sucess', async () => {
      const mockToken = { accessToken: 'fakeAuthToken' };
      const req = mockRequest(mockLoginUserDto);
      const res = mockResponse();

      authService.loginUser.mockResolvedValue(mockToken);
      await authController.login(req, res);

      expect(authService.loginUser).toHaveBeenCalledWith(mockLoginUserDto);
      expect(authService.loginUser).toBeCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith('token', mockToken.accessToken, { httpOnly: true });
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.send).toHaveBeenCalledWith(ok('User successfully logged in', mockToken));
    });

    it('should handle custom errors', async () => {
      const req = mockRequest(mockLoginUserDto);
      const res = mockResponse();

      const throwingError = badCredentials('auth/login/wrong-password');

      authService.loginUser.mockRejectedValue(throwingError);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.USER_BAD_CREDENTIALS);
      expect(res.send).toHaveBeenCalledWith(badCredentials('auth/login/wrong-password'));
    });

    it('should handle unexpected errors', async () => {
      const req = mockRequest(mockLoginUserDto);
      const res = mockResponse();

      const unexpectedError = new Error('Internal Server Error');

      authService.loginUser.mockRejectedValue(unexpectedError);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(serverError());
    });
  });

  describe('should test #signupUser', () => {
    afterEach(() => {
      authService.signupUser.mockClear();
    });
    it('should handle when signup sucess', async () => {
      const mockToken = { accessToken: 'fakeAuthToken' };

      const req = mockRequest(mockSignUpUserDto);
      const res = mockResponse();

      authService.signupUser.mockResolvedValue(mockToken);
      await authController.signup(req, res);

      expect(authService.signupUser).toHaveBeenCalledWith(mockSignUpUserDto);
      expect(authService.signupUser).toBeCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith('token', mockToken.accessToken, { httpOnly: true });
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(res.send).toHaveBeenCalledWith(created('User successfully signed in', mockToken));
    });

    it('should handle throwing custom errors', async () => {
      const req = mockRequest(mockLoginUserDto);
      const res = mockResponse();

      const throwingError = badCredentials('auth/signup/user-not-found');

      authService.signupUser.mockRejectedValue(throwingError);

      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.USER_BAD_CREDENTIALS);
      expect(res.send).toHaveBeenCalledWith(badCredentials('auth/signup/user-not-found'));
    });

    it('should handle unexpected errors', async () => {
      const req = mockRequest(mockLoginUserDto);
      const res = mockResponse();

      const unexpectedError = new Error('Internal Server Error');

      authService.signupUser.mockRejectedValue(unexpectedError);

      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(serverError());
    });
  });

  describe('should test #logout', () => {
    it('should handle close session', () => {
      const req = mockRequest({}, { token: 'fakeAuthToken' });
      const res = mockResponse();

      authController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token', {
        httpOnly: true,
        secure: true
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.send).toHaveBeenCalledWith(ok('Closed session'));
    });
  });
});
