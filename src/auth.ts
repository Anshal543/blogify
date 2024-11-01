import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthError,User } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // callbacks: {
  //   async signIn({ user, account,profile }):Promise<any> {
  //     if (account?.provider === "google") {
  //       console.log(user)
  //       try {
  //         const { name, email, id, image } = user;
  //         if (!email) {
  //           throw new AuthError("email is required");
  //         }
  //         const checkUser = await prisma.user.findUnique({
  //           where: {
  //             email,
  //           },
  //         });
  //         if (!checkUser) {
  //           const user = await prisma.user.create({
  //             data: {
  //               email,
  //               name,
  //               image,
  //               googleId: id,
  //             },
              
  //           });
  //           return user;
  //         }
  //         return true;
  //       } catch (error) {
  //         throw new AuthError("Failed to create User");
  //       }
  //     }
  //     return false;
  //   },
  //   // async session({ session, token }) {
  //   //   if (token?.sub) {
  //   //     const dbUser = await prisma.user.findUnique({
  //   //       where: { email: session.user?.email },
  //   //     });

  //   //     if (dbUser) {
  //   //       session.user.id = dbUser.id; // Add userId to session object
  //   //     }
  //   //   }
  //   //   return session;
  //   // },
  //   // async jwt({ token, account, profile }) {
  //   //   // On sign in, persist the user's id in the JWT token
  //   //   if (account) {
  //   //     const dbUser = await prisma.user.findUnique({
  //   //       where: { email: profile?.email ?? undefined },
  //   //     });

  //   //     if (dbUser) {
  //   //       token.sub = dbUser.id; // Use dbUser ID in the token
  //   //     }
  //   //   }
  //   //   return token;
  //   // },
  // },
});
