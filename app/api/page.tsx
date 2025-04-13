"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Code } from "lucide-react";
import Link from "next/link";

export default function ApiDocs() {
	const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(
		null
	);
	const [origin, setOrigin] = useState<string>("");

	// Mettre à jour l'origine après le montage du composant
	useEffect(() => {
		setOrigin(window.location.origin);
	}, []);

	// Pokéballs différentes pour l'animation
	const pokeballs = [
		"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
		"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png",
		"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png",
		"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
		"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png",
	];

	const endpoints = [
		{
			name: "GET /api/pokemon/:id",
			description: "Get a Pokémon with its color palette",
			example: "/api/pokemon/25", // Pikachu
			response: `{
  "id": 25,
  "name": "pikachu",
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "official_artwork": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  "types": ["electric"],
  "colors": {
    "primary": "#F8D030",
    "secondary": "#A1871F",
    "text": "#000000"
  },
  "css": {
    "primaryClass": ".pokemon-pikachu-primary { background-color: #F8D030; color: #000000; }",
    "secondaryClass": ".pokemon-pikachu-secondary { background-color: #A1871F; }",
    "gradientClass": ".pokemon-pikachu-gradient { background: linear-gradient(to right, #F8D030, #A1871F); }"
  },
  "cssVariables": "
--pokemon-pikachu-primary: #F8D030;
--pokemon-pikachu-secondary: #A1871F;
--pokemon-pikachu-text: #000000;"
}`,
		},
		{
			name: "GET /api/colors/:id",
			description: "Get detailed color formats for a Pokémon",
			example: "/api/colors/25", // Pikachu
			response: `{
  "name": "pikachu",
  "primary": {
    "hex": "#F8D030",
    "rgb": "rgb(248, 208, 48)",
    "rgba": "rgba(248, 208, 48, 1)",
    "r": 248,
    "g": 208,
    "b": 48
  },
  "secondary": {
    "hex": "#A1871F",
    "rgb": "rgb(161, 135, 31)",
    "rgba": "rgba(161, 135, 31, 1)",
    "r": 161,
    "g": 135,
    "b": 31
  },
  "text": {
    "hex": "#000000",
    "rgb": "rgb(0, 0, 0)",
    "rgba": "rgba(0, 0, 0, 1)",
    "r": 0,
    "g": 0,
    "b": 0
  }
}`,
		},
		{
			name: "GET /api/colors",
			description: "Get all Pokémon type colors",
			example: "/api/colors",
			response: `{
  "types": [
    {
      "type": "normal",
      "color": {
        "hex": "#A8A878",
        "rgb": "rgb(168, 168, 120)",
        "r": 168,
        "g": 168,
        "b": 120
      },
      "textColor": "#000000"
    },
    {
      "type": "fire",
      "color": {
        "hex": "#F08030",
        "rgb": "rgb(240, 128, 48)",
        "r": 240,
        "g": 128,
        "b": 48
      },
      "textColor": "#FFFFFF"
    },
    // ... other types
  ],
  "count": 18
}`,
		},
	];

	return (
		<div className="container mx-auto px-4 py-8 sm:py-12">
			{/* Pokéballs qui tournent - adaptées pour mobile */}
			<div className="flex justify-center mb-6 sm:mb-10 space-x-2 sm:space-x-4">
				{pokeballs.map((ball, index) => (
					<div
						key={index}
						className={`relative w-8 h-8 sm:w-12 sm:h-12 animate-bounce`}
						style={{
							animationDuration: `${
								1 + index * 0.2
							}s`,
							animationDelay: `${
								index * 0.1
							}s`,
						}}
					>
						<div
							className="animate-spin"
							style={{
								animationDuration: `${
									3 +
									index
								}s`,
							}}
						>
							<Image
								src={ball}
								alt={`Pokéball ${
									index +
									1
								}`}
								width={48}
								height={48}
								className="object-contain w-8 h-8 sm:w-12 sm:h-12"
							/>
						</div>
					</div>
				))}
			</div>

			<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-1 sm:mb-2">
				Palette Town API
			</h1>
			<p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12 px-2">
				Access Pokémon color palettes for your projects
			</p>

			<div className="grid md:grid-cols-2 gap-4 sm:gap-8">
				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
					<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
						Endpoints
					</h2>
					<div className="space-y-3 sm:space-y-4">
						{endpoints.map((endpoint) => (
							<div
								key={
									endpoint.name
								}
								className={`border rounded-lg p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors
                  ${
				selectedEndpoint === endpoint.name
					? "border-blue-500 bg-blue-50"
					: "border-gray-200"
			}`}
								onClick={() =>
									setSelectedEndpoint(
										endpoint.name
									)
								}
							>
								<h3 className="text-base sm:text-lg font-semibold text-blue-600 break-words">
									{
										endpoint.name
									}
								</h3>
								<p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
									{
										endpoint.description
									}
								</p>
								<div className="mt-2 sm:mt-3">
									<span className="text-xs sm:text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded break-all">
										Example:{" "}
										{
											endpoint.example
										}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
					<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center">
						<Code
							className="mr-2"
							size={20}
						/>
						Response Example
					</h2>

					{selectedEndpoint ? (
						<>
							<div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-auto max-h-64 sm:max-h-96">
								<pre className="text-green-400 font-mono text-xs sm:text-sm whitespace-pre-wrap">
									{endpoints.find(
										(
											e
										) =>
											e.name ===
											selectedEndpoint
									)
										?.response ||
										"Select an endpoint"}
								</pre>
							</div>

							<div className="mt-3 sm:mt-4">
								<Button
									onClick={() => {
										const endpoint =
											endpoints.find(
												(
													e
												) =>
													e.name ===
													selectedEndpoint
											);
										if (
											endpoint
										) {
											window.open(
												`${origin}${endpoint.example}`,
												"_blank"
											);
										}
									}}
									className="w-full text-sm sm:text-base py-1 sm:py-2"
								>
									Try it
								</Button>
							</div>
						</>
					) : (
						<div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
							<p className="text-sm sm:text-base text-center px-4">
								Select an
								endpoint to see
								example response
							</p>
						</div>
					)}
				</div>
			</div>

			<div className="mt-8 sm:mt-12 bg-white rounded-lg shadow-md p-4 sm:p-6">
				<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
					Usage Examples
				</h2>

				<div className="mb-4 sm:mb-6">
					<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
						Fetch with JavaScript
					</h3>
					<div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-auto text-xs sm:text-sm">
						<pre className="text-blue-400 font-mono whitespace-pre-wrap sm:whitespace-pre overflow-x-auto">
							{`// Get Pikachu's colors
fetch('${origin}/api/pokemon/25')
  .then(response => response.json())
  .then(data => {
    // Use the color data
    document.body.style.backgroundColor = data.colors.primary;
    document.body.style.color = data.colors.text;
    console.log(data);
  });`}
						</pre>
					</div>
				</div>

				<div className="mb-4 sm:mb-6">
					<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
						Use in CSS
					</h3>
					<div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-auto text-xs sm:text-sm">
						<pre className="text-blue-400 font-mono whitespace-pre-wrap sm:whitespace-pre overflow-x-auto">
							{`/* Add this to your CSS */
.pikachu-theme {
  --primary-color: #F8D030;
  --secondary-color: #A1871F;
  --text-color: #000000;
  
  background-color: var(--primary-color);
  color: var(--text-color);
}

.pikachu-theme .accent {
  background-color: var(--secondary-color);
}`}
						</pre>
					</div>
				</div>

				<div>
					<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
						React Component Example
					</h3>
					<div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-auto text-xs sm:text-sm">
						<pre className="text-blue-400 font-mono whitespace-pre-wrap sm:whitespace-pre overflow-x-auto">
							{`import { useState, useEffect } from 'react';

function PokemonTheme({ pokemonId, children }) {
  const [colors, setColors] = useState(null);
  
  useEffect(() => {
    fetch(\`${origin}/api/colors/\${pokemonId}\`)
      .then(res => res.json())
      .then(data => setColors(data))
      .catch(err => console.error('Failed to load colors:', err));
  }, [pokemonId]);
  
  if (!colors) return <div>Loading theme...</div>;
  
  return (
    <div style={{ 
      backgroundColor: colors.primary.hex,
      color: colors.text.hex,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: \`0 4px 6px \${colors.secondary.rgba.replace('1)', '0.3)')}\`
    }}>
      {children}
    </div>
  );
}`}
						</pre>
					</div>
				</div>
			</div>

			<div className="mt-6 sm:mt-8 text-center">
				<Link href="/" passHref>
					<Button
						variant="outline"
						className="text-sm sm:text-base"
					>
						Return to Palette Town
					</Button>
				</Link>
			</div>
		</div>
	);
}
