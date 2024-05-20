import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions} from 'src/utils/authOptions';
import { IoLogOutOutline } from "react-icons/io5";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-4 md:px-24 py-3">
      <h1 className="text-xl font-bold pe-5">NextAuth</h1>
      <ul className="flex gap-x-4 md:gap-x-12">
        {!session?.user ? (
          <>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/dashboard">Bienvenido {session.user?.name}</Link>
            </li>
            <li>
              <Link href="/api/auth/signout" className="flex gap-x-1">
                Salir
                <IoLogOutOutline className="text-2xl text-indigo-600" />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}


