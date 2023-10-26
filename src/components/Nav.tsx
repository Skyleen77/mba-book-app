'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Catalogue', href: '/catalogue' },
];

const userNavigation = [{ name: 'Mes emprunts', href: '/mes-emprunts' }];

const adminNavigation = [
  { name: 'Ajouter un livre', href: '/ajouter-un-livre' },
  { name: 'Tous les emprunts', href: '/tous-les-emprunts' },
];

export const Nav = () => {
  const { data: session, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="h-8 w-auto font-bold">BookApp</span>
          </Link>

          <div className="ml-20 hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 pt-[0.1rem]"
              >
                {item.name}
              </Link>
            ))}
            {status === 'authenticated' &&
              userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900 pt-[0.1rem]"
                >
                  {item.name}
                </Link>
              ))}
            {
              // @ts-ignore
              session?.user?.role === 'ADMIN' &&
                adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-gray-900 pt-[0.1rem]"
                  >
                    {item.name}
                  </Link>
                ))
            }
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:justify-end gap-x-4">
          <Link
            href={
              status === 'authenticated' ? '/mes-emprunts' : '/auth/sign-in'
            }
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            {status === 'authenticated'
              ? session?.user?.name
              : status === 'loading'
              ? ''
              : 'Log in'}
          </Link>

          {status === 'authenticated' && (
            <button
              role="link"
              onClick={() => {
                signOut({ callbackUrl: '/' });
              }}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log out
            </button>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="h-8 w-auto font-bold">BookApp</span>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
                {status === 'authenticated' &&
                  userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                {
                  // @ts-ignore
                  session?.user?.role === 'ADMIN' &&
                    adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))
                }
              </div>
              <div className="py-6">
                <Link
                  href={
                    status === 'authenticated'
                      ? '/mes-emprunts'
                      : '/auth/sign-in'
                  }
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {status === 'authenticated'
                    ? session?.user?.name
                    : status === 'loading'
                    ? ''
                    : 'Log in'}
                </Link>

                {status === 'authenticated' && (
                  <button
                    role="link"
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};
