"use client";
import { Colors } from "../../helpers/Colors";
import { fetchPokemon } from "../../helpers/FetchPokemon";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import pokeball from "@/public/assets/pokeball_big.png";
import Link from "next/link";

interface CardPokemonProps {
	pokemonName: string; // Le nom du Pokémon à afficher
}

export default function CardPokemon({ pokemonName }: CardPokemonProps) {
	interface PokemonData {
		id: number;
		name: string;
		sprites: {
			front_default: string;
		};
		types: { type: { name: string } }[];
	}

	const [pokemonData, setPokemonData] = useState<PokemonData | null>(
		null
	);
	const [backgroundColor, setBackgroundColor] =
		useState<string>("#FFFFFF");
	const [textColor, setTextColor] = useState<string>("#000000");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getPokemonData = async () => {
			try {
				setError(null);
				const data = await fetchPokemon(pokemonName);
				setPokemonData(data);

				// Déterminer la couleur de fond et du texte en fonction du type principal
				const primaryType = data.types[0]?.type
					?.name as keyof typeof Colors.type;
				setBackgroundColor(
					Colors.type[primaryType] || "#FFFFFF"
				);
				setTextColor(
					Colors.type[primaryType] || "#000000"
				);
			} catch {
				setError("Unable to fetch Pokémon data.");
			}
		};

		getPokemonData();
	}, [pokemonName]);

	if (error) {
		return <div className="text-red-500 text-center">{error}</div>;
	}

	if (!pokemonData) {
		return (
			<div className="flex justify-center items-center h-32">
				<div className="loader border-t-4 border-primary rounded-full w-8 h-8 animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="card w-full bg-base-100 shadow-xl rounded-lg overflow-hidden">
			<figure
				className="w-full p-4 flex justify-center items-center relative"
				style={{ backgroundColor }}
			>
				{/* Pokeball background image */}
				<div className="absolute inset-0 flex justify-center items-center opacity-20">
					<Image
						src={pokeball}
						alt="Pokeball background"
						width={90}
						height={90}
						className="object-contain"
					/>
				</div>

				{/* Pokemon sprite (positioned above the pokeball) */}
				<Image
					width={96}
					height={96}
					src={pokemonData.sprites.front_default}
					alt={pokemonData.name}
					className="h-24 w-24 object-contain relative z-10"
				/>
			</figure>
			<div className="card-body text-center p-4">
				<h2
					className="card-title text-lg font-semibold"
					style={{ color: textColor }}
				>
					{pokemonData.name.toUpperCase()}
				</h2>
				<p className="text-sm text-gray-600">
					Type:{" "}
					{pokemonData.types
						.map(
							(type: {
								type: {
									name: string;
								};
							}) => type.type.name
						)
						.join(", ")}
				</p>
				<div className="card-actions justify-center mt-4">
					<Link
						href={`/pokemon/${pokemonData.id}`}
					>
						<Button className="bg-primary btn-sm text-blue-500 uppercase font-semibold hover:bg-secondary hover:text-primary">
							Catch !
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
