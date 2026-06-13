import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokefun Wiki Database",
  description: "Explore the Pokefun Wiki! The ultimate database for all Pokémon, including stats, evolutions, items, moves, and our custom Cobblemon features.",
  openGraph: {
    title: "Pokefun Wiki Database",
    description: "Explore the Pokefun Wiki! The ultimate database for all Pokémon, including stats, evolutions, items, moves, and our custom Cobblemon features.",
    images: [
      {
        url: "https://pokefun.in/images/logo.png",
        width: 800,
        height: 600,
        alt: "Pokefun Logo",
      },
    ],
    siteName: "Pokefun SMP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokefun Wiki Database",
    description: "Explore the Pokefun Wiki! The ultimate database for all Pokémon, including stats, evolutions, items, moves, and our custom Cobblemon features.",
    images: ["https://pokefun.in/images/logo.png"],
  },
};

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
