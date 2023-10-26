import useBooks from '@/hooks/useBooks';
import classNames from 'classnames';

const Catalogue = () => {
  const { data: books } = useBooks();

  return (
    <section
      aria-labelledby="products-heading"
      className="mx-auto max-w-2xl px-4 py-32 lg:max-w-7xl"
    >
      <h2 id="products-heading" className="sr-only">
        Livres
      </h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
        {books?.map((book) => (
          <a key={book.id} href={`/livre/${book.id}`} className="group">
            <div className="w-full aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
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
            <p
              className={classNames(
                'text-xs mt-2',
                book.status === 'AVAILABLE' ? 'text-green-500' : 'text-red-500',
              )}
            >
              {book.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Catalogue;
