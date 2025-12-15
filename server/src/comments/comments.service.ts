import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        post: { connect: { id: createCommentDto.postId } },
        user: { connect: { id: createCommentDto.userId } },
        // parent: createCommentDto.parentId ? { connect: { id: createCommentDto.parentId } } : undefined
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });
  }

  findAll() {
    return this.prisma.comment.findMany({
      include: { user: { select: { username: true } } },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: true, post: true },
    });
    if (!comment) throw new NotFoundException(`Comment ${id} not found`);
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id);
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.comment.delete({ where: { id } });
  }
}
