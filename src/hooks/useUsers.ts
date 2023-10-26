import { fetcher } from '@/lib/fetcher';
import { User } from '@prisma/client';
import useSWR from 'swr';

const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    '/api/users',
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

export default useUsers;
