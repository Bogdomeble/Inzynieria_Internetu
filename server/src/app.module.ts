// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PostsModule, CommentsModule, CategoriesModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [PrismaService],
})
export class AppModule {}
