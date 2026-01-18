import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    tag: {
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
        TagsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('powinien zwrócić tag, gdy zostanie znaleziony po UUID', async () => {
      const mockTag = { id: 'uuid-tag-1', name: 'React', slug: 'react' };
      mockPrismaService.tag.findUnique.mockResolvedValue(mockTag);

      const result = await service.findOne('uuid-tag-1');

      expect(result).toEqual(mockTag);
      expect(prisma.tag.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-tag-1' },
      });
    });

    it('powinien rzucić NotFoundException, gdy tag nie istnieje', async () => {
      mockPrismaService.tag.findUnique.mockResolvedValue(null);

      await expect(service.findOne('fake-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('powinien wysłać poprawne dane do bazy podczas tworzenia taga', async () => {
      const dto = { name: 'NestJS', slug: 'nestjs' };
      mockPrismaService.tag.create.mockResolvedValue({
        id: 'new-uuid',
        ...dto,
      });

      const result = await service.create(dto);

      expect(result.slug).toBe('nestjs');
      expect(prisma.tag.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('remove', () => {
    it('powinien usunąć tag tylko jeśli najpierw go znajdzie', async () => {
      mockPrismaService.tag.findUnique.mockResolvedValue({
        id: 'tag-to-delete',
      });
      mockPrismaService.tag.delete.mockResolvedValue({ id: 'tag-to-delete' });

      await service.remove('tag-to-delete');

      expect(prisma.tag.findUnique).toHaveBeenCalled();
      expect(prisma.tag.delete).toHaveBeenCalledWith({
        where: { id: 'tag-to-delete' },
      });
    });
  });
});
