import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Tech' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Tech' }),
    create: jest.fn().mockResolvedValue({ id: '1', name: 'New' }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('findAll() powinien zwrócić tablicę kategorii', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne() powinien przekazać poprawne ID do serwisu', async () => {
    const id = 'some-uuid';
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('create() powinien przekazać dane DTO do serwisu', async () => {
    const dto = { name: 'Life', slug: 'life' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('remove() powinien wywołać usunięcie w serwisie', async () => {
    const id = 'delete-me';
    await controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
