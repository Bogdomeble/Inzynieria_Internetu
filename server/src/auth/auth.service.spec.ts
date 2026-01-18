import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'signed_token_123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('powinien zalogować i zwrócić token przy poprawnych danych', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'hashed_password',
        username: 'test',
        role: 'USER',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result.access_token).toBe('signed_token_123');
      expect(result.user.username).toBe('test');
    });

    it('powinien rzucić UnauthorizedException gdy hasło jest błędne', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('powinien stworzyć użytkownika, jeśli email jest wolny', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null); // Brak usera o tym mailu
      mockPrismaService.user.create.mockResolvedValue({
        id: '2',
        email: 'new@test.com',
        username: 'new',
        role: 'USER',
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');

      const result = await service.register({
        email: 'new@test.com',
        username: 'new',
        password: 'password',
      });

      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result.user.email).toBe('new@test.com');
    });

    it('powinien rzucić ConflictException jeśli email już istnieje', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(
        service.register({
          email: 'existing@test.com',
          username: 'u',
          password: 'p',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
