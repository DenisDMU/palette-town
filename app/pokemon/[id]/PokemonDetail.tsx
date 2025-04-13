"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VolumeIcon, ArrowLeft, ArrowRight } from "lucide-react";
import ColorPalette from "../../components/pokemon/ColorPalette";
import { fetchPokemon } from "../../helpers/FetchPokemon";
import { Colors } from "../../helpers/Colors";
import Image from "next/image";
import pokeball from "@/public/assets/pokeball_big.png";
import pokebread from "@/public/assets/pokebread.png";

interface PokemonSpecies {
	flavor_text_entries: {
		flavor_text: string;
		language: {
			name: string;
		};
	}[];
	evolution_chain: {
		url: string;
	};
}

interface EvolvesTo {
	species: {
		name: string;
		url: string;
	};
	evolves_to: EvolvesTo[];
}

interface EvolutionChain {
	chain: {
		species: {
			name: string;
			url: string;
		};
		evolves_to: EvolvesTo[];
	};
}

interface EvolutionDetail {
	id: number;
	name: string;
	sprites: {
		front_default: string;
	};
}

interface PokemonData {
	id: number;
	name: string;
	sprites: {
		front_default: string;
		front_shiny: string | null;
		back_default: string | null;
		back_shiny: string | null;
		other: {
			"official-artwork": {
				front_default: string;
			};
		};
	};
	types: {
		type: {
			name: string;
		};
	}[];
	weight: number;
	height: number;
	stats: {
		base_stat: number;
		stat: {
			name: string;
		};
	}[];
	cries?: {
		latest?: string;
	};
	species?: {
		url: string;
	};
}

export default function PokemonDetailClient({ id }: { id: string }) {
	const router = useRouter();
	const [pokemonData, setPokemonData] = useState<PokemonData | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [showShinySprite, setShowShinySprite] = useState<boolean>(false);
	const [isPlayingCry, setIsPlayingCry] = useState<boolean>(false);
	const [backgroundColor, setBackgroundColor] =
		useState<string>("#FFFFFF");
	const [secondaryColor, setSecondaryColor] = useState<string>("#5A92A4");
	const [textColor, setTextColor] = useState<string>("#000000");
	const [description, setDescription] = useState<string>("");
	const [evolutionChain, setEvolutionChain] = useState<EvolutionDetail[]>(
		[]
	);
	const [animate, setAnimate] = useState<boolean>(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Mémoriser la fonction avec useCallback pour éviter les rendus infinis
	const extractAllEvolutions = useCallback(
		async (
			chainData: EvolvesTo[],
			evolutions: EvolutionDetail[]
		) => {
			for (const evolution of chainData) {
				try {
					const response = await fetch(
						`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`
					);
					const data = await response.json();

					evolutions.push({
						id: data.id,
						name: data.name,
						sprites: {
							front_default:
								data.sprites
									.front_default,
						},
					});

					// Récursion pour les évolutions suivantes
					if (
						evolution.evolves_to &&
						evolution.evolves_to.length > 0
					) {
						await extractAllEvolutions(
							evolution.evolves_to,
							evolutions
						);
					}
				} catch (err) {
					console.error(
						`Error fetching evolution ${evolution.species.name}:`,
						err
					);
				}
			}
		},
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// Récupérer les données de base du Pokémon
				const data = await fetchPokemon(id);
				setPokemonData(data);

				// Déterminer les couleurs en fonction du type principal et secondaire
				const primaryType = data.types[0]?.type
					?.name as keyof typeof Colors.type;
				const secondaryType = data.types[1]?.type
					?.name as keyof typeof Colors.type;

				const bgColor =
					Colors.type[primaryType] || "#FFFFFF";
				const txtColor =
					Colors.textColor[primaryType] ||
					"#000000";

				setBackgroundColor(bgColor);
				setTextColor(txtColor);

				// Couleur secondaire
				let secColor;
				if (
					secondaryType &&
					Colors.type[secondaryType]
				) {
					secColor = Colors.type[secondaryType];
				} else {
					// Sinon, couleur complémentaire
					const primaryHex =
						Colors.type[primaryType] ||
						"#5A92A4";
					const r = parseInt(
						primaryHex.slice(1, 3),
						16
					);
					const g = parseInt(
						primaryHex.slice(3, 5),
						16
					);
					const b = parseInt(
						primaryHex.slice(5, 7),
						16
					);

					// Créer une couleur complémentaire plus douce
					const secondaryR = Math.min(
						255,
						Math.max(0, 255 - r + 40)
					);
					const secondaryG = Math.min(
						255,
						Math.max(0, 255 - g + 40)
					);
					const secondaryB = Math.min(
						255,
						Math.max(0, 255 - b + 40)
					);

					secColor = `#${secondaryR
						.toString(16)
						.padStart(2, "0")}${secondaryG
						.toString(16)
						.padStart(2, "0")}${secondaryB
						.toString(16)
						.padStart(2, "0")}`;
				}
				setSecondaryColor(secColor);

				// Récupérer la description et les données d'évolution
				if (data.species?.url) {
					try {
						const speciesResponse =
							await fetch(
								data.species.url
							);
						const speciesData: PokemonSpecies =
							await speciesResponse.json();

						// Trouver une description en anglais uniquement
						const descEntry =
							speciesData.flavor_text_entries.find(
								(entry) =>
									entry
										.language
										.name ===
									"en"
							);

						if (descEntry) {
							const cleanDesc =
								descEntry.flavor_text.replace(
									/\f/g,
									" "
								);
							setDescription(
								cleanDesc
							);
						}

						// Récupérer la chaîne d'évolution complète
						if (
							speciesData
								.evolution_chain
								?.url
						) {
							const evolutionResponse =
								await fetch(
									speciesData
										.evolution_chain
										.url
								);
							const evolutionData: EvolutionChain =
								await evolutionResponse.json();

							// Collecter toutes les évolutions
							const evolutionDetails: EvolutionDetail[] =
								[];

							// Ajouter la forme de base
							try {
								const baseResponse =
									await fetch(
										`https://pokeapi.co/api/v2/pokemon/${evolutionData.chain.species.name}`
									);
								const baseData =
									await baseResponse.json();
								evolutionDetails.push(
									{
										id: baseData.id,
										name: baseData.name,
										sprites: {
											front_default:
												baseData
													.sprites
													.front_default,
										},
									}
								);

								// Traiter toutes les évolutions, y compris les branches multiples
								if (
									evolutionData
										.chain
										.evolves_to &&
									evolutionData
										.chain
										.evolves_to
										.length >
										0
								) {
									await extractAllEvolutions(
										evolutionData
											.chain
											.evolves_to,
										evolutionDetails
									);
								}

								// Trier les évolutions par ID
								evolutionDetails.sort(
									(
										a,
										b
									) =>
										a.id -
										b.id
								);
							} catch (e) {
								console.error(
									"Erreur lors de la récupération des évolutions:",
									e
								);
							}

							// Mettre à jour l'état
							setEvolutionChain(
								evolutionDetails
							);
						}
					} catch (e) {
						console.error(
							"Erreur lors de la récupération des données d'espèce:",
							e
						);
					}
				}

				setLoading(false);
				// Déclencher l'animation après le chargement
				setTimeout(() => {
					setAnimate(true);
				}, 100);
			} catch (err) {
				console.error("Error fetching Pokemon:", err);
				setError("Failed to load Pokémon data");
				setLoading(false);
			}
		};

		setAnimate(false); // Réinitialiser l'animation à chaque changement d'ID
		fetchData();
	}, [id, extractAllEvolutions]); // Ajout de extractAllEvolutions aux dépendances

	// Reste du code inchangé...
	const handlePreviousPokemon = () => {
		const prevId = Math.max(1, parseInt(id) - 1);
		router.push(`/pokemon/${prevId}`);
	};

	const handleNextPokemon = () => {
		const nextId = parseInt(id) + 1;
		router.push(`/pokemon/${nextId}`);
	};

	const handleReturnToList = () => {
		router.push("/pokemon");
	};

	const handleEvolutionClick = (evolutionId: number) => {
		router.push(`/pokemon/${evolutionId}`);
	};

	const playCry = () => {
		if (!pokemonData?.cries?.latest) return;

		if (audioRef.current) {
			audioRef.current.pause();
		}

		const audio = new Audio(pokemonData.cries.latest);
		audioRef.current = audio;

		audio.onplay = () => setIsPlayingCry(true);
		audio.onended = () => setIsPlayingCry(false);
		audio.onerror = () => setIsPlayingCry(false);

		audio.play().catch((err) => {
			console.error("Failed to play Pokémon cry:", err);
			setIsPlayingCry(false);
		});
	};

	if (loading) {
		return (
			<div className="pt-32 lg:pt-40 min-h-screen flex justify-center items-center">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error || !pokemonData) {
		return (
			<div className="pt-32 lg:pt-40 min-h-screen flex flex-col justify-center items-center">
				<h1 className="text-2xl font-bold text-red-500">
					{error || "Pokémon not found"}
				</h1>
				<Button
					className="mt-4"
					onClick={() => router.push("/pokemon")}
				>
					Return to Pokémon List
				</Button>
			</div>
		);
	}

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

	const formatPokemonId = (id: number): string => {
		return `#${id.toString().padStart(3, "0")}`;
	};

	const formatWeight = (weight: number): string => {
		return `${(weight / 10).toFixed(1)} kg`;
	};

	const formatHeight = (height: number): string => {
		return `${(height / 10).toFixed(1)} m`;
	};

	const spriteUrl = showShinySprite
		? pokemonData.sprites.front_shiny ||
		  pokemonData.sprites.front_default
		: pokemonData.sprites.front_default;

	// Style pour les bordures style Pokémon Rouge/Bleu/Jaune
	const retroBorderStyle = {
		border: "4px solid #000",
		borderRadius: "4px",
		boxShadow: `
            inset -4px -4px 0 0 rgba(0,0,0,0.2),
            inset 4px 4px 0 0 rgba(255,255,255,0.2)
        `,
		position: "relative",
		backgroundColor: `${secondaryColor}`,
	};

	// Composant du bouton Copy CSS
	const CopyCssButton = ({
		primaryColor,
		secondaryColor,
	}: {
		primaryColor: string;
		secondaryColor: string;
	}) => {
		const [isCopied, setIsCopied] = useState(false);

		const handleCopyCSS = () => {
			// Créer le CSS pour les couleurs du Pokémon
			const cssText = `/* ${formatPokemonName(
				pokemonData?.name || "Pokemon"
			)} Colors */
.pokemon-primary-color {
  background-color: ${primaryColor};
  color: ${textColor};
}
.pokemon-secondary-color {
  background-color: ${secondaryColor};
}
/* Gradient option */
.pokemon-gradient {
  background: linear-gradient(to right, ${primaryColor}, ${secondaryColor});
}`;

			// Copier dans le presse-papier
			navigator.clipboard
				.writeText(cssText)
				.then(() => {
					setIsCopied(true);
					setTimeout(
						() => setIsCopied(false),
						2000
					);
				})
				.catch((err) => {
					console.error(
						"Failed to copy CSS: ",
						err
					);
				});
		};

		return (
			<Button
				onClick={handleCopyCSS}
				className="mt-4 flex items-center gap-2 w-full py-2 font-semibold
                 border border-white/30 bg-white/20 backdrop-blur-sm transition-all
                 hover:bg-white/30 relative overflow-hidden group"
				style={{
					color: "#FFFFFF",
					textShadow: "0 1px 2px rgba(0,0,0,0.5)",
				}}
			>
				<div className="relative w-5 h-5 group-hover:animate-bounce">
					<Image
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
						alt="Pokeball"
						width={20}
						height={20}
						className="object-contain"
					/>
				</div>
				<span className="text-black uppercase font-bold">
					{isCopied ? "CSS Copied!" : "Copy CSS"}
				</span>
				{isCopied && (
					<span className="absolute inset-0 flex items-center justify-center bg-green-500/80 animate-fade-out">
						Copied!
					</span>
				)}
			</Button>
		);
	};

	return (
		<>
			{/* Navigation controls */}
			<div className="container mx-auto px-4 mb-6 mt-10">
				<div className="flex justify-between">
					<Button
						variant="outline"
						className="flex items-center gap-2"
						onClick={handlePreviousPokemon}
						disabled={parseInt(id) <= 1}
					>
						<ArrowLeft size={16} />
						Previous
					</Button>

					{/* Bouton de retour à la liste avec pokebread icon */}
					<Button
						variant="outline"
						className="flex items-center gap-2"
						onClick={handleReturnToList}
					>
						<Image
							src={pokebread}
							alt="Return to list"
							width={16}
							height={16}
							className="object-contain"
						/>
						Return to List
					</Button>

					<Button
						variant="outline"
						className="flex items-center gap-2 z-0"
						onClick={handleNextPokemon}
					>
						Next
						<ArrowRight size={16} />
					</Button>
				</div>
			</div>

			{/* Main content card avec animation */}
			<div className="container mx-auto px-4 pb-12">
				<div
					className={`rounded-xl shadow-xl overflow-hidden relative transition-all duration-500 ${
						animate
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-8"
					}`}
					style={{ backgroundColor }}
				>
					{/* Pokeball background image */}
					<div className="absolute inset-0 flex justify-center items-center opacity-20">
						<Image
							src={pokeball}
							alt="Pokeball background"
							width={300}
							height={300}
							className="object-contain"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 relative z-10">
						{/* Left column with sprite */}
						<div
							className={`bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-500 ${
								animate
									? "opacity-100 translate-x-0"
									: "opacity-0 -translate-x-8"
							}`}
							style={{
								animationDelay:
									"200ms",
							}}
						>
							{/* Title and ID for mobile view */}
							<div className="md:hidden w-full text-center mb-4">
								<h1
									className="text-3xl font-bold"
									style={{
										color: textColor,
									}}
								>
									{formatPokemonName(
										pokemonData.name
									)}
								</h1>
								<p className="text-xl text-gray-500">
									{formatPokemonId(
										pokemonData.id
									)}
								</p>
							</div>

							{/* Sprite */}
							<div
								className="relative w-48 h-48 md:w-64 md:h-64 bg-white rounded-xl shadow-sm flex items-center justify-center p-2"
								style={{
									backgroundColor: `${backgroundColor}10`,
								}}
							>
								{spriteUrl && (
									<Image
										src={
											spriteUrl
										}
										alt={
											pokemonData.name
										}
										width={
											128
										}
										height={
											128
										}
										className="w-full h-full object-contain pixelated"
										style={{
											imageRendering:
												"pixelated",
										}}
										unoptimized
									/>
								)}
							</div>

							{/* Shiny toggle */}
							{pokemonData.sprites
								.front_shiny && (
								<div className="mt-4 w-full">
									<Button
										variant="outline"
										size="sm"
										className="w-full"
										onClick={() =>
											setShowShinySprite(
												!showShinySprite
											)
										}
										style={{
											borderColor:
												textColor,
											color: textColor,
										}}
									>
										{showShinySprite
											? "Show Normal"
											: "Show Shiny"}
									</Button>
								</div>
							)}

							{/* Color palette */}
							<div className="w-full mt-6">
								<h2
									className="font-bold mb-2"
									style={{
										color: textColor,
									}}
								>
									Color
									Palette
								</h2>
								<ColorPalette
									imageUrl={
										spriteUrl ||
										"/assets/default-image.png"
									}
								/>

								{/* Bouton Copy CSS à ajouter ici */}
								<CopyCssButton
									primaryColor={
										backgroundColor
									}
									secondaryColor={
										secondaryColor
									}
								/>
							</div>
						</div>

						{/* Right column with information */}
						<div
							className={`md:col-span-2 transition-all duration-500 ${
								animate
									? "opacity-100 translate-x-0"
									: "opacity-0 translate-x-8"
							}`}
							style={{
								animationDelay:
									"400ms",
							}}
						>
							{/* Title and ID for desktop */}
							<div className="hidden md:flex justify-between items-start mb-6">
								<div>
									<h1
										className="text-4xl font-bold"
										style={{
											color: textColor,
										}}
									>
										{formatPokemonName(
											pokemonData.name
										)}
									</h1>
									<p className="text-2xl text-gray-500">
										{formatPokemonId(
											pokemonData.id
										)}
									</p>
								</div>

								{/* Cry button */}
								{pokemonData
									.cries
									?.latest && (
									<Button
										variant="outline"
										size="icon"
										className={`rounded-full ${
											isPlayingCry
												? "animate-pulse"
												: ""
										}`}
										onClick={
											playCry
										}
										style={{
											borderColor:
												textColor,
											color: textColor,
										}}
									>
										<VolumeIcon
											size={
												20
											}
										/>
									</Button>
								)}
							</div>

							{/* Types and Measurements in one row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
								<div>
									<h3 className="text-lg font-semibold mb-2">
										Types
									</h3>
									<div className="flex flex-wrap gap-2">
										{pokemonData.types.map(
											(
												typeInfo,
												index
											) => {
												const typeName =
													typeInfo
														.type
														.name as keyof typeof Colors.type;
												return (
													<span
														key={
															index
														}
														className="px-3 py-1 rounded-full text-white text-sm font-medium border border-white/30"
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
								</div>

								{/* Mesures dans une petite carte */}
								<div className="bg-white/20 p-3 rounded-lg shadow-sm">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-100 font-semibold">
												Height
											</p>
											<p className="font-medium text-white">
												{formatHeight(
													pokemonData.height
												)}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-100 font-semibold">
												Weight
											</p>
											<p className="font-medium text-white">
												{formatWeight(
													pokemonData.weight
												)}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Description et Stats sur la même ligne */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
								{/* Description dans le style Pokémon classique */}
								<div
									style={
										retroBorderStyle as React.CSSProperties
									}
									className="p-3"
								>
									<p className="text-base text-white font-semibold leading-relaxed p-4 text-center max-h-48 overflow-auto">
										{description ||
											"No description available for this Pokémon."}
									</p>
								</div>

								{/* Stats - version plus compacte */}
								<div>
									<h3 className="text-lg font-semibold mb-2 text-white">
										Base
										Stats
									</h3>
									<div className="grid grid-cols-1 gap-2">
										{pokemonData.stats.map(
											(
												statInfo,
												index
											) => {
												const statName =
													statInfo.stat.name
														.replace(
															"special-attack",
															"Sp. Atk"
														)
														.replace(
															"special-defense",
															"Sp. Def"
														)
														.replace(
															"attack",
															"Attack"
														)
														.replace(
															"defense",
															"Defense"
														)
														.replace(
															"speed",
															"Speed"
														)
														.replace(
															"hp",
															"HP"
														);

												// Stats encore plus courtes
												const percentage =
													Math.min(
														100,
														(statInfo.base_stat /
															150) *
															100
													);

												// Animation de la barre de progression
												const barStyle =
													{
														width: animate
															? `${percentage}%`
															: "0%",
														backgroundColor:
															secondaryColor,
														transition: `width 1s ease-out ${
															0.5 +
															index *
																0.1
														}s`,
													};

												return (
													<div
														key={
															index
														}
													>
														<div className="flex justify-between mb-1">
															<span className="text-sm font-medium text-white">
																{
																	statName
																}
															</span>
															<span className="text-sm font-medium text-white">
																{
																	statInfo.base_stat
																}
															</span>
														</div>
														<div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
															<div
																className="h-2 rounded-full"
																style={
																	barStyle
																}
															></div>
														</div>
													</div>
												);
											}
										)}
									</div>
								</div>
							</div>

							{/* Évolutions */}
							{evolutionChain.length >
								1 && (
								<div
									className={`mt-4 transition-all duration-500 ${
										animate
											? "opacity-100 translate-y-0"
											: "opacity-0 translate-y-8"
									}`}
									style={{
										animationDelay:
											"600ms",
									}}
								>
									<div className="flex flex-wrap justify-start items-center gap-2">
										{evolutionChain.map(
											(
												evolution,
												index
											) => (
												<div
													key={
														evolution.id
													}
													className="flex items-center"
												>
													<button
														className={`flex flex-col items-center ${
															parseInt(
																id
															) ===
															evolution.id
																? "opacity-100"
																: "opacity-70 hover:opacity-100"
														}`}
														onClick={() =>
															handleEvolutionClick(
																evolution.id
															)
														}
													>
														<div
															className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
																parseInt(
																	id
																) ===
																evolution.id
																	? "border-white"
																	: "border-white/50"
															} bg-white/20 p-1`}
														>
															{evolution
																.sprites
																.front_default && (
																<Image
																	src={
																		evolution
																			.sprites
																			.front_default
																	}
																	alt={
																		evolution.name
																	}
																	width={
																		64
																	}
																	height={
																		64
																	}
																	className="w-full h-full object-contain pixelated"
																	style={{
																		imageRendering:
																			"pixelated",
																	}}
																	unoptimized
																/>
															)}
														</div>
														<span className="text-xs text-white mt-1">
															{formatPokemonName(
																evolution.name
															)}
														</span>
													</button>

													{/* Flèche entre les évolutions */}
													{index <
														evolutionChain.length -
															1 && (
														<div className="mx-2 text-white">
															<ArrowRight
																size={
																	20
																}
															/>
														</div>
													)}
												</div>
											)
										)}
									</div>
								</div>
							)}

							{/* Cry button for mobile */}
							{pokemonData.cries
								?.latest && (
								<div className="md:hidden mt-6 flex justify-center">
									<Button
										variant="outline"
										className={`rounded-full flex items-center gap-2 ${
											isPlayingCry
												? "animate-pulse"
												: ""
										}`}
										onClick={
											playCry
										}
										style={{
											borderColor:
												textColor,
											color: textColor,
										}}
									>
										<VolumeIcon
											size={
												20
											}
										/>
										{isPlayingCry
											? "Playing..."
											: "Play Cry"}
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
