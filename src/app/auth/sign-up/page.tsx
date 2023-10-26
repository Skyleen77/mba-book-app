'use client';

import Link from 'next/link';
import { register } from './_actions';
import { useRouter } from 'next/navigation';
import FormButton from '@/components/FormButton';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <p className="mx-auto w-auto text-center text-4xl font-bold">
            BookApp
          </p>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Inscrivez-vous
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              className="space-y-6"
              action={async (formData: FormData) => {
                setLoading(true);

                try {
                  const data = await register(formData);

                  if (data.status === 200) {
                    router.push('/auth/sign-in?registered=1');
                  } else {
                    toast.error(data.data?.error || 'Une erreur est survenue');
                  }
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
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

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
                <FormButton text="Inscription" loading={loading} />
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Déjà inscrit?{' '}
            <Link
              href="/auth/sign-in"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
