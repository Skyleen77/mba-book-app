import { fetcher } from '@/lib/fetcher';
import { Book } from '@prisma/client';
import useSWR from 'swr';

const useBooks = () => {
  const { data, error, isLoading, mutate } = useSWR<Book[]>(
    '/api/books',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useBooks;
