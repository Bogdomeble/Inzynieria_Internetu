import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    category: {
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
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('powinien zwrócić kategorię, jeśli istnieje', async () => {
      const mockCategory = { id: 'uuid-1', name: 'Tech', slug: 'tech' };
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockCategory);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });

    it('powinien rzucić NotFoundException, jeśli kategoria nie istnieje', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('powinien poprawnie stworzyć nową kategorię', async () => {
      const dto = { name: 'Health', slug: 'health', description: 'desc' };
      mockPrismaService.category.create.mockResolvedValue({
        id: 'new-id',
        ...dto,
      });

      const result = await service.create(dto);

      expect(result.name).toBe('Health');
      expect(prisma.category.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('remove', () => {
    it('powinien usunąć kategorię, jeśli ta istnieje', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({
        id: 'id-to-delete',
      });
      mockPrismaService.category.delete.mockResolvedValue({
        id: 'id-to-delete',
      });

      await service.remove('id-to-delete');

      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: 'id-to-delete' },
      });
    });
  });
});
