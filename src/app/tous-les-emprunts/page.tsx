'use client';

import Borrow from '@/components/Borrow';
import Layout from '@/components/Layout';
import useBorrows from '@/hooks/useBorrows';

const AllBorrows = () => {
  const { data: borrows } = useBorrows();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-3xl font-semibold pb-4">Liste des emprunts :</h1>
        {borrows?.length === 0 ? (
          <p className="mt-2">Aucun emprunt</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {borrows?.map((borrow) => (
              <li key={borrow.id} className="py-4">
                <Borrow borrow={borrow} withBook />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default AllBorrows;
