export const fetchPokemon = async (pokemonName: string) => {
	try {
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch Pokémon data: ${response.statusText}`
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching Pokémon data:", error);
		throw new Error(
			"Unable to fetch Pokémon data. Please try again."
		);
	}
};
