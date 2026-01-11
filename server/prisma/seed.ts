// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'DemoUser',
      email: 'demo@example.com',
      password: hashedPassword,
      role: 'AUTHOR',
    },
  });

  // Create Categories
  const catTech = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: 'Technology', slug: 'tech' },
  });

  const catLife = await prisma.category.upsert({
    where: { slug: 'lifestyle' },
    update: {},
    create: { name: 'Lifestyle', slug: 'lifestyle' },
  });

  //  Create Tags
  const tagReact = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: { name: 'React', slug: 'react' },
  });

  const tagNest = await prisma.tag.upsert({
    where: { slug: 'nestjs' },
    update: {},
    create: { name: 'NestJS', slug: 'nestjs' },
  });

  const tagCoding = await prisma.tag.upsert({
    where: { slug: 'coding' },
    update: {},
    create: { name: 'Coding', slug: 'coding' },
  });

  //  Create Posts with relations
  await prisma.post.upsert({
    where: { slug: 'first-db-post' },
    update: {},
    create: {
      title: 'Fullstack with NestJS and React',
      slug: 'first-db-post',
      content: 'This post covers how to connect Prisma with React Query...',
      excerpt: 'Learn the best stack for 2025',
      published: true,
      authorId: user.id,
      categoryId: catTech.id,
      featuredImage: 'https://picsum.photos/800/400',
      // Łączymy tagi
      tags: {
        connect: [{ id: tagReact.id }, { id: tagNest.id }, { id: tagCoding.id }],
      },
    },
  });

  await prisma.post.upsert({
    where: { slug: 'second-post' },
    update: {},
    create: {
      title: 'Only React Guide',
      slug: 'second-post',
      content: 'Just frontend things...',
      published: true,
      authorId: user.id,
      categoryId: catTech.id,
      tags: {
        connect: [{ id: tagReact.id }],
      },
    },
  });

  console.log('Seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());