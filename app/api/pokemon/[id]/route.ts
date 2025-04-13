import { Colors } from "@/app/helpers/Colors";
import { fetchPokemon } from "@/app/helpers/FetchPokemon";
import { NextResponse } from "next/server";

// Cache simple en mémoire
const CACHE = new Map<
	string,
	{
		data: {
			id: number;
			name: string;
			sprite: string;
			official_artwork: string | null;
			types: string[];
			colors: {
				primary: string;
				secondary: string;
				text: string;
			};
			css: {
				primaryClass: string;
				secondaryClass: string;
				gradientClass: string;
			};
			cssVariables: string;
		};
		timestamp: number;
	}
>();
const CACHE_TTL = 3600000; // 1 heure en millisecondes

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id;
		const cacheKey = `pokemon-${id}`;

		// Vérifier le cache
		const cachedItem = CACHE.get(cacheKey);
		if (
			cachedItem &&
			Date.now() - cachedItem.timestamp < CACHE_TTL
		) {
			return NextResponse.json(cachedItem.data, {
				headers: {
					"Cache-Control": "public, max-age=3600",
					"X-Cache": "HIT",
				},
			});
		}

		// Récupérer les données du Pokémon
		const data = await fetchPokemon(id);

		// Déterminer les couleurs en fonction du type principal et secondaire
		const primaryType = data.types[0]?.type
			?.name as keyof typeof Colors.type;
		const secondaryType = data.types[1]?.type
			?.name as keyof typeof Colors.type;

		const backgroundColor = Colors.type[primaryType] ?? "#FFFFFF";
		const textColor = Colors.textColor[primaryType] || "#000000";

		// Calculer la couleur secondaire
		let secondaryColor;
		if (secondaryType && Colors.type[secondaryType]) {
			secondaryColor = Colors.type[secondaryType];
		} else {
			// Sinon, couleur complémentaire
			const primaryHex =
				Colors.type[primaryType] || "#5A92A4";
			const r = parseInt(primaryHex.slice(1, 3), 16);
			const g = parseInt(primaryHex.slice(3, 5), 16);
			const b = parseInt(primaryHex.slice(5, 7), 16);

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

			secondaryColor = `#${secondaryR
				.toString(16)
				.padStart(2, "0")}${secondaryG
				.toString(16)
				.padStart(2, "0")}${secondaryB
				.toString(16)
				.padStart(2, "0")}`;
		}

		// Formatter le nom du Pokémon pour le CSS
		const cssName = data.name.replace(/[-\s]+/g, "-").toLowerCase();

		// Préparer la réponse
		const response = {
			id: data.id,
			name: data.name,
			sprite: data.sprites.front_default,
			official_artwork:
				data.sprites.other["official-artwork"]
					?.front_default || null,
			types: data.types.map(
				(t: { type: { name: string } }) => t.type.name
			),
			colors: {
				primary: backgroundColor,
				secondary: secondaryColor,
				text: textColor,
			},
			css: {
				primaryClass: `.pokemon-${cssName}-primary { background-color: ${backgroundColor}; color: ${textColor}; }`,
				secondaryClass: `.pokemon-${cssName}-secondary { background-color: ${secondaryColor}; }`,
				gradientClass: `.pokemon-${cssName}-gradient { background: linear-gradient(to right, ${backgroundColor}, ${secondaryColor}); }`,
			},
			cssVariables: `
--pokemon-${cssName}-primary: ${backgroundColor};
--pokemon-${cssName}-secondary: ${secondaryColor};
--pokemon-${cssName}-text: ${textColor};`,
		};

		// Mettre en cache
		CACHE.set(cacheKey, { data: response, timestamp: Date.now() });

		return NextResponse.json(response, {
			headers: {
				"Cache-Control": "public, max-age=3600",
				"X-Cache": "MISS",
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch Pokémon data" },
			{ status: 500 }
		);
	}
}
