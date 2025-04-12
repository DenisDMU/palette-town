import { Button } from "@/components/ui/button";
import { LucideSearch } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchPokemonProps {
	onSearch: (query: string) => void; // Fonction pour transmettre la recherche au parent
}

export default function SearchPokemon({ onSearch }: SearchPokemonProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Fonction debounce - attend 500ms après la dernière frappe
	useEffect(() => {
		// Annuler le timer précédent s'il existe
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		// Créer un nouveau timer
		timerRef.current = setTimeout(() => {
			// Appeler onSearch avec la requête actuelle
			onSearch(searchQuery);
		}, 500);

		// Nettoyer le timer lorsque le composant est démonté ou la requête change
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [searchQuery, onSearch]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Annuler le timer de debounce
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		onSearch(searchQuery); // Recherche immédiate quand on clique sur le bouton
	};

	return (
		<form
			className="flex border border-primary/30 rounded-full p-2 w-full max-w-xl mx-auto"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				placeholder="Search by name or number"
				className="bg-transparent px-6 py-2 text-foreground outline-none w-full text-sm md:text-base"
				onChange={handleInputChange}
				value={searchQuery}
			/>
			<Button
				className="text-muted-foreground rounded-full whitespace-nowrap h-10 px-3"
				type="submit"
			>
				<LucideSearch className="h-4 w-4" />
			</Button>
		</form>
	);
}
