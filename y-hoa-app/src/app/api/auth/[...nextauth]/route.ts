import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Mở rộng kiểu User để bao gồm role
interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Mở rộng kiểu JWT để bao gồm role
interface CustomJWT extends JWT {
  id?: string;
  role?: string;
}

// Mở rộng kiểu Session để bao gồm id và role
interface CustomSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập email và mật khẩu");
        }

        const dev = process.env.NODE_ENV !== "production";
        const adminSecret = process.env.ADMIN_SECRET || "";

        // Kết nối DB trước, nếu lỗi mới xem xét bypass dev
        try {
          await dbConnect();
        } catch (err) {
          if (dev && adminSecret && credentials.password === adminSecret) {
            return {
              id: "dev-admin",
              name: "Dev Admin",
              email: credentials.email,
              role: "admin",
            };
          }
          throw new Error(
            "Không thể kết nối cơ sở dữ liệu. Vui lòng whitelist IP Atlas hoặc dùng ADMIN_SECRET ở môi trường dev."
          );
        }

        // DB đã kết nối: kiểm tra người dùng và mật khẩu bình thường
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Email không tồn tại");
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Mật khẩu không chính xác");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 ngày
  },
  cookies: {
    sessionToken: {
      // Dùng tên cookie và cờ secure phù hợp môi trường (dev không HTTPS)
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as CustomUser).id;
        token.role = (user as CustomUser).role;
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      if (token && customSession.user) {
        customSession.user.id = (token as CustomJWT).id;
        customSession.user.role = (token as CustomJWT).role;
      }
      return customSession;
    }
  },
  pages: {
    signIn: "/dang-nhap",
    signOut: "/",
    error: "/dang-nhap",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };