'use client';

import FormButton from '@/components/FormButton';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function SignIn() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const registered = searchParams.get('registered');

    if (registered) {
      toast.success('Inscription réussie !');
    }
  }, [searchParams]);

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <p className="mx-auto w-auto text-center text-4xl font-bold">
            BookApp
          </p>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              className="space-y-6"
              action={async (formData: FormData) => {
                const email = formData.get('email');
                const password = formData.get('password');
                setLoading(true);

                try {
                  await signIn('credentials', {
                    email,
                    password,
                    callbackUrl: '/',
                  });
                } catch (error) {
                  console.log(error);
                  toast.error('Une erreur est survenue');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mot de passe
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="!mt-10">
                <FormButton text="Connexion" loading={loading} />
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Pas encore de compte?{' '}
            <Link
              href="/auth/sign-up"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
