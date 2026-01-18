import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('remove', () => {
    const commentId = 'comment-123';
    const ownerId = 'user-owner';
    const otherUserId = 'user-stranger';

    const mockComment = {
      id: commentId,
      userId: ownerId,
      content: 'Hello world',
    };

    it('powinien pozwolić autorowi usunąć własny komentarz', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      await service.remove(commentId, ownerId, 'USER');

      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: commentId },
      });
    });

    it('powinien pozwolić administratorowi usunąć cudzy komentarz', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      await service.remove(commentId, 'admin-id', 'ADMIN');

      expect(prisma.comment.delete).toHaveBeenCalled();
    });

    it('powinien rzucić ForbiddenException, gdy zwykły użytkownik usuwa cudzy komentarz', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      await expect(
        service.remove(commentId, otherUserId, 'USER'),
      ).rejects.toThrow(ForbiddenException);

      expect(prisma.comment.delete).not.toHaveBeenCalled();
    });

    it('powinien rzucić NotFoundException, gdy komentarz nie istnieje', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.remove('fake-id', ownerId, 'USER')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('powinien poprawnie połączyć komentarz z postem i użytkownikiem', async () => {
      const dto = { content: 'Nice post!', postId: 'p1', userId: 'u1' };
      mockPrismaService.comment.create.mockResolvedValue({ id: 'c1', ...dto });

      await service.create(dto);

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          content: dto.content,
          post: { connect: { id: dto.postId } },
          user: { connect: { id: dto.userId } },
        }),
        include: expect.any(Object),
      });
    });
  });
});
