import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const mockTagsService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'JS' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'JS' }),
    create: jest.fn().mockResolvedValue({ id: '1', name: 'New' }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('findAll() powinien zwrócić listę wszystkich tagów', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('create() powinien wywołać serwis z danymi taga', async () => {
    const dto = { name: 'Docker', slug: 'docker' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('update() powinien przekazać zarówno ID jak i dane do aktualizacji', async () => {
    const id = 'tag-id';
    const dto = { name: 'Updated Name' };
    await controller.update(id, dto);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });
});
