import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { BadRequestException } from '@nestjs/common';

describe('UploadsController', () => {
  let controller: UploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('uploadFile() powinien zwrócić poprawny URL dla wgranego pliku', () => {
    const mockFile = {
      filename: 'test-image-123.jpg',
    } as Express.Multer.File;

    const result = controller.uploadFile(mockFile);

    expect(result).toEqual({
      url: 'http://localhost:3001/uploads/test-image-123.jpg',
    });
  });

  it('uploadFile() powinien rzucić BadRequestException, jeśli plik nie został dostarczony', () => {
    expect(() => controller.uploadFile(null as any)).toThrow(
      BadRequestException,
    );
  });
});
