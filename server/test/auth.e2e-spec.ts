// server/test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    prisma = app.get(PrismaService);

    // Czyścimy użytkownika testowego przed startem
    await prisma.user.deleteMany({ where: { email: 'test@e2e.com' } });
  });

  afterAll(async () => {
    // Czyścimy po testach
    await prisma.user.deleteMany({ where: { email: 'test@e2e.com' } });
    await app.close();
  });

  const testUser = {
    email: 'test@e2e.com',
    username: 'TestUser',
    password: 'password123',
  };

  it('/auth/register (POST) - should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        // Sprawdzamy czy otrzymaliśmy token i obiekt user
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toEqual(testUser.email);
      });
  });

  it('/auth/register (POST) - should fail on duplicate email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409); // Conflict
  });

  it('/auth/login (POST) - should login and return JWT', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(res.body.user.email).toEqual(testUser.email);
      });
  });
});