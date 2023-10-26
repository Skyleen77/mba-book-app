'use server';

import prisma from '@/lib/prisma';
import type { BookStatusEnum } from '@prisma/client';

export const toggleBookStatus = async (
  bookId: number,
  status: BookStatusEnum,
) => {
  if (!bookId || !status) {
    return {
      status: 422,
      error: 'Champs manquants',
    };
  }

  const book = await prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      status,
    },
  });

  if (!book) {
    return {
      status: 422,
      error: 'Une erreur est survenue',
    };
  }

  return {
    status: 200,
    message: 'Statut du livre modifié avec succès',
  };
};

export const setBorrowing = async (
  bookId: number,
  userId: string,
  formData: FormData,
) => {
  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

  if (!userId || !startDate || !endDate) {
    return {
      status: 422,
      error: 'Champs manquants',
    };
  }

  // Verifier si un emprunt est déjà en cours pendant ses dates là
  const existingBorrow = await prisma.borrow.findFirst({
    where: {
      bookId,
      from: {
        lte: endDate,
      },
      to: {
        gte: startDate,
      },
    },
  });

  if (existingBorrow) {
    return {
      status: 422,
      error: 'Un emprunt est déjà en cours',
    };
  }

  // Créer l'emprunt
  const borrow = await prisma.borrow.create({
    data: {
      bookId,
      userId,
      from: startDate,
      to: endDate,
    },
  });

  if (!borrow) {
    return {
      status: 422,
      error: 'Une erreur est survenue',
    };
  }

  const toggleStatus = await toggleBookStatus(bookId, 'UNAVAILABLE');

  if (toggleStatus.status !== 200) {
    return {
      status: 422,
      error: 'Une erreur est survenue',
    };
  }

  return {
    status: 200,
    message: 'Emprunt ajouté avec succès',
  };
};

export const getBorrowingBy = async (bookId: number) => {
  if (!bookId) {
    return {
      status: 422,
      error: 'Champs manquants',
    };
  }

  const borrow = await prisma.borrow.findMany({
    where: {
      bookId,
    },
    include: {
      user: true,
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
