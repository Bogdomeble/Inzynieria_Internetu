import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('powinien wywołać findMany z filtrem wyszukiwania, jeśli podano "search"', async () => {
      await service.findAll({ search: 'NestJS' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                OR: [
                  { title: { contains: 'NestJS' } },
                  { content: { contains: 'NestJS' } },
                ],
              },
            ]),
          }),
        }),
      );
    });

    it('powinien filtrować po slugu taga, jeśli podano "tag"', async () => {
      await service.findAll({ tag: 'javascript' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { tags: { some: { slug: 'javascript' } } },
            ]),
          }),
        }),
      );
    });
  });

  describe('remove', () => {
    const postId = 'post-1';
    const authorId = 'user-1';

    it('powinien pozwolić autorowi usunąć swój post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: authorId,
      });

      await service.remove(postId, authorId, 'USER');

      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      });
    });

    it('powinien rzucić ForbiddenException, jeśli użytkownik nie jest autorem ani adminem', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: authorId,
      });

      await expect(
        service.remove(postId, 'other-user', 'USER'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('powinien pozwolić adminowi usunąć dowolny post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: authorId,
      });

      await service.remove(postId, 'admin-id', 'ADMIN');

      expect(prisma.post.delete).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('powinien rzucić NotFoundException, jeśli post o danym slugu nie istnieje', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('nie-ma-takiego-posta')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
