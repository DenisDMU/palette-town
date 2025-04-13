import { Colors } from "@/app/helpers/Colors";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	context: { params: { id: string } }
) {
	try {
		const { id } = context.params;

		// Récupérer les données pour le type de Pokémon
		const typeColors = Colors.type[id as keyof typeof Colors.type];
		const textColor =
			Colors.textColor[id as keyof typeof Colors.textColor];

		if (!typeColors) {
			return NextResponse.json(
				{ error: "Type not found" },
				{ status: 404 }
			);
		}

		// Convertir HEX en RGB
		const hexToRgb = (hex: string) => {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return { r, g, b };
		};

		const rgb = hexToRgb(typeColors);

		const response = {
			type: id,
			color: {
				hex: typeColors,
				rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
				r: rgb.r,
				g: rgb.g,
				b: rgb.b,
			},
			textColor: textColor || "#FFFFFF",
		};

		return NextResponse.json(response, {
			headers: {
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve type color" },
			{ status: 500 }
		);
	}
}
