'use client'
import { SignupImage } from './SignupImage';
import { SignupForm } from './SignupForm';

export const Signup = () => {
    return (
        <div className="flex flex-grow flex-col justify-center px-6 py-6 md:py-40 lg:pt-16 lg:pb-20 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <SignupImage/>
                <h2 className="text-center pb-2 text-2xl font-bold leading-9 tracking-tight ring-gray-300 xl:text-4xl">
                    Registrar cuenta
                </h2>
            </div>
            
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <SignupForm/>
            </div>
        </div>
    );
}

