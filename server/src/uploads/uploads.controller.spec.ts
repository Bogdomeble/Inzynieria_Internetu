import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { BadRequestException } from '@nestjs/common';

jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(true),
  }));
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
      filename: 'test-image-123.jpg',
      buffer: Buffer.from('fake-image-data'),
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const result = await controller.uploadFile(mockFile);
    expect(result).toHaveProperty('url');
    expect(result.url).toContain('/uploads/image-');
  });

  it('uploadFile() powinien rzucić BadRequestException, jeśli plik nie został dostarczony', async () => {
    await expect(controller.uploadFile(null as any)).rejects.toThrow(
      BadRequestException,
    );
  });
});
