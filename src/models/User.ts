import prisma from '../prisma';

export async function findOrCreateUser(id: number) {
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: { id },
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany();
}
