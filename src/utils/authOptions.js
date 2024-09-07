
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
          image: userFound.image,
          role: userFound.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: '/signup',
    error: '/not-found',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.image = token.image; 
        session.user.id = token.id;// Añadir la imagen a la sesión
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) { //JWT (JSON Web Token) te permite agregar propiedades adicionales al objeto de sesión
      if (trigger === "update") {
        token.image = session.user.image;
      }
      
      if (user) {
        token.role = user.role;
        token.image = user.image; 
        token.id = user.id;// Añadir la imagen al token
      }
      return token;
    },
  },
};

