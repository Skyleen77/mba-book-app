import type { Borrow } from '@prisma/client';

export const isCurrentBorrow = (borrow: Borrow) => {
  const today = new Date();
  const from = new Date(borrow.from!);
  const to = new Date(borrow.to!);

  return today >= from && today <= to;
};
