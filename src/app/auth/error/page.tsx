'use client';

import { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ErrorMessages {
  [key: string]: string;
}

const errorMessages: ErrorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access has been denied.',
  Verification: 'The verification token has expired or has already been used.',
  OAuthSignin: 'Error building OAuth authorization URL.',
  OAuthCallback: 'Error processing OAuth response.',
  OAuthCreateAccount: 'Unable to create OAuth account.',
  EmailCreateAccount: 'Unable to create account with this email address.',
  Callback: 'Error in handling OAuth callback route.',
  OAuthAccountNotLinked:
    'The email address is already linked to another account.',
  EmailSignin: 'Failed to send the email with the verification token.',
  CredentialsSignin: 'Authentication error with the provided credentials.',
  SessionRequired: 'This page requires you to be logged in.',
  IncorrectPassword: 'Incorrect password.',
  EmailNotExist: 'Email does not exist',
  Required: 'Email and password are required',
  NoPasswordSet:
    'User does not have a password. Try signing in with a provider or resetting your password with the "Forgot your password?" link.',
};

const ErrorPage: NextPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const error = searchParams.get('error');

  useEffect(() => {
    const errorMessage = errorMessages[error as string] || 'An error occurred.';
    toast.error(errorMessage);

    router.push('/auth/sign-in');
  }, [error]);

  return null;
};

export default ErrorPage;
