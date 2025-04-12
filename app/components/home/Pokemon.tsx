"use client";
import { useState, useEffect } from "react";
import Tag from "./Tag";
import AdventureCol from "./PokemonCol";

type PokemonSpecies = {
	flavor_text_entries: {
		flavor_text: string;
		language: { name: string };
	}[];
};

type Pokemon = {
	name: string;
	icon: string;
	description: string;
};

export default function Adventures() {
	const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRandomPokemon = async () => {
			setIsLoading(true);
			try {
				// Get 6 random Pokémon from the original 150
				const pokemonIds = Array.from(
					{ length: 6 },
					() =>
						Math.floor(
							Math.random() * 150
						) + 1
				);

				// Fetch basic data for each Pokémon
				const pokemonPromises = pokemonIds.map((id) =>
					fetch(
						`https://pokeapi.co/api/v2/pokemon/${id}`
					).then((res) => res.json())
				);

				const pokemonResults = await Promise.all(
					pokemonPromises
				);

				// Fetch additional species data for descriptions
				const speciesPromises = pokemonResults.map(
					(pokemon) => {
						const id = pokemon.id;
						return fetch(
							`https://pokeapi.co/api/v2/pokemon-species/${id}`
						).then((res) => res.json());
					}
				);

				const speciesResults = await Promise.all(
					speciesPromises
				);

				// Combine the data
				const combinedData = pokemonResults.map(
					(pokemon, index) => {
						// Find an English description
						const species = speciesResults[
							index
						] as PokemonSpecies;
						const englishEntry =
							species.flavor_text_entries.find(
								(entry) =>
									entry
										.language
										.name ===
									"en"
							);

						const description = englishEntry
							? englishEntry.flavor_text.replace(
									/\f/g,
									" "
							  )
							: "This Pokémon's colors create a harmonious palette for your designs.";

						return {
							name:
								pokemon.name
									.charAt(
										0
									)
									.toUpperCase() +
								pokemon.name.slice(
									1
								),
							icon: pokemon.sprites
								.front_default,
							description:
								description,
						};
					}
				);

				setPokemonList(combinedData);
			} catch (error) {
				console.error("Error fetching Pokémon:", error);
				// Fallback data in case the API fails
				setPokemonList([
					{
						name: "Pikachu",
						icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
						description:
							"When several of these Pokémon gather, their electricity can cause lightning storms.",
					},
				]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRandomPokemon();
	}, []);

	return (
		<section className="py-24 overflow-hidden text-blue-300">
			<div className="container mx-auto">
				<div className="grid lg:grid-cols-2 items-center lg:gap-16">
					<div>
						<div className="flex justify-center">
							<Tag>
								Explore Colors
							</Tag>
						</div>
						<h2 className="text-6xl font-medium mt-6 text-center text-blue-300">
							Discover beautiful{" "}
							<span className="text-primary">
								palettes
							</span>
						</h2>
						<p className="text-foreground/85 mt-4 text-lg">
							Palette Town helps you
							create extraordinary
							color schemes inspired
							by the original 150
							Pokémon. Perfect for
							your next design project
							or creative adventure.
						</p>
					</div>
					<div>
						<div
							className="h-[400px] lg:h-[800px] overflow-hidden grid md:grid-cols-2 gap-4 mt-8 lg:mt-0
                [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
						>
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<p className="text-lg text-foreground/50">
										Loading
										Pokémon...
									</p>
								</div>
							) : (
								<>
									<AdventureCol
										adventures={
											pokemonList
										}
									/>
									<AdventureCol
										adventures={pokemonList
											.slice()
											.reverse()}
										reverse
										className="hidden md:flex"
									/>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// Updated AdventureType
export type AdventureType = {
	name: string;
	icon: string;
	description: string;
}[];
