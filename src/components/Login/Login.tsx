'use client'

import { LoginForm } from './LoginForm';
import { LoginImage } from './LoginImage';

export const Login= () => {
  return (
    <div className="flex flex-grow flex-col justify-center px-6 py-6 md:py-40 lg:pt-16 lg:pb-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginImage/>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm /> 
        <p className="mt-10 text-center text-sm text-gray-500 xl:text-lg">
          No eres miembro?{' '}
          <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Registrate aquí!
          </a>
        </p>
      </div>
    </div>
  );
};
