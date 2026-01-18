import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    findAll: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('findAll() powinien przekazać parametry wyszukiwania do serwisu', async () => {
    const query = { search: 'test', tag: 'coding' };
    await controller.findAll(query.search, query.tag);

    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('remove() powinien przekazać ID posta oraz dane usera z requesta', async () => {
    const req = { user: { userId: 'u1', role: 'USER' } };
    await controller.remove('p1', req);

    expect(service.remove).toHaveBeenCalledWith('p1', 'u1', 'USER');
  });

  it('findBySlug() powinien wywołać odpowiednią metodę serwisu', async () => {
    const slug = 'testowy-post';
    await controller.findBySlug(slug);
    expect(service.findBySlug).toHaveBeenCalledWith(slug);
  });
});
