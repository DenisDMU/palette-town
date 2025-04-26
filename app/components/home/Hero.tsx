"use client";
import { useState, useRef} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LucideSearch } from "lucide-react";

export default function Hero() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		// Si la recherche est vide, ne rien faire
		if (!searchQuery.trim()) return;

		setIsLoading(true);

		// Vérifier si c'est un nombre
		const isNumber =
			!isNaN(Number(searchQuery)) && Number(searchQuery) > 0;

		if (isNumber) {
			// Si c'est un nombre valide, rediriger directement vers la page du Pokémon par ID
			router.push(`/pokemon/${searchQuery}`);
			setIsLoading(false);
			return;
		}

		// Si c'est du texte, chercher le Pokémon par nom
		try {
			const normalizedName = searchQuery.toLowerCase().trim();

			// Essayer de trouver l'ID du Pokémon à partir de son nom
			const response = await fetch(
				`https://pokeapi.co/api/v2/pokemon/${normalizedName}`
			);

			if (response.ok) {
				// Si le Pokémon est trouvé, extraire son ID et rediriger
				const data = await response.json();
				router.push(`/pokemon/${data.id}`);
			} else {
				// Si le Pokémon n'est pas trouvé par son nom exact, rediriger vers la liste avec la recherche
				router.push(
					`/pokemon?search=${encodeURIComponent(
						normalizedName
					)}`
				);
			}
		} catch (error: unknown) {
			// En cas d'erreur, rediriger vers la liste avec la recherche
			if (error instanceof Error) {
				console.error(
					"Error fetching Pokémon data:",
					error.message
				);
			} else {
				console.error(
					"Error fetching Pokémon data:",
					error
				);
			}
			router.push(
				`/pokemon?search=${encodeURIComponent(
					searchQuery
				)}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="py-24 flex justify-center items-center w-full">
			<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
				<div className="flex justify-center">
					<div
						className="text-blue-300 inline-flex py-1 px-3 bg-gradient-to-r from-primary to-blue-400
                    rounded-full font-semibold"
					>
						🎲 Get the colors of the 150
						originals Pokemon.
					</div>
				</div>
				<h1 className="text-center text-primary text-6xl md:text-7xl font-medium mt-6">
					Palette Town
				</h1>
				<p className="text-center text-foreground/85 text-xl mt-8 max-w-2xl mx-auto">
					Finding the perfect color palette for
					your design project can be challenging.
					Balancing complementary hues and
					creating harmonious combinations often
					feels like an impossible quest. Palette
					Town is here to inspire you with unique
					color schemes based on the original 150
					Pokémon, bringing nostalgic vibes to
					your next creative adventure.
				</p>

				{/* Barre de recherche personnalisée */}
				<div className="text-center mt-10">
					<form
						className="flex border border-primary/30 rounded-full p-2 w-full max-w-xl mx-auto"
						onSubmit={handleSearch}
					>
						<input
							ref={inputRef}
							type="text"
							placeholder="Enter Pokémon name or number"
							className="bg-transparent px-6 py-2 text-foreground outline-none w-full text-sm md:text-base"
							onChange={
								handleInputChange
							}
							value={searchQuery}
						/>
						<Button
							className="text-muted-foreground rounded-full whitespace-nowrap h-10 px-3"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? (
								<div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
							) : (
								<LucideSearch className="h-4 w-4" />
							)}
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
}
