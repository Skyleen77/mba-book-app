import { isCurrentBorrow } from '@/utils/borrow';
import Link from 'next/link';

const ElementWrapper = ({
  withBook,
  borrow,
  children,
  ...props
}: {
  withBook: boolean;
  borrow: BorrowWithUserAndBook;
  children: React.ReactNode;
}) => {
  if (withBook) {
    return (
      <Link
        className="flex flex-row group"
        href={`/livre/${borrow?.book?.id}`}
        {...props}
      >
        {children}
      </Link>
    );
  }
  return <div {...props}>{children}</div>;
};

const Borrow = ({
  borrow,
  withBook = false,
}: {
  borrow: BorrowWithUserAndBook;
  withBook?: boolean;
}) => {
  return (
    <ElementWrapper withBook={withBook} borrow={borrow}>
      {withBook && (
        <div className="w-full !aspect-[2/3] h-fit overflow-hidden rounded-lg bg-gray-200 max-w-[100px] mr-6">
          <img
            src={borrow?.book?.image || ''}
            alt={borrow?.book?.title}
            className="w-full object-cover object-center !aspect-[2/3] group-hover:opacity-75"
          />
        </div>
      )}

      <div>
        {withBook && (
          <h3 className="text-xl font-semibold text-gray-900 truncate mb-2">
            {borrow?.book?.title}
          </h3>
        )}
        <p>
          Emprunté par :{' '}
          <span className="font-medium">
            {borrow.user?.name || 'Utilisateur supprimé'}
          </span>
        </p>
        <p>
          Date de début :{' '}
          <span className="font-medium">
            {new Date(borrow.from!).toLocaleDateString()}
          </span>
        </p>
        <p>
          Date de fin :{' '}
          <span className="font-medium">
            {new Date(borrow.to!).toLocaleDateString()}
          </span>
        </p>
        {isCurrentBorrow(borrow) ? (
          <p className="italic text-green-500 mt-2">Emprunt en cours</p>
        ) : (
          <p className="italic text-gray-500 mt-2">Emprunt terminé</p>
        )}
      </div>
    </ElementWrapper>
  );
};

export default Borrow;
