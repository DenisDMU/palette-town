import { Colors } from "@/app/helpers/Colors";
import { fetchPokemon } from "@/app/helpers/FetchPokemon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	try {
		// Récupérer les données du Pokémon
		const data: {
			id: number;
			name: string;
			types: { type: { name: string } }[];
			sprites: {
				front_default: string;
				other: {
					"official-artwork": {
						front_default: string | null;
					};
				};
			};
		} = await fetchPokemon(id);

		// Déterminer les couleurs en fonction du type principal et secondaire
		const primaryType = data.types[0]?.type
			?.name as keyof typeof Colors.type;
		const secondaryType = data.types[1]?.type
			?.name as keyof typeof Colors.type;

		const backgroundColor = Colors.type[primaryType] ?? "#FFFFFF";
		const textColor = Colors.textColor[primaryType] || "#000000";

		// Calculer la couleur secondaire
		let secondaryColor;
		if (
			secondaryType &&
			Colors.type[secondaryType as keyof typeof Colors.type]
		) {
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
			types: data.types.map((t) => t.type.name),
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

		return NextResponse.json(response);
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch Pokémon data" },
			{ status: 500 }
		);
	}
}
