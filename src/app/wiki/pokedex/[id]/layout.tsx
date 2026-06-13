import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const id = params.id;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    
    if (!res.ok) {
      return { title: "Pokémon Not Found | Pokefun Wiki" };
    }
    
    const data = await res.json();
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1).replace('-', ' ');
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

    return {
      title: `${name} | Pokefun Dex`,
      description: `View ${name}'s stats, evolutions, type matchups, and moves on the Pokefun Wiki.`,
      openGraph: {
        title: `${name} | Pokefun Dex`,
        description: `View ${name}'s stats, evolutions, type matchups, and moves on the Pokefun Wiki.`,
        images: [
          {
            url: imageUrl,
            width: 475,
            height: 475,
            alt: name,
          },
        ],
        siteName: "Pokefun SMP",
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Pokefun Dex`,
        description: `View ${name}'s stats, evolutions, type matchups, and moves on the Pokefun Wiki.`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Pokefun Dex",
      description: "View Pokémon details on the Pokefun Wiki.",
    };
  }
}

export default function PokedexDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
