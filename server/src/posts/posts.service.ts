import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { tags, ...postData } = createPostDto;

    return this.prisma.post.create({
      data: {
        ...postData,
        tags: tags?.length
          ? {
              connect: tags,
            }
          : undefined,
      },
      include: {
        tags: true, // Zwracamy tagi
        category: true,
        author: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async findAll(query?: { search?: string; tag?: string }) {
    const { search, tag } = query || {};

    const where: any = {
      published: true,
    };

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
      ];
    }

    // Filtrowanie po tagu
    if (tag) {
      const tagCondition = {
        tags: {
          some: {
            slug: tag,
          },
        },
      };

      if (where.AND) {
        where.AND.push(tagCondition);
      } else {
        where.AND = [tagCondition];
      }
    }

    return this.prisma.post.findMany({
      where,
      include: {
        tags: true,
        category: true,
        author: { select: { id: true, username: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        author: {
          select: { id: true, username: true },
        },
        comments: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }
    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
        category: true,
        author: { select: { id: true, username: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { tags, ...postData } = updatePostDto;

    await this.findOne(id); // Sprawdź czy post istnieje

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(tags
          ? {
              tags: {
                set: tags,
              },
            }
          : {}),
      },
      include: { tags: true, category: true },
    });
  }

async remove(id: string, userId: string, userRole: string) {
    const post = await this.findOne(id); // błąd, jeśli post nie istnieje

    // Właściciel LUB Admin może usuwać posty
    if (post.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    return this.prisma.post.delete({ where: { id } });
  }

  async getComments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
