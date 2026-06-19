import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vote - Pokefun | Minecraft Top Servers',
  description: 'Vote for the Pokefun Cobblemon server to earn epic in-game rewards like rare candies, keys, and Pokemon!',
  keywords: ["vote cobblemon server", "minecraft server list", "pokefun vote", "minecraft cobblemon multiplayer"],
};

export default function VoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
