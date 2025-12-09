import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // user for testing only!!!
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

    //category
    const category = await prisma.category.upsert({
        where: { slug: 'tech' },
        update: {},
        create: { name: 'Technology', slug: 'tech' },
    });

    // post
    await prisma.post.upsert({
        where: { slug: 'first-db-post' },
        update: {},
        create: {
            title: 'First Database Post',
            slug: 'first-db-post',
            content: 'This data is coming from SQLite!',
            authorId: user.id,
            categoryId: category.id,
            published: true,
            featuredImage: 'https://picsum.photos/800/400',
        },
    });
    console.log('Seeded!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());