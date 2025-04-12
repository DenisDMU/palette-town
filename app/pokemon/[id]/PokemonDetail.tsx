"use client";
import { useEffect, useState } from "react";
import { fetchPokemon } from "../../helpers/FetchPokemon";
import { Colors } from "../../helpers/Colors";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PokemonDetailClient({ id }: { id: string }) {
	interface PokemonData {
		id: number;
		name: string;
		height: number;
		weight: number;
		types: { type: { name: string } }[];
		abilities: { ability: { name: string } }[];
		stats: { stat: { name: string }; base_stat: number }[];
		sprites: {
			front_default?: string;
			back_default?: string;
			front_shiny?: string;
			back_shiny?: string;
			other: {
				"official-artwork": { front_default?: string };
			};
		};
	}

	const [pokemonData, setPokemonData] = useState<PokemonData | null>(
		null
	);
	const [backgroundColor, setBackgroundColor] =
		useState<string>("#FFFFFF");
	const [textColor, setTextColor] = useState<string>("#000000");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getPokemonData = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await fetchPokemon(id);
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
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(
						"Unable to fetch Pokémon data. Please try again."
					);
				}
			} finally {
				setIsLoading(false);
			}
		};

		getPokemonData();
	}, [id]);

	if (error) {
		return (
			<div className="pt-24 lg:pt-32 flex justify-center items-center w-full">
				<div className="text-red-500 text-center">
					<p>{error}</p>
					<Link
						href="/pokemon"
						className="mt-4 inline-block"
					>
						<Button className="mt-4">
							Return to Pokémon List
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="pt-24 lg:pt-32 flex justify-center items-center w-full">
				<div className="loader border-t-4 border-primary rounded-full w-10 h-10 animate-spin"></div>
			</div>
		);
	}

	return (
		<section
			className="pt-24 lg:pt-32 flex justify-center items-center w-full min-h-screen"
			style={{ backgroundColor: `${backgroundColor}15` }}
		>
			<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
				<Link
					href="/pokemon"
					className="inline-block mb-6"
				>
					<Button
						variant="outline"
						className="gap-2"
					>
						<ArrowLeft size={16} />
						Back to Pokémon List
					</Button>
				</Link>

				<div className="bg-white rounded-xl shadow-xl overflow-hidden">
					{/* Header with background color */}
					<div
						className="w-full py-8 px-6 flex flex-col md:flex-row items-center justify-between relative"
						style={{ backgroundColor }}
					>
						{/* Pokemon number */}
						<div className="absolute top-4 right-6 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
							<span className="font-bold">
								#
								{pokemonData?.id
									.toString()
									.padStart(
										3,
										"0"
									)}
							</span>
						</div>

						{/* Pokemon image */}
						<div className="relative mb-6 md:mb-0">
							<div className="absolute inset-0 flex justify-center items-center opacity-20 scale-150">
								<Image
									src="/assets/pokeball_big.png"
									alt="Pokeball background"
									width={
										200
									}
									height={
										200
									}
									className="object-contain"
								/>
							</div>
							<img
								src={
									pokemonData!
										.sprites
										.other[
										"official-artwork"
									]
										.front_default ||
									pokemonData!
										.sprites
										.front_default
								}
								alt={
									pokemonData?.name ||
									"Unknown Pokémon"
								}
								className="h-64 w-64 object-contain z-10 relative"
							/>
						</div>

						{/* Pokemon name and types */}
						<div className="text-center md:text-left md:pl-6 z-10">
							<h1 className="text-4xl font-bold text-white mb-2 capitalize">
								{
									pokemonData?.name
								}
							</h1>
							<div className="flex flex-wrap gap-2 justify-center md:justify-start">
								{pokemonData?.types.map(
									(
										type
									) => (
										<span
											key={
												type
													.type
													.name
											}
											className="px-3 py-1 rounded-full text-xs font-semibold bg-white/30 backdrop-blur-sm"
										>
											{type.type.name.toUpperCase()}
										</span>
									)
								)}
							</div>
						</div>
					</div>

					{/* Pokemon details */}
					<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Left column: About */}
						<div>
							<h2
								className="text-xl font-bold mb-4"
								style={{
									color: textColor,
								}}
							>
								About
							</h2>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-2">
									<span className="text-gray-600">
										Height
									</span>
									<span>
										{(
											pokemonData!
												.height /
											10
										).toFixed(
											1
										)}{" "}
										m
									</span>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<span className="text-gray-600">
										Weight
									</span>
									<span>
										{(
											pokemonData!
												.weight /
											10
										).toFixed(
											1
										)}{" "}
										kg
									</span>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<span className="text-gray-600">
										Abilities
									</span>
									<span className="capitalize">
										{pokemonData!.abilities
											.map(
												(
													ability
												) =>
													ability.ability.name.replace(
														"-",
														" "
													)
											)
											.join(
												", "
											)}
									</span>
								</div>
							</div>
						</div>

						{/* Right column: Stats */}
						<div>
							<h2
								className="text-xl font-bold mb-4"
								style={{
									color: textColor,
								}}
							>
								Base Stats
							</h2>
							<div className="space-y-3">
								{pokemonData!.stats.map(
									(
										stat
									) => (
										<div
											key={
												stat
													.stat
													.name
											}
											className="space-y-1"
										>
											<div className="flex justify-between">
												<span className="text-sm capitalize">
													{stat.stat.name.replace(
														"-",
														" "
													)}
												</span>
												<span className="text-sm font-semibold">
													{
														stat.base_stat
													}
												</span>
											</div>
											<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-full rounded-full"
													style={{
														width: `${Math.min(
															100,
															(stat.base_stat /
																255) *
																100
														)}%`,
														backgroundColor:
															textColor,
													}}
												></div>
											</div>
										</div>
									)
								)}
							</div>
						</div>

						{/* Sprites gallery */}
						<div className="md:col-span-2 mt-4">
							<h2
								className="text-xl font-bold mb-4"
								style={{
									color: textColor,
								}}
							>
								Sprites
							</h2>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								{pokemonData!
									.sprites
									.front_default && (
									<div className="bg-gray-100 rounded-lg p-2 flex justify-center">
										<img
											src={
												pokemonData!
													.sprites
													.front_default
											}
											alt="Front Default"
											className="h-24"
										/>
									</div>
								)}
								{pokemonData!
									.sprites
									.back_default && (
									<div className="bg-gray-100 rounded-lg p-2 flex justify-center">
										<img
											src={
												pokemonData!
													.sprites
													.back_default
											}
											alt="Back Default"
											className="h-24"
										/>
									</div>
								)}
								{pokemonData!
									.sprites
									.front_shiny && (
									<div className="bg-gray-100 rounded-lg p-2 flex justify-center">
										<img
											src={
												pokemonData!
													.sprites
													.front_shiny
											}
											alt="Front Shiny"
											className="h-24"
										/>
									</div>
								)}
								{pokemonData!
									.sprites
									.back_shiny && (
									<div className="bg-gray-100 rounded-lg p-2 flex justify-center">
										<img
											src={
												pokemonData!
													.sprites
													.back_shiny
											}
											alt="Back Shiny"
											className="h-24"
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
