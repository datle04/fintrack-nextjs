// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodbClient";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials nhận được:", credentials);
        await dbConnect(); // Kết nối DB qua Mongoose để query User
        
        const user = await User.findOne({ email: credentials?.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Tài khoản không tồn tại!");
        }

        const isMatch = await bcrypt.compare(credentials!.password as string, user.password);

        if (!isMatch) {
          throw new Error("Mật khẩu không chính xác!");
        }

        if (user.isBanned) {
          throw new Error("Tài khoản này đã bị khóa!");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Tái sử dụng role từ hệ thống cũ
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Đường dẫn trang login custom của bạn
  },
  session: { strategy: "jwt" }, // Sử dụng JWT để tương thích với luồng cũ
});