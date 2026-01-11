// server/test/posts.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import  request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Posts Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    // Czyścimy dane przed testami, żeby mieć czyste środowisko
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    // 1. Tworzymy dane pomocnicze (User, Category, Tags)
    const user = await prisma.user.create({
      data: { username: 'Author', email: 'author@test.com', password: 'hash', role: 'AUTHOR' },
    });
    const category = await prisma.category.create({
      data: { name: 'TestCat', slug: 'test-cat' },
    });
    const tagJava = await prisma.tag.create({ data: { name: 'Java', slug: 'java' } });
    const tagJs = await prisma.tag.create({ data: { name: 'JS', slug: 'js' } });

    // 2. Tworzymy Posty
    // Post A: Java
    await prisma.post.create({
      data: {
        title: 'Spring Boot Guide',
        slug: 'spring-boot',
        content: 'Content about Java',
        published: true,
        authorId: user.id,
        categoryId: category.id,
        tags: { connect: [{ id: tagJava.id }] },
      },
    });

    // Post B: JS
    await prisma.post.create({
      data: {
        title: 'React Guide',
        slug: 'react-guide',
        content: 'Content about JS',
        published: true,
        authorId: user.id,
        categoryId: category.id,
        tags: { connect: [{ id: tagJs.id }] },
      },
    });
  });

  afterAll(async () => {
    // Sprzątanie po testach
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await app.close();
  });

  it('/posts (GET) - should return all posts', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('/posts?search=Spring (GET) - should filter by title', () => {
    return request(app.getHttpServer())
      .get('/posts?search=Spring')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toContain('Spring');
      });
  });

  it('/posts?tag=js (GET) - should filter by tag', () => {
    return request(app.getHttpServer())
      .get('/posts?tag=js')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].slug).toBe('react-guide');
      });
  });
});