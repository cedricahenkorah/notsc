import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });

  // Create a post
  const post = await prisma.post.create({
    data: {
      title: 'Hello World',
      content: 'This is my first post!',
      published: true,
      authorId: user.id,
    },
  });

  console.log('Seeding finished.');
  console.log({ user, post });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
