
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from 'src/utils/mongoose';
import User from 'src/schemas/users.schema';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        await connectDB();
        const userFound = await User.findOne({ email: credentials.email });
        if (!userFound) {
          throw new Error('Usuario no encontrado');
        }
        const matchPassword = await bcrypt.compare(credentials.password, userFound.password);
        if (!matchPassword) {
          throw new Error('Contraseña incorrecta!');
        }
        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: '/not-found',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

