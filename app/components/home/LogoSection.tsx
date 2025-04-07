"use client";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Define the Pokemon type
type Pokemon = {
	id: number;
	name: string;
	sprites: {
		front_default: string;
	};
};

export default function LogoSection() {
	const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRandomPokemon = async () => {
			setIsLoading(true);
			try {
				// Get 16 random Pokémon from the original 150
				const pokemonIds = Array.from(
					{ length: 16 },
					() =>
						Math.floor(
							Math.random() * 150
						) + 1
				);

				// Fetch data for each Pokémon
				const pokemonPromises = pokemonIds.map((id) =>
					fetch(
						`https://pokeapi.co/api/v2/pokemon/${id}`
					).then((res) => res.json())
				);

				const results = await Promise.all(
					pokemonPromises
				);
				setPokemonList(results);
			} catch (error) {
				console.error("Error fetching Pokémon:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRandomPokemon();
	}, []);

	return (
		<section className="py-12 md:py-24 overflow-x-clip">
			<div className="container max-w-5xl mx-auto px-4">
				<h3 className="text-center text-foreground/70 text-xl md:text-2xl mb-8">
					Find your perfect and cute color palette
				</h3>
				<div className="flex overflow-hidden mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
					{isLoading ? (
						<div className="w-full text-center text-foreground/50">
							Loading Pokémon...
						</div>
					) : (
						<motion.div
							animate={{
								x: "-50%",
							}}
							transition={{
								duration: 30,
								ease: "linear",
								repeat: Infinity,
							}}
							className="flex flex-none gap-12 pr-12"
						>
							{Array.from({
								length: 2,
							}).map((_, i) => (
								<Fragment
									key={i}
								>
									{[
										...pokemonList,
										...pokemonList,
									].map(
										(
											pokemon,
											index
										) => (
											<div
												key={`${pokemon.name}-${index}`}
												className="flex-shrink-0"
											>
												<div className="relative w-12 h-12 group">
													<Image
														src={
															pokemon
																.sprites
																.front_default
														}
														alt={
															pokemon.name
														}
														width={
															48
														}
														height={
															48
														}
														className="w-12 h-12 transition-all opacity-80 group-hover:opacity-100 group-hover:scale-110"
													/>
													<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs capitalize text-primary whitespace-nowrap">
														{
															pokemon.name
														}
													</div>
												</div>
											</div>
										)
									)}
								</Fragment>
							))}
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
