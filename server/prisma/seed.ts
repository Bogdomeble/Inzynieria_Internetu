const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const USERS_TO_CREATE = 5;
const POSTS_TO_CREATE = 15;

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + '-' + Math.floor(Math.random() * 10000);
}

async function main() {
  console.log('Starting seeding...');

 
  try {
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database cleaned');
  } catch (error) {
    console.warn('Warning during cleanup:', error.message);
  }

 
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const demoUser = await prisma.user.create({
    data: {
      username: 'DemoUser',
      email: 'demo@example.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Created demo user (ADMIN)');

 
 
  const users: any[] = [demoUser];
  
  for (let i = 0; i < USERS_TO_CREATE; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username({ firstName, lastName }),
        email: faker.internet.email({ firstName, lastName }),
        password: passwordHash,
        role: 'USER',
      },
    });
    users.push(user);
  }
  console.log(`Created ${users.length - 1} random users`);

 
  const categoriesData = [
    { name: 'Technology', slug: 'tech' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Food', slug: 'food' },
    { name: 'Coding', slug: 'coding' },
    { name: 'Business', slug: 'business' },
  ];

 
  const categories: any[] = [];
  
  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: cat,
    });
    categories.push(category);
  }
  console.log('Created categories');

 
  const tagsData = ['React', 'NestJS', 'TypeScript', 'Prisma', 'Health', 'Holiday', 'Work', 'Fun', 'Tips'];
  
 
  const tags: any[] = [];
  
  for (const tagName of tagsData) {
    const tag = await prisma.tag.create({
      data: { name: tagName, slug: tagName.toLowerCase() },
    });
    tags.push(tag);
  }
  console.log('Created tags');

 
  console.log(`Generating ${POSTS_TO_CREATE} posts...`);
  
  for (let i = 0; i < POSTS_TO_CREATE; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
   
    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, Math.floor(Math.random() * 3) + 1);

    const title = faker.lorem.sentence({ min: 3, max: 8 });
    const content = faker.lorem.paragraphs(5, '\n\n');

    const featuredImage = `https://picsum.photos/seed/${Math.random()}/800/400`;

    const post = await prisma.post.create({
      data: {
        title: title.replace('.', ''),
        slug: createSlug(title),
        content: content,
        excerpt: faker.lorem.sentences(2),
        published: true,
        featuredImage: featuredImage,
        authorId: randomUser.id,
        categoryId: randomCategory.id,
        tags: {
         
          connect: selectedTags.map((t) => ({ id: t.id })),
        },
        createdAt: faker.date.past(),
      },
    });

   
    const commentsCount = Math.floor(Math.random() * 6);
    for (let j = 0; j < commentsCount; j++) {
      const commentAuthor = users[Math.floor(Math.random() * users.length)];
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentences(Math.floor(Math.random() * 2) + 1),
          postId: post.id,
          userId: commentAuthor.id,
          createdAt: faker.date.recent(),
        },
      });
    }
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });