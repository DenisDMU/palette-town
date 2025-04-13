"use client";
import { Colors } from "../../helpers/Colors";
import { fetchPokemon } from "../../helpers/FetchPokemon";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import pokeball from "@/public/assets/pokeball_big.png";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

				// Couleur principale (fond)
				setBackgroundColor(
					Colors.type[primaryType] || "#FFFFFF"
				);

				// Couleur du texte
				setTextColor(
					Colors.textColor[primaryType] ||
						"#000000"
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

	// Fonction pour formater le nom du Pokémon
	const formatPokemonName = (name: string): string => {
		return name
			.split("-")
			.map(
				(word) =>
					word.charAt(0).toUpperCase() +
					word.slice(1)
			)
			.join(" ");
	};

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
					className="card-title text-lg font-semibold justify-center"
					style={{ color: textColor }}
				>
					{formatPokemonName(pokemonData.name)}
				</h2>

				{/* Types badges (comme dans PokemonDetail) */}
				<div className="flex flex-wrap justify-center gap-2 mt-2">
					{pokemonData.types.map(
						(typeInfo, index) => {
							const typeName =
								typeInfo.type
									.name as keyof typeof Colors.type;
							return (
								<span
									key={
										index
									}
									className="px-3 py-1 rounded-full text-white text-xs font-medium border border-white/30"
									style={{
										backgroundColor:
											Colors
												.type[
												typeName
											] ||
											"#A8A878",
									}}
								>
									{typeInfo.type.name
										.charAt(
											0
										)
										.toUpperCase() +
										typeInfo.type.name.slice(
											1
										)}
								</span>
							);
						}
					)}
				</div>

				<div className="card-actions justify-center mt-4">
					<Link
						href={`/pokemon/${pokemonData.id}`}
						className="w-full"
					>
						<div
							className="relative w-full overflow-hidden rounded-md group"
							style={{
								backgroundColor,
							}}
						>
							{/* Button avec effet vitre/miroir */}
							<Button
								className="w-full py-2 font-semibold uppercase tracking-wider shadow-sm 
                                border border-white/50 bg-white/20 backdrop-blur-sm transition-all 
                                hover:shadow-lg group-hover:bg-white/30"
								style={{
									color: "#FFFFFF",
									textShadow: "0 1px 2px rgba(0,0,0,0.5)",
								}}
							>
								{/* Pokeball qui tourne en hover */}
								<div className="mr-2 transition-transform duration-300 group-hover:rotate-180">
									<Image
										src={
											pokeball
										}
										alt="Pokeball"
										width={
											20
										}
										height={
											20
										}
										className="object-contain"
									/>
								</div>

								{/* Texte qui se transforme en "Go!" */}
								<span className="flex items-center">
									<span className="block group-hover:hidden">
										Catch{" "}
										{formatPokemonName(
											pokemonData.name
										)}

										!
									</span>
									<span className="hidden group-hover:flex items-center">
										Go!{" "}
										<ArrowRight
											className="ml-1"
											size={
												16
											}
										/>
									</span>
								</span>
							</Button>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
