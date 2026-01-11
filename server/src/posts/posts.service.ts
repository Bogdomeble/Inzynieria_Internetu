/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { tags, ...postData } = createPostDto;

    return this.prisma.post.create({
      data: {
        ...postData,
        tags: tags
          ? {
              connect: tags.map((tagId) => ({ id: tagId })),
            }
          : undefined,
      },
      include: {
        tags: true,
        category: true,
        author: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async findAll(query?: { search?: string; tag?: string }) {
    const { search, tag } = query || {};

    const where: any = {
      published: true, // tylko opublikowane na liście (dobra praktyka)
    };

    if (search) {
      where.OR = [
        { title: { contains: search } }, 
        { content: { contains: search } },
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag, // Filtrujemy posty, które mają conajmniej 1 tag o danym slugu
        },
      };
    }

    return this.prisma.post.findMany({
      where, // Przekazujemy dynamiczny warunek
      include: {
        category: true,
        tags: true,
        author: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: { id: true, username: true },
        },
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${slug} not found`);
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

    await this.findOne(id);

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(tags
          ? {
              tags: {
                set: tags.map((tagId) => ({ id: tagId })),
              },
            }
          : {}),
      },
      include: { tags: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.post.delete({ where: { id } });
  }

  async getComments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' }, // Najnowsze na górze
    });
  }
}
