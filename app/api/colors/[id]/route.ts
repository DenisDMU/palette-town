import { Colors } from "@/app/helpers/Colors";
import { fetchPokemon } from "@/app/helpers/FetchPokemon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		// Récupérer les données du Pokémon
		const data = await fetchPokemon(id);

		// Déterminer les couleurs en fonction du type principal
		const primaryType = data.types[0]?.type
			?.name as keyof typeof Colors.type;

		const primaryColor = Colors.type[primaryType] ?? "#F8D030"; // Couleur par défaut électrique
		const textColor = Colors.textColor[primaryType] || "#000000";

		// Créer la couleur secondaire (version plus foncée de la couleur primaire)
		const hexToRgb = (hex: string) => {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return { r, g, b };
		};

		// Convertir RGB en HSL
		const rgbToHsl = (r: number, g: number, b: number) => {
			r /= 255;
			g /= 255;
			b /= 255;
			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
			let h = 0,
				s = 0;
			const l = (max + min) / 2;

			if (max !== min) {
				const d = max - min;
				s =
					l > 0.5
						? d / (2 - max - min)
						: d / (max + min);
				switch (max) {
					case r:
						h =
							(g - b) / d +
							(g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}

			return {
				h: Math.round(h * 360),
				s: Math.round(s * 100),
				l: Math.round(l * 100),
			};
		};

		const primaryRgb = hexToRgb(primaryColor);
		const primaryHsl = rgbToHsl(
			primaryRgb.r,
			primaryRgb.g,
			primaryRgb.b
		);

		// Assombrir pour obtenir une couleur secondaire
		const secondaryR = Math.floor(primaryRgb.r * 0.65);
		const secondaryG = Math.floor(primaryRgb.g * 0.65);
		const secondaryB = Math.floor(primaryRgb.b * 0.65);
		const secondaryHsl = rgbToHsl(
			secondaryR,
			secondaryG,
			secondaryB
		);

		const secondaryColor = `#${secondaryR
			.toString(16)
			.padStart(2, "0")}${secondaryG
			.toString(16)
			.padStart(2, "0")}${secondaryB
			.toString(16)
			.padStart(2, "0")}`;

		// Pour le textColor (noir en HSL)

		// Construire la réponse dans le format exact demandé
		const response = {
			name: data.name,
			primary: {
				hex: primaryColor,
				rgb: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
				rgba: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)`,
				hsl: `hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${primaryHsl.l}%)`,
				r: primaryRgb.r,
				g: primaryRgb.g,
				b: primaryRgb.b,
				h: primaryHsl.h,
				s: primaryHsl.s,
				l: primaryHsl.l,
			},
			secondary: {
				hex: secondaryColor,
				rgb: `rgb(${secondaryR}, ${secondaryG}, ${secondaryB})`,
				rgba: `rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, 1)`,
				hsl: `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, ${secondaryHsl.l}%)`,
				r: secondaryR,
				g: secondaryG,
				b: secondaryB,
				h: secondaryHsl.h,
				s: secondaryHsl.s,
				l: secondaryHsl.l,
			},
			text: {
				hex: textColor,
				rgb: `rgb(0, 0, 0)`,
				rgba: `rgba(0, 0, 0, 1)`,
				hsl: `hsl(0, 0%, 0%)`,
				r: 0,
				g: 0,
				b: 0,
				h: 0,
				s: 0,
				l: 0,
			},
		};

		return NextResponse.json(response, {
			headers: {
				"Cache-Control": "public, max-age=86400", // Cache pendant 24 heures
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch color data",
				details:
					error instanceof Error
						? error.message
						: String(error),
			},
			{ status: 500 }
		);
	}
}
