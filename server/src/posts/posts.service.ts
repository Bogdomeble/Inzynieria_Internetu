// server/src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  // Mock database
  private posts = [
    {
      id: '1',
      title: 'NestJS is Awesome',
      slug: 'nestjs-is-awesome',
      content: 'Content here...',
      excerpt: 'Learn about NestJS',
      published: true,
      authorId: 'author1',
      categoryId: 'cat1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featuredImage: 'https://picsum.photos/800/400',
    },
  ];

  findAll() {
    return this.posts;
  }

  findOne(id: string) {
    return this.posts.find((post) => post.id === id);
  }

  findBySlug(slug: string) {
    return this.posts.find((post) => post.slug === slug);
  }

  create(createPostDto: CreatePostDto) {
    const newPost = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      authorId: 'temp-author',
      categoryId: 'temp-cat',
      ...createPostDto,
    };
    // @ts-ignore - simplistic mock type handling
    this.posts.push(newPost);
    return newPost;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
