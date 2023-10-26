import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

const useBorrows = () => {
  const { data, error, isLoading, mutate } = useSWR<BorrowWithUserAndBook[]>(
    '/api/borrows',
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

export default useBorrows;
