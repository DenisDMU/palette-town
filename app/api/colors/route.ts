import { Colors } from "@/app/helpers/Colors";
import { NextResponse } from "next/server";

// Cache simple en mémoire
let cachedTypes: {
	types: {
		type: string;
		color: {
			hex: string;
			rgb: string;
			r: number;
			g: number;
			b: number;
		};
		textColor: string;
	}[];
	count: number;
} | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 86400000; // 24 heures en millisecondes (ce sont des données statiques)

// Cette route retourne toutes les couleurs de type disponibles
export async function GET() {
	try {
		// Vérifier le cache
		if (cachedTypes && Date.now() - cacheTimestamp < CACHE_TTL) {
			return NextResponse.json(cachedTypes, {
				headers: {
					"Cache-Control":
						"public, max-age=86400",
					"X-Cache": "HIT",
				},
			});
		}

		const typeColors = { ...Colors.type };
		const textColors = { ...Colors.textColor };

		const colorEntries = Object.entries(typeColors).map(
			([type, color]) => {
				// Convertir de HEX à RGB
				const hexToRgb = (hex: string) => {
					const r = parseInt(hex.slice(1, 3), 16);
					const g = parseInt(hex.slice(3, 5), 16);
					const b = parseInt(hex.slice(5, 7), 16);
					return { r, g, b };
				};

				const rgb = hexToRgb(color);
				const textColor =
					textColors[
						type as keyof typeof textColors
					] || "#FFFFFF";

				return {
					type,
					color: {
						hex: color,
						rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
						r: rgb.r,
						g: rgb.g,
						b: rgb.b,
					},
					textColor,
				};
			}
		);

		const response = {
			types: colorEntries,
			count: colorEntries.length,
		};

		// Mettre en cache
		cachedTypes = response;
		cacheTimestamp = Date.now();

		return NextResponse.json(response, {
			headers: {
				"Cache-Control": "public, max-age=86400",
				"X-Cache": "MISS",
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve type colors" },
			{ status: 500 }
		);
	}
}
