import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Reels - Pokefun',
  description: 'Join the Pokefun Minecraft community. Share your Cobblemon adventures, watch short video reels, and connect with other Pokemon trainers!',
  keywords: ["Cobblemon community", "Minecraft server community", "Pokefun reels", "Cobblemon short videos"],
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
