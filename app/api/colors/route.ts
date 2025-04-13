import { Colors } from "@/app/helpers/Colors";
import { fetchPokemon } from "@/app/helpers/FetchPokemon";
import { NextResponse } from "next/server";

// Cache simple en mémoire
const CACHE = new Map<
	string,
	{
		data: {
			name: string;
			primary: {
				hex: string;
				rgb: string;
				rgba: string;
				r: number;
				g: number;
				b: number;
			};
			secondary: {
				hex: string;
				rgb: string;
				rgba: string;
				r: number;
				g: number;
				b: number;
			};
			text: {
				hex: string;
				rgb: string;
				rgba: string;
				r: number;
				g: number;
				b: number;
			};
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
		const cacheKey = `colors-${id}`;

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

		// Extraire les formats de couleur différents
		const hexToRgb = (hex: string) => {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return { r, g, b };
		};

		const primaryRgb = hexToRgb(backgroundColor);
		const secondaryRgb = hexToRgb(secondaryColor);
		const textRgb = hexToRgb(textColor);

		// Préparer la réponse
		const response = {
			name: data.name,
			primary: {
				hex: backgroundColor,
				rgb: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
				rgba: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)`,
				r: primaryRgb.r,
				g: primaryRgb.g,
				b: primaryRgb.b,
			},
			secondary: {
				hex: secondaryColor,
				rgb: `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`,
				rgba: `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 1)`,
				r: secondaryRgb.r,
				g: secondaryRgb.g,
				b: secondaryRgb.b,
			},
			text: {
				hex: textColor,
				rgb: `rgb(${textRgb.r}, ${textRgb.g}, ${textRgb.b})`,
				rgba: `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 1)`,
				r: textRgb.r,
				g: textRgb.g,
				b: textRgb.b,
			},
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
			{ error: "Failed to fetch color data" },
			{ status: 500 }
		);
	}
}
