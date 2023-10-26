'use server';

import prisma from '@/lib/prisma';

export const getBorrowingByUser = async (userEmail: string) => {
  if (!userEmail) {
    return {
      status: 422,
      error: 'Champs manquants',
    };
  }

  const borrow = await prisma.borrow.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    include: {
      book: true,
    },
  });

  if (!borrow) {
    return {
      status: 422,
      error: 'Une erreur est survenue',
    };
  }

  return {
    status: 200,
    borrow,
  };
};
