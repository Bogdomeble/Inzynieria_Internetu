/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { BadRequestException } from '@nestjs/common';
// import * as sharp from 'sharp';

// Mockowanie biblioteki sharp
jest.mock('sharp', () => {
  const mSharp = {
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(true),
  };
  return jest.fn(() => mSharp);
});

describe('UploadsController', () => {
  let controller: UploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('uploadFile() powinien zwrócić poprawny URL dla wgranego pliku', async () => {
    const mockFile = {
      buffer: Buffer.from('fake-image-data'), // Musi być buffer dla sharp
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const result = await controller.uploadFile(mockFile);

    // Sprawdzamy czy URL pasuje do wzorca (bo nazwa pliku jest dynamiczna)
    expect(result.url).toContain('http://localhost:3001/uploads/image-');
    expect(result.url).toMatch(/\.webp$/);
  });

  it('uploadFile() powinien rzucić BadRequestException, jeśli plik nie został dostarczony', async () => {
    // W przypadku funkcji async używamy rejects.toThrow
    await expect(controller.uploadFile(null as any)).rejects.toThrow(
      BadRequestException,
    );
  });
});