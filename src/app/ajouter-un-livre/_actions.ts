'use server';

import prisma from '@/lib/prisma';

export const addBook = async (formData: FormData) => {
  const title = formData.get('title') as string;
  const isbn = formData.get('isbn') as string;
  const author = formData.get('author') as string;
  const image = formData.get('image') as string;

  if (!title || !isbn || !author) {
    return {
      status: 422,
      error: 'Champs manquants',
    };
  }

  const book = await prisma.book.create({
    data: {
      title,
      isbn,
      author,
      status: 'AVAILABLE',
      image,
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
    message: 'Livres ajouté avec succès',
  };
};
