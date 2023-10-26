import type { Book, Borrow, User } from '@prisma/client';

declare global {
  type BorrowWithUser = Borrow & {
    user: User | null;
  };

  type BorrowWithBook = Borrow & {
    book: Book | null;
  };

  type BorrowWithUserAndBook = Borrow & {
    user: User | null;
    book: Book | null;
  };
}
