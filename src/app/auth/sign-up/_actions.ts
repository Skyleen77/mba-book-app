'use server';

import bcrypt from 'bcrypt';
import { emailRegex, passwordRegex } from '@/utils/regex';
import prisma from '@/lib/prisma';

export const register = async (formData: FormData) => {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Parametre bien valide
  if (!email || !password || !name) {
    return {
      status: 422,
      data: {
        error: 'Missing fields',
      },
    };
  }

  if (!emailRegex.test(email)) {
    return {
      status: 422,
      data: {
        error: 'Email is not valid',
      },
    };
  }

  if (!passwordRegex.test(password)) {
    return {
      status: 422,
      data: {
        error: 'Password is not valid',
      },
    };
  }

  // Est-ce que l'utilisateur existe déjà ?
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Si oui, on renvoie une erreur
  if (existingUser) {
    return {
      status: 422,
      data: {
        error: `L'email ${email} est déjà utilisé`,
      },
    };
  }

  // Si non, on crée l'utilisateur
  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 12);

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Si l'utilisateur n'a pas été créé, on renvoie une erreur
  if (!user) {
    return {
      status: 500,
    };
  }

  // Si l'utilisateur a été créé, on renvoie le status 200
  return {
    status: 200,
  };
};
