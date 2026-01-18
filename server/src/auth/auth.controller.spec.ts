import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  // Mock obiektu Response z Expressa
  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('signIn (login)', () => {
    it('powinien wywołać login w serwisie i ustawić ciasteczko', async () => {
      const loginData = {
        access_token: 'token',
        user: { id: '1', username: 'u' },
      };
      mockAuthService.login.mockResolvedValue(loginData);

      const result = await controller.signIn(
        { email: 't@t.com', password: 'p' },
        mockResponse,
      );

      expect(service.login).toHaveBeenCalled();
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'token',
        expect.any(Object),
      );
      expect(result).toEqual({ user: loginData.user });
    });
  });

  describe('logout', () => {
    it('powinien wyczyścić ciasteczko', () => {
      const result = controller.logout(mockResponse);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        '',
        expect.any(Object),
      );
      expect(result.message).toContain('Logged out');
    });
  });
});
