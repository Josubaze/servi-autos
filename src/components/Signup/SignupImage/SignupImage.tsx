import Image from 'next/image';

export const SignupImage = () => {
    return (
        <div className="flex flex-shrink-0 items-center">
            <Image
            src="/svg/gear-icon.svg"
            alt="Tools"
            width={400} 
            height={400} 
            className="mx-auto h-22 md:h-44 w-auto"
            />
        </div>
    );
}

