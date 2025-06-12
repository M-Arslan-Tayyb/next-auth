export const runtime = "nodejs";
import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcryptjs";
import User from "@/models/userModel"
import { connectDB } from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new CredentialsSignin("Email and Password are required");
        }

        await connectDB();

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          throw new CredentialsSignin("User not found");
        }

        const isMatch = await compare(password as string, user.password!);
        if (!isMatch) {
          throw new CredentialsSignin("Incorrect password");
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
  signIn: async ({ user, account, profile }) => {
    console.log("🚀 SignIn Callback:", { user, account, profile });

    if (account?.provider === "google") {
      try {
        await connectDB();
        const existingUser = await User.findOne({ email: profile?.email });

        if (!existingUser) {
          await User.create({
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
            googleId: user?.id,
          });
          console.log("✅ New user created:", profile?.email);
        }

        return true; 
      } catch (error) {
        console.error("❌ Google sign-in error:", error);
        return false; 
      }
    }

    return true;
  },
}

});
