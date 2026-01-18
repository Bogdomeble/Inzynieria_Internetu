import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('remove() powinien przekazać dane zalogowanego użytkownika do serwisu', async () => {
    const commentId = 'c1';
    const mockRequest = {
      user: { userId: 'user-1', role: 'USER' },
    };

    await controller.remove(commentId, mockRequest);

    expect(service.remove).toHaveBeenCalledWith(
      commentId,
      mockRequest.user.userId,
      mockRequest.user.role,
    );
  });

  it('create() powinien wywołać serwis z danymi z body', async () => {
    const dto = { content: 'test', postId: 'p1', userId: 'u1' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
