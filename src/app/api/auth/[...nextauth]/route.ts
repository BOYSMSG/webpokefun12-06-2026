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
                username: credentials.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
                name: "Pokefun Admin",
                role: "OWNER",
                permissions: ['DELETE_POSTS', 'ANNOUNCEMENTS', 'MANAGE_ROLES', 'READ_DMS', 'BAN_USERS']
              });
            }
            return { id: adminUser._id.toString(), username: adminUser.username, name: adminUser.name, email: adminUser.email, role: adminUser.role, permissions: adminUser.permissions };
          } catch (error) {
            console.warn("MongoDB connection failed in Admin Auth, allowing temporary admin session.");
            return { id: "temp-admin-id", username: "admin", name: "Pokefun Admin", email: credentials.email, role: "OWNER", permissions: ['DELETE_POSTS', 'ANNOUNCEMENTS', 'MANAGE_ROLES', 'READ_DMS', 'BAN_USERS'] };
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
            const baseName = (user.name || "trainer").toLowerCase().replace(/[^a-z0-9_]/g, '');
            const randomSuffix = Math.floor(Math.random() * 10000).toString();
            const newUsername = `${baseName}${randomSuffix}`;

            dbUser = await User.create({
              email: user.email,
              username: newUsername,
              name: user.name || "Trainer",
              image: user.image ?? undefined,
              discordId: account?.provider === "discord" ? account?.providerAccountId : undefined,
              role: "USER",
              connections: {
                discord: account?.provider === "discord" ? user.name : undefined,
                google: account?.provider === "google" ? user.email : undefined
              }
            });
          } else if (dbUser) {
            // If user exists, check if we need to link a new connection
            let isUpdated = false;
            if (!dbUser.connections) dbUser.connections = {};
            
            if (account?.provider === "discord" && !dbUser.connections.discord) {
              dbUser.connections.discord = user.name;
              dbUser.discordId = account.providerAccountId;
              isUpdated = true;
            }
            if (account?.provider === "google" && !dbUser.connections.google) {
              dbUser.connections.google = user.email;
              isUpdated = true;
            }

            // Image Priority Logic
            if (account?.provider === "discord" && user.image) {
              // Always prioritize Discord image if logging in with Discord
              dbUser.image = user.image;
              isUpdated = true;
            } else if (account?.provider === "google" && user.image && !dbUser.connections.discord) {
              // Only use Google image if Discord is NOT connected
              dbUser.image = user.image;
              isUpdated = true;
            }

            if (isUpdated) {
              await User.updateOne({ _id: dbUser._id }, { $set: { connections: dbUser.connections, discordId: dbUser.discordId, image: dbUser.image } });
            }
          }
          // Attach role and permissions to user object
          if (dbUser) {
             (user as any).role = dbUser.role;
             (user as any).permissions = dbUser.permissions || [];
             (user as any).username = dbUser.username;
             user.image = dbUser.image || user.image; // Force NextAuth to use the prioritized DB image
          }
        } catch (error) {
          console.warn("MongoDB connection failed in signIn, allowing temporary session for local testing.");
          (user as any).role = "USER";
          (user as any).permissions = [];
          (user as any).username = "temp_user";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.permissions = (user as any).permissions;
        token.username = (user as any).username;
        token.picture = user.image; // Override JWT picture with our prioritized image
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).permissions = token.permissions || [];
        (session.user as any).username = token.username;
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
