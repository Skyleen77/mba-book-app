'use client';

import FormButton from '@/components/FormButton';
import { addBook } from './_actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import useBooks from '@/hooks/useBooks';

const AddBook = () => {
  const router = useRouter();

  const { mutate } = useBooks();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-20">
        <h1 className="text-3xl font-semibold">Ajouter un livre</h1>

        <div className="bg-white py-12">
          <form
            className="space-y-6"
            action={async (formData: FormData) => {
              const data = await addBook(formData);

              if (data.status === 200) {
                toast.success('Livre ajouté !');
                await mutate();
                router.push('/catalogue');
              } else {
                toast.error(data?.error || 'Une erreur est survenue');
              }
            }}
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ISBN
              </label>
              <div className="mt-2">
                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image
              </label>
              <div className="mt-2">
                <input
                  id="image"
                  name="image"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Author
              </label>
              <div className="mt-2">
                <input
                  id="author"
                  name="author"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="!mt-10">
              <FormButton text="Ajouter le livre" />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;
