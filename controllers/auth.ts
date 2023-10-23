// import mongoServer from '../../src/helpers/tests-helper/db.test-helper';
// import { HttpStatusCode } from '../../src/enums/httpStatusCode.enum';
// import request from 'supertest';
// import type { IncomingMessage, Server, ServerResponse } from 'http';
// import app from '../../src/app';
// import { AuthService } from '../../src/services/auth.service';

// describe('Auth test routes', () => {
//   const getSpy = jest.fn();
//   let server: Server<typeof IncomingMessage, typeof ServerResponse>;
//   const authService = new AuthService();
//   const { signupUser, loginUser } = authService;

//   jest.doMock('express', () => {
//     return {
//       Router() {
//         return {
//           get: getSpy
//         };
//       }
//     };
//   });

//   beforeAll(async () => {
//     await mongoServer.connect();
//     server = app.listen(process.env.PORT);
//   });

//   afterAll(async () => {
//     await mongoServer.close();
//     server.close();
//   });

//   describe('POST /api/v1/auth/signup', () => {
//     it('should respond with a 201 status code', async () => {
//       const newUser = {
//         firstName: 'Test firstname',
//         lastName: 'Test lastName',
//         email: 'test@hotmail.com',
//         phone: '+12342342359',
//         password: '12345678'
//       };
//       const res = await request(server).post('/api/v1/auth/signup').send(newUser);
//       expect(res.statusCode).toBe(HttpStatusCode.CREATED);
//     });
//   });

//   describe('POST /api/v1/auth/login', () => {
//     it('should respond with a 200 status code', async () => {
//       const newUser = {
//         email: 'test@hotmail.com',
//         password: '12345678'
//       };
//       const res = await request(server).post('/api/v1/auth/login').send(newUser);
//       expect(res.statusCode).toBe(HttpStatusCode.OK);
//     });
//   });

//   describe('GET /api/v1/auth/logout', () => {
//     it('should respond with a 200 status code', async () => {
//       const res = await request(server).get('/api/v1/auth/logout');
//       const clearedCookie = res.headers['set-cookie'].find((cookie: string) => cookie.startsWith('jwt='));
//       expect(clearedCookie).toBeUndefined();
//       expect(res.statusCode).toBe(HttpStatusCode.OK);
//     });
//   });
// });
