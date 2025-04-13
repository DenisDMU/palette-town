"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import CardPokemon from "../components/pokemon/CardPokemon";
import SearchPokemon from "../components/pokemon/SearchPokemon";
import Image from "next/image";

export default function Pokemon() {
	type Pokemon = {
		name: string;
		number: number;
	};

	const searchParams = useSearchParams();
	const initialSearch = searchParams?.get("search") || "";

	const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // Liste complète des Pokémon
	const [filteredPokemonList, setFilteredPokemonList] = useState<
		Pokemon[]
	>([]); // Liste filtrée
	const [error, setError] = useState<string | null>(null);
	const [offset, setOffset] = useState(0); // Offset pour la pagination
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true); // État pour le chargement initial
	const [isSearchMode, setIsSearchMode] = useState(!!initialSearch); // Mode recherche actif si paramètre de recherche
	const [searchQuery, setSearchQuery] = useState(initialSearch); // État pour suivre la requête de recherche
	const observerRef = useRef<HTMLDivElement | null>(null);

	const fetchPokemonList = async (offset: number) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await fetch(
				`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch Pokémon list");
			}
			const data = await response.json();
			const results = data.results.map(
				(pokemon: { name: string }, index: number) => ({
					name: pokemon.name,
					number: offset + index + 1, // Calculer le numéro du Pokémon
				})
			);

			// Éviter les doublons en vérifiant si le Pokémon existe déjà
			setPokemonList((prevList) => {
				const existingNames = new Set(
					prevList.map((p) => p.name)
				);
				const newPokemon = results.filter(
					(p: Pokemon) =>
						!existingNames.has(p.name)
				);
				return [...prevList, ...newPokemon];
			});

			// Mettre à jour la liste filtrée seulement si on n'est pas en mode recherche
			if (!isSearchMode) {
				setFilteredPokemonList((prevList) => {
					const existingNames = new Set(
						prevList.map((p) => p.name)
					);
					const newPokemon = results.filter(
						(p: Pokemon) =>
							!existingNames.has(
								p.name
							)
					);
					return [...prevList, ...newPokemon];
				});
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError(
					"Unable to fetch Pokémon list. Please try again."
				);
			}
		} finally {
			setIsLoading(false);
			setIsInitialLoading(false);
		}
	};

	useEffect(() => {
		// Ne charger les données que si nous ne sommes pas en mode recherche
		if (!isSearchMode) {
			fetchPokemonList(offset);
		}
	}, [offset, isSearchMode]);

	// Exécuter la recherche initiale si on a un paramètre dans l'URL
	useEffect(() => {
		if (initialSearch) {
			handleSearch(initialSearch);
		}
	}, [initialSearch]);

	// Intersection Observer pour le chargement infini
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Ne charger plus que si on n'est pas en mode recherche et pas déjà en train de charger
				if (
					entries[0].isIntersecting &&
					!isLoading &&
					!isSearchMode &&
					offset < 151 // Limite aux 151 premiers Pokémon
				) {
					setOffset(
						(prevOffset) => prevOffset + 20
					);
				}
			},
			{ threshold: 0.5 }
		);

		const currentRef = observerRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [isLoading, isSearchMode, offset]);

	// Fonction pour rechercher un Pokémon par nom ou numéro
	const handleSearch = async (query: string) => {
		setSearchQuery(query); // Mettre à jour l'état de la requête de recherche

		if (!query) {
			// Si la recherche est vide, réinitialiser la liste filtrée et désactiver le mode recherche
			setFilteredPokemonList(pokemonList);
			setIsSearchMode(false);
			return;
		}

		// Activer le mode recherche pour suspendre le chargement infini
		setIsSearchMode(true);
		setIsLoading(true);

		// Si nous n'avons pas encore chargé tous les Pokémon (151), les charger maintenant
		if (pokemonList.length < 151) {
			try {
				// Charger tous les 151 premiers Pokémon d'un coup
				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon?limit=151`
				);
				if (!response.ok) {
					throw new Error(
						"Failed to fetch complete Pokémon list"
					);
				}
				const data = await response.json();
				const results = data.results.map(
					(
						pokemon: { name: string },
						index: number
					) => ({
						name: pokemon.name,
						number: index + 1, // Numéro du Pokémon
					})
				);

				// Mettre à jour la liste complète
				setPokemonList(results);

				// Convertir la requête en minuscules pour une recherche insensible à la casse
				const lowerCaseQuery = query.toLowerCase();

				// Vérifier si la requête est un nombre
				const isNumber = !isNaN(Number(query));

				if (isNumber) {
					// Si c'est un nombre, filtrer uniquement par numéro exact
					const filtered = results.filter(
						(pokemon: Pokemon) =>
							pokemon.number ===
							Number(query)
					);
					// Remplacer la liste filtrée au lieu de l'ajouter
					setFilteredPokemonList(filtered);
				} else {
					// Si c'est du texte, filtrer par nom (recherche partielle)
					const filtered = results.filter(
						(pokemon: { name: string }) =>
							pokemon.name
								.toLowerCase()
								.includes(
									lowerCaseQuery
								)
					);
					// Remplacer la liste filtrée au lieu de l'ajouter
					setFilteredPokemonList(filtered);
				}
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError(
						"Unable to fetch Pokémon list. Please try again."
					);
				}
			} finally {
				setIsLoading(false);
			}
		} else {
			// Si nous avons déjà chargé tous les Pokémon, filtrer simplement
			const lowerCaseQuery = query.toLowerCase();
			const isNumber = !isNaN(Number(query));

			if (isNumber) {
				const filtered = pokemonList.filter(
					(pokemon) =>
						pokemon.number === Number(query)
				);
				setFilteredPokemonList(filtered);
			} else {
				const filtered = pokemonList.filter((pokemon) =>
					pokemon.name
						.toLowerCase()
						.includes(lowerCaseQuery)
				);
				setFilteredPokemonList(filtered);
			}
			setIsLoading(false);
		}
	};

	if (error) {
		return <div className="text-red-500 text-center">{error}</div>;
	}

	return (
		<section className="pt-24 lg:pt-32 flex justify-center items-center w-full">
			<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
				<div className="flex justify-center mt-0 w-full">
					<SearchPokemon
						onSearch={handleSearch}
						initialValue={searchQuery}
					/>
				</div>

				{/* État de chargement initial ou recherche en cours */}
				{(isInitialLoading ||
					(isLoading &&
						filteredPokemonList.length ===
							0)) && (
					<div className="text-center py-16 flex flex-col items-center justify-center">
						<div className="relative w-16 h-16 mb-4 animate-spin">
							<Image
								src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
								alt="Loading..."
								width={64}
								height={64}
								className="object-contain"
							/>
						</div>
						<p className="text-gray-500 text-lg">
							Still loading...
						</p>
					</div>
				)}

				{/* Grille de cartes Pokémon */}
				{!isInitialLoading &&
					filteredPokemonList.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
							{filteredPokemonList.map(
								(
									pokemon,
									index
								) => (
									<CardPokemon
										key={`${pokemon.name}-${index}`}
										pokemonName={
											pokemon.name
										}
									/>
								)
							)}
						</div>
					)}

				{/* Message quand aucun résultat n'est trouvé (mais que le chargement est terminé) */}
				{filteredPokemonList.length === 0 &&
					!isLoading &&
					!isInitialLoading && (
						<div className="text-center py-10 text-gray-500">
							No Pokémon found
							matching your search.
						</div>
					)}

				{/* Loader pour le chargement infini (uniquement affiché pendant le défilement) */}
				{isLoading &&
					!isInitialLoading &&
					filteredPokemonList.length > 0 && (
						<div className="flex justify-center items-center mt-8">
							<div className="relative w-12 h-12 animate-spin">
								<Image
									src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
									alt="Loading more..."
									width={
										48
									}
									height={
										48
									}
									className="object-contain"
								/>
							</div>
						</div>
					)}

				{/* Référence pour l'IntersectionObserver, masqué en mode recherche */}
				{!isSearchMode && (
					<div
						ref={observerRef}
						className="h-10"
					></div>
				)}
			</div>
		</section>
	);
}
