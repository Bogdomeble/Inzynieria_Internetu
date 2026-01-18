import { Test, TestingModule } from '@nestjs/testing';
import { CleanupService } from './cleanup.service';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';

jest.mock('fs');

describe('CleanupService', () => {
  let service: CleanupService;
  let prisma: PrismaService;

  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('powinien usunąć plik, jeśli nie ma go w bazie i jest starszy niż godzina', async () => {
    const fileName = 'orphan.jpg';

    (fs.readdirSync as jest.Mock).mockReturnValue([fileName]);

    mockPrismaService.post.findMany.mockResolvedValue([]);

    const oldStats = {
      mtime: { getTime: () => Date.now() - 2 * 60 * 60 * 1000 },
    };
    (fs.statSync as jest.Mock).mockReturnValue(oldStats);

    await service.handleCron();

    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  it('powinien ZOSTAWIĆ plik, jeśli jest on przypisany do posta w bazie danych', async () => {
    const activeFile = 'active.jpg';

    (fs.readdirSync as jest.Mock).mockReturnValue([activeFile]);

    mockPrismaService.post.findMany.mockResolvedValue([
      { featuredImage: `http://localhost:3001/uploads/${activeFile}` },
    ]);

    await service.handleCron();

    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });

  it('powinien ZOSTAWIĆ plik, jeśli jest osierocony, ale wgrany całkiem niedawno', async () => {
    const newFile = 'just-uploaded.jpg';

    (fs.readdirSync as jest.Mock).mockReturnValue([newFile]);
    mockPrismaService.post.findMany.mockResolvedValue([]);

    const freshStats = { mtime: { getTime: () => Date.now() - 5 * 60 * 1000 } };
    (fs.statSync as jest.Mock).mockReturnValue(freshStats);

    await service.handleCron();

    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });
});
