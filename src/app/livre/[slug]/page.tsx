'use client';

import Layout from '@/components/Layout';
import useBooks from '@/hooks/useBooks';
import { Book, BookStatusEnum, User } from '@prisma/client';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getBorrowingBy, setBorrowing, toggleBookStatus } from './_actions';
import { toast } from 'react-toastify';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import useUsers from '@/hooks/useUsers';
import FormButton from '@/components/FormButton';
import Borrow from '@/components/Borrow';
import { useSession } from 'next-auth/react';
import { isCurrentBorrow } from '@/utils/borrow';

const LivrePage = () => {
  const param = useParams();

  const { data: books, mutate } = useBooks();
  const { data: users } = useUsers();
  const { data: session } = useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [borrowBy, setBorrowBy] = useState<BorrowWithUser[] | null>(null);
  const [currentBorrow, setCurrentBorrow] = useState<BorrowWithUser | null>(
    null,
  );

  useEffect(() => {
    if (!param.slug || !books) return;

    const currentBook = books?.find(
      (book) => book.id.toString() === param.slug,
    );

    if (!currentBook) {
      notFound();
    }

    setBook(currentBook);
  }, [books, param.slug]);

  useEffect(() => {
    if (book) {
      getBorrowingBy(book?.id!).then((data) => {
        if (data.status !== 200 || !data?.borrow) return;

        const current = data.borrow?.find((borrow) => isCurrentBorrow(borrow));

        if (current) {
          setCurrentBorrow(current);
        } else {
          setCurrentBorrow(null);
        }

        setBorrowBy(data.borrow as any);
      });
    }
  }, [book]);

  if (!books || !users) return null;

  const filteredUser =
    query === ''
      ? users
      : users.filter((user) => {
          return (
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase())
          );
        });

  const changeBookStatus = async (status: BookStatusEnum) => {
    const data = await toggleBookStatus(book?.id!, status);

    if (data.status === 200) {
      await mutate();
      toast.success('Statut du livre modifié !');
    } else {
      toast.error(data?.error || 'Une erreur est survenue');
    }
  };

  if (!book) return null;

  return (
    <Layout>
      <div className="py-32 px-4 max-w-3xl mx-auto">
        <div className="flex flex-row gap-x-8">
          <div className="w-full !aspect-[2/3] h-fit overflow-hidden rounded-lg bg-gray-200 max-w-[250px]">
            <img
              src={book.image || ''}
              alt={book.title}
              className="w-full object-cover object-center !aspect-[2/3] group-hover:opacity-75"
            />
          </div>
          <div className="space-y-2 w-full">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg font-semibold">{book.author}</p>
            <p
              className={
                book.status === 'AVAILABLE' ? 'text-green-500' : 'text-red-500'
              }
            >
              {book.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'}
            </p>

            <p>
              ISBN : <span className="italic text-gray-600">{book.isbn}</span>
            </p>

            {
              // @ts-ignore
              session?.user?.role === 'ADMIN' && (
                <div className="pt-5">
                  {book.status === 'AVAILABLE' ? (
                    <button
                      onClick={() => changeBookStatus('UNAVAILABLE')}
                      className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                      Marquer comme indisponible
                    </button>
                  ) : (
                    <button
                      onClick={() => changeBookStatus('AVAILABLE')}
                      className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                    >
                      Marquer comme disponible
                    </button>
                  )}

                  {book.status === 'AVAILABLE' && (
                    <form
                      action={async (formData: FormData) => {
                        const borrow = await setBorrowing(
                          book?.id!,
                          selectedUser?.id!,
                          formData,
                        );

                        if (borrow.status === 200) {
                          toast.success('Emprunt ajouté !');
                          await mutate();
                        } else {
                          toast.error(
                            borrow?.error || 'Une erreur est survenue',
                          );
                        }
                      }}
                      className="space-y-6"
                    >
                      <Combobox
                        as="div"
                        value={selectedUser}
                        onChange={setSelectedUser}
                      >
                        <Combobox.Label className="mt-5 block text-sm font-medium leading-6 text-gray-900">
                          Emprunté par
                        </Combobox.Label>
                        <div className="relative mt-2">
                          <Combobox.Input
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(user: any) => user?.name}
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          {filteredUser.length > 0 && (
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredUser.map((user) => (
                                <Combobox.Option
                                  key={user.id}
                                  value={user}
                                  className={({ active }) =>
                                    classNames(
                                      'relative cursor-default select-none py-2 pl-3 pr-9',
                                      active
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-900',
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          'block truncate',
                                          selected && 'font-semibold',
                                        )}
                                      >
                                        {user.name}
                                      </span>

                                      {selected && (
                                        <span
                                          className={classNames(
                                            'absolute inset-y-0 right-0 flex items-center pr-4',
                                            active
                                              ? 'text-white'
                                              : 'text-indigo-600',
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>

                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date de début
                        </label>
                        <div className="mt-2">
                          <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date de fin
                        </label>
                        <div className="mt-2">
                          <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <FormButton text="Ajouter l'emprunt" />
                    </form>
                  )}
                </div>
              )
            }
          </div>
        </div>

        {
          // @ts-ignore
          session?.user?.role === 'ADMIN' && (
            <div className="mt-10 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Emprunt en cours :</h2>

                {currentBorrow ? (
                  <div className="mt-3">
                    <Borrow borrow={currentBorrow as BorrowWithUserAndBook} />
                  </div>
                ) : (
                  <p className="mt-2">Aucun emprunt en cours</p>
                )}
              </div>

              <hr />

              <div>
                <h2 className="text-2xl font-semibold">Liste des emprunts :</h2>
                {borrowBy?.length === 0 ? (
                  <p className="mt-2">Aucun emprunt</p>
                ) : (
                  <ul role="list" className="divide-y divide-gray-200">
                    {borrowBy?.map((borrow) => (
                      <li key={borrow.id} className="py-4">
                        <Borrow borrow={borrow as BorrowWithUserAndBook} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        }
      </div>
    </Layout>
  );
};

export default LivrePage;
