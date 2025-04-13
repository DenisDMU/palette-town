"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
// Utilisation de culori (Color.js) pour la manipulation de couleurs
import convert from "color-convert";

interface ColorPaletteProps {
	imageUrl: string;
}

interface Color {
	hex: string;
	rgb: string;
	hsl: string;
}

interface SwatchWithName {
	name: string;
	color: string;
}

export default function ColorPalette({ imageUrl }: ColorPaletteProps) {
	const [palette, setPalette] = useState<SwatchWithName[]>([]);
	const [selectedColor, setSelectedColor] = useState<Color | null>(null);
	const [colorFormat, setColorFormat] = useState<"hex" | "rgb" | "hsl">(
		"hex"
	);
	const [copiedColor, setCopiedColor] = useState<string | null>(null);
	const [error, setError] = useState<boolean>(false);

	// Convertir une couleur dans les trois formats
	const convertToAllFormats = (hexColor: string): Color => {
		try {
			// Enlever le # du début si présent
			const cleanHex = hexColor.replace("#", "");

			// Convertir hex vers rgb
			const rgbArray = convert.hex.rgb(cleanHex);

			// Convertir hex vers hsl
			const hslArray = convert.hex.hsl(cleanHex);

			return {
				hex: hexColor.toUpperCase(), // Normaliser en majuscules
				rgb: `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`,
				hsl: `hsl(${hslArray[0]}, ${hslArray[1]}%, ${hslArray[2]}%)`,
			};
		} catch {
			return { hex: hexColor, rgb: "", hsl: "" };
		}
	};

	// Extraction de couleurs à partir de l'image
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const extractColors = (url: string): void => {
		const img = new Image();
		img.crossOrigin = "Anonymous";

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d", {
				willReadFrequently: true,
			});
			canvas.width = img.width;
			canvas.height = img.height;

			if (ctx) {
				ctx.drawImage(img, 0, 0);

				// Carte de fréquence des couleurs
				const colorFrequency: Record<
					string,
					{ count: number; rgb: number[] }
				> = {};

				// Échantillonnage de pixels
				const pixelData = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height
				).data;
				const step = Math.max(
					1,
					Math.floor(
						(canvas.width * canvas.height) /
							2000
					)
				);

				// Analyser les pixels et compter les fréquences des couleurs
				for (
					let i = 0;
					i < pixelData.length;
					i += 4 * step
				) {
					const r = pixelData[i];
					const g = pixelData[i + 1];
					const b = pixelData[i + 2];
					const a = pixelData[i + 3];

					// Ignorer les pixels transparents ou blancs
					if (
						a < 200 ||
						(r > 240 && g > 240 && b > 240)
					)
						continue;

					const key = `${r},${g},${b}`;
					if (colorFrequency[key]) {
						colorFrequency[key].count++;
					} else {
						colorFrequency[key] = {
							count: 1,
							rgb: [r, g, b],
						};
					}
				}

				// Trier les couleurs par fréquence
				const sortedColors = Object.values(
					colorFrequency
				).sort((a, b) => b.count - a.count);

				// Filtrer les couleurs similaires (éviter les doublons visuels)
				const distinctColors = filterSimilarColors(
					sortedColors,
					30
				);

				// Prendre les 6 premières couleurs distinctes ou compléter avec des couleurs génériques
				const colorEntries = distinctColors.slice(0, 6);

				// Compléter si nécessaire pour avoir 6 couleurs
				while (colorEntries.length < 6) {
					const index = colorEntries.length;
					const defaultColors = [
						[255, 100, 100], // Rouge clair
						[100, 255, 100], // Vert clair
						[100, 100, 255], // Bleu clair
						[255, 255, 100], // Jaune
						[255, 100, 255], // Magenta
						[100, 255, 255], // Cyan
					];
					colorEntries.push({
						count: 0,
						rgb: defaultColors[
							index %
								defaultColors.length
						],
					});
				}

				// Créer palette à partir des couleurs extraites
				const colorNames = [
					"Primary",
					"Secondary",
					"Tertiary",
					"Quaternary",
					"Quinary",
					"Senary",
				];
				const swatches: SwatchWithName[] =
					colorEntries.map((entry, index) => {
						const hexColor = rgbToHex(
							entry.rgb[0],
							entry.rgb[1],
							entry.rgb[2]
						);
						return {
							name: colorNames[index],
							color: hexColor,
						};
					});

				setPalette(swatches);

				if (swatches.length > 0) {
					setSelectedColor(
						convertToAllFormats(
							swatches[0].color
						)
					);
				}
			}
		};

		img.onerror = () => {
			console.error(
				"Erreur lors du chargement de l'image pour l'extraction des couleurs"
			);
			setError(true);
		};

		img.src = url;
	};

	// Filtrer les couleurs similaires (distance euclidienne)
	const filterSimilarColors = (
		colors: Array<{ count: number; rgb: number[] }>,
		threshold: number
	): Array<{ count: number; rgb: number[] }> => {
		const result: Array<{ count: number; rgb: number[] }> = [];

		for (const color of colors) {
			let isDuplicate = false;

			for (const uniqueColor of result) {
				const distance = Math.sqrt(
					Math.pow(
						color.rgb[0] -
							uniqueColor.rgb[0],
						2
					) +
						Math.pow(
							color.rgb[1] -
								uniqueColor
									.rgb[1],
							2
						) +
						Math.pow(
							color.rgb[2] -
								uniqueColor
									.rgb[2],
							2
						)
				);

				if (distance < threshold) {
					isDuplicate = true;
					break;
				}
			}

			if (!isDuplicate) {
				result.push(color);
				if (result.length >= 6) break;
			}
		}

		return result;
	};

	// Convertir RGB en HEX
	const rgbToHex = (r: number, g: number, b: number): string => {
		return (
			"#" +
			((1 << 24) | (r << 16) | (g << 8) | b)
				.toString(16)
				.slice(1)
		);
	};

	// Extraire la palette de couleurs au chargement ou changement d'URL
	useEffect(() => {
		if (!imageUrl) return;
		extractColors(imageUrl);
	}, [imageUrl, extractColors]);

	// Copier la couleur au format actuel
	const copyToClipboard = (color: Color) => {
		const valueToCopy = color[colorFormat];
		navigator.clipboard.writeText(valueToCopy);
		setCopiedColor(valueToCopy);

		// Réinitialiser l'état après 2 secondes
		setTimeout(() => {
			setCopiedColor(null);
		}, 2000);
	};

	if (palette.length === 0) {
		return (
			<div className="py-6">
				<div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
				<div className="grid grid-cols-3 gap-3">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-20 bg-gray-200 animate-pulse rounded"
						></div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-6">
				<p className="text-red-500">
					Failed to extract colors from image
				</p>
			</div>
		);
	}

	return (
		<div className="py-6">
			{/* Palette de couleurs */}
			<div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
				{palette.map((swatch, index) => (
					<button
						key={index}
						className={`h-16 rounded-md shadow-md transition-all hover:scale-105 ${
							selectedColor?.hex ===
							swatch.color
								? "ring-2 ring-primary"
								: ""
						}`}
						style={{
							backgroundColor:
								swatch.color,
						}}
						onClick={() =>
							setSelectedColor(
								convertToAllFormats(
									swatch.color
								)
							)
						}
						aria-label={`Select ${swatch.name} color`}
					/>
				))}
			</div>

			{/* Détails de la couleur sélectionnée */}
			{selectedColor && (
				<div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-3">
							<div
								className="w-12 h-12 rounded-full shadow-md"
								style={{
									backgroundColor:
										selectedColor.hex,
								}}
							/>
							<div>
								<h3 className="font-medium">
									Selected
									Color
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{palette.find(
										(
											p
										) =>
											p.color ===
											selectedColor.hex
									)
										?.name ||
										"Custom"}
								</p>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								variant={
									colorFormat ===
									"hex"
										? "default"
										: "outline"
								}
								onClick={() =>
									setColorFormat(
										"hex"
									)
								}
								className="text-xs"
							>
								HEX
							</Button>
							<Button
								variant={
									colorFormat ===
									"rgb"
										? "default"
										: "outline"
								}
								onClick={() =>
									setColorFormat(
										"rgb"
									)
								}
								className="text-xs"
							>
								RGB
							</Button>
							<Button
								variant={
									colorFormat ===
									"hsl"
										? "default"
										: "outline"
								}
								onClick={() =>
									setColorFormat(
										"hsl"
									)
								}
								className="text-xs"
							>
								HSL
							</Button>
						</div>
					</div>

					{/* Affichage et copie de la couleur */}
					<div className="mt-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 flex items-center">
						<div className="flex-grow px-3 py-2 text-sm font-mono overflow-auto">
							{
								selectedColor[
									colorFormat
								]
							}
						</div>
						<Button
							variant="ghost"
							className="h-full px-3 rounded-l-none"
							onClick={() =>
								copyToClipboard(
									selectedColor
								)
							}
						>
							{copiedColor ===
							selectedColor[
								colorFormat
							] ? (
								<CheckIcon className="h-4 w-4 text-green-500" />
							) : (
								<CopyIcon className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
