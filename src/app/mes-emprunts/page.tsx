'use client';

import { useEffect, useState } from 'react';
import { getBorrowingByUser } from './_actions';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Layout from '@/components/Layout';
import { isCurrentBorrow } from '@/utils/borrow';

const MyBorrows = () => {
  const { data: session } = useSession();
  const [borrows, setBorrows] = useState<BorrowWithBook[]>([]);
  const [currentBorrow, setCurrentBorrow] = useState<BorrowWithBook | null>(
    null,
  );

  useEffect(() => {
    if (!session || !session.user?.email) return;

    getBorrowingByUser(session.user.email).then((data) => {
      if (data.status === 200 && data.borrow) {
        const current = data.borrow?.find((borrow) => isCurrentBorrow(borrow));

        if (current) {
          setCurrentBorrow(current);
        } else {
          setCurrentBorrow(null);
        }

        setBorrows(data.borrow);
      } else {
        toast.error(
          'Une erreur est survenue lors de la récupération des emprunts',
        );
      }
    });
  }, [session]);

  if (!borrows.length) return <p>Vous n'avez aucun emprunt en cours</p>;

  return (
    <Layout>
      <div className="max-w-2xl lg:max-w-7xl mx-auto py-32">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {borrows?.map((borrow) => {
            const book = borrow.book;
            if (!book) return null;

            return (
              <a key={book.id} href={`/livre/${book.id}`} className="group">
                <div className="w-full aspect-[2/3] max-w-[250px] overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={book.image || ''}
                    alt={book.title}
                    className="h-full w-full object-cover object-center aspect-[2/3] group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-lg text-gray-900 truncate">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-700 truncate">
                  {book.author}
                </p>
                <p className="text-sm mt-1 text-gray-700 italic">
                  Emprunté du {new Date(borrow.from!).toLocaleDateString()} au{' '}
                  {new Date(borrow.to!).toLocaleDateString()}
                </p>
                {currentBorrow && currentBorrow.id === borrow.id ? (
                  <p className="text-sm mt-1 text-green-500 italic">
                    Emprunt en cours
                  </p>
                ) : (
                  <p className="text-sm mt-1 text-gray-500 italic">
                    Emprunt terminé
                  </p>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default MyBorrows;
