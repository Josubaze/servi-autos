import Image from 'next/image';

export const LoginImage = () => {
    return (
        <div className="flex flex-shrink-0 items-center">
            <Image
            src="/svg/logo.svg"
            alt="Your Company"
            width={500}
            height={500}
            className="mx-auto"
            />
        </div>
    );
}

