/* eslint-disable no-loops/no-loops */
import 'dotenv/config';
import AuthService from '../../src/services/auth.service';
import mongoServer from '../../src/helpers/tests-helper/db.test-helper';
import { badCredentials, forbidden, notFound } from '../../src/helpers/api-response.helper';
import { mockLoginUserDto, mockSignUpUserDto } from '../../src/fixtures/auth.fixture';

describe('Auth Service', () => {
  const authService = new AuthService();

  beforeEach(async () => {
    await mongoServer.connect();
  });

  afterEach(async () => {
    await mongoServer.clear();
    await mongoServer.close();
  });
  describe('should test #loginUser', () => {
    it('should return access token when login sucess', async () => {
      await authService.signupUser(mockSignUpUserDto);
      const result = await authService.loginUser(mockLoginUserDto);
      expect(result.accessToken).toBeDefined();
    });

    it('should throw custom errors', async () => {
      const mockUserToLogin = { ...mockLoginUserDto };
      await authService.signupUser(mockSignUpUserDto);
      const keys = Object.keys(mockLoginUserDto);
      for (let i = 0; i < keys.length; i++) {
        // verifying if email don't exist and verifying if password is wrong
        try {
          mockUserToLogin.email = keys[i] === 'email' ? 'testanother@gmail.com' : mockLoginUserDto.email;
          mockUserToLogin.password = 'testanotherpassword';
          await authService.loginUser(mockUserToLogin);
        } catch (error) {
          if (keys[i] === 'email') expect(error).toEqual(notFound('user/user-not-found'));
          if (keys[i] === 'password') expect(error).toEqual(badCredentials('auth/login/wrong-password'));
        }
      }
    });
  });

  describe('should test #signupUser', () => {
    it('should return access token when signup sucess', async () => {
      const result = await authService.signupUser(mockSignUpUserDto);
      expect(result.accessToken).toBeDefined();
    });

    it('should throw custom errors', async () => {
      const uniqueKeys = { email: mockSignUpUserDto.email, phone: mockSignUpUserDto.phone };
      await authService.signupUser(mockSignUpUserDto);
      for (const key in uniqueKeys) {
        try {
          uniqueKeys.email = key === 'email' ? mockSignUpUserDto.email : 'testanother@gmail.com';
          uniqueKeys.phone = key === 'phone' ? mockSignUpUserDto.phone : 'testanotherphone';
          const mockUserToSignUp = { ...mockSignUpUserDto, ...uniqueKeys };
          await authService.signupUser(mockUserToSignUp);
        } catch (error) {
          const data = { ...mockSignUpUserDto, ...uniqueKeys, role: 'customer' };
          if (key === 'email') expect(error).toEqual(forbidden('user/user-email-already-exists', data));
          if (key === 'phone') expect(error).toEqual(forbidden('user/user-phone-already-exists', data));
        }
      }
    });
  });
});
