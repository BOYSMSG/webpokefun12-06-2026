import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Mock Admin verification
        if (credentials.email === "boysmsg832@gmail.com" && credentials.password === "kalu#$0109msg$pokefun") {
          
          // Optional: Verify 2FA code here if needed in the future
          // For now, any code works, but we mock the security layer
          if (credentials.twoFactorCode !== "123456") {
             // Mock 2FA requirement (we will simulate 2FA logic on frontend)
          }

          try {
            await dbConnect();
            let adminUser = await User.findOne({ email: credentials.email });
            if (!adminUser) {
              adminUser = await User.create({
                email: credentials.email,
                name: "Pokefun Admin",
                role: "ADMIN",
              });
            }
            return { id: adminUser._id.toString(), name: adminUser.name, email: adminUser.email, role: adminUser.role };
          } catch (error) {
            console.warn("MongoDB connection failed in Admin Auth, allowing temporary admin session.");
            return { id: "temp-admin-id", name: "Pokefun Admin", email: credentials.email, role: "ADMIN" };
          }
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" || account?.provider === "google") {
        try {
          await dbConnect();
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser && user.email) {
            dbUser = await User.create({
              email: user.email,
              name: user.name || "Trainer",
              image: user.image ?? undefined,
              discordId: account?.provider === "discord" ? account?.providerAccountId : undefined,
              role: "USER"
            });
          }
          // Attach role to user object
          if (dbUser) {
             (user as any).role = dbUser.role;
          }
        } catch (error) {
          console.warn("MongoDB connection failed in signIn, allowing temporary session for local testing.");
          (user as any).role = "USER";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
