"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Documentation() {
	const [randomSprites, setRandomSprites] = useState<
		{
			id: number;
			x: number;
			y: number;
			scale: number;
			rotation: number;
		}[]
	>([]);

	// Generate random Pokemon sprites for decoration
	useEffect(() => {
		const sprites = [];
		for (let i = 0; i < 25; i++) {
			const id = Math.floor(Math.random() * 151) + 1;
			const x = Math.random() * 95; // % from left
			const y = Math.random() * 95; // % from top
			const scale = 0.7 + Math.random() * 0.8; // Larger scale
			const rotation = Math.random() * 40 - 20; // -20 to +20 degrees
			sprites.push({ id, x, y, scale, rotation });
		}
		setRandomSprites(sprites);
	}, []);

	return (
		<div className="min-h-screen py-12 px-4 sm:px-6 relative overflow-hidden">
			{/* Decorative sprites - more visible now */}
			{randomSprites.map((sprite, index) => (
				<div
					key={index}
					className="absolute opacity-20 hover:opacity-40 transition-opacity duration-300 pointer-events-none"
					style={{
						left: `${sprite.x}%`,
						top: `${sprite.y}%`,
						transform: `rotate(${sprite.rotation}deg) scale(${sprite.scale})`,
						zIndex: 0,
					}}
				>
					<Image
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sprite.id}.png`}
						width={80}
						height={80}
						alt="Pokemon sprite"
						className="pixelated"
						style={{
							imageRendering:
								"pixelated",
						}}
					/>
				</div>
			))}

			{/* PDF-like document */}
			<div className="max-w-4xl mx-auto bg-card text-card-foreground rounded-lg shadow-xl border border-muted relative z-10">
				{/* Header */}
				<div className="border-b border-muted px-8 py-6 flex justify-between items-center">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-destructive"></div>
						<div className="h-3 w-3 rounded-full bg-primary"></div>
						<div className="h-3 w-3 rounded-full bg-accent"></div>
					</div>
					<div className="text-sm text-muted-foreground">
						palette-town.documentation.pdf
					</div>
				</div>

				{/* Content */}
				<div className="px-8 py-6 prose prose-sm max-w-none">
					<div className="flex justify-center mb-6">
						<Image
							src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
							width={120}
							height={120}
							alt="Pikachu"
							className="rounded-lg shadow-md"
						/>
					</div>

					<h1 className="text-4xl font-bold text-center mb-8 text-primary">
						Palette Town Project
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
						<div className="md:col-span-8">
							<h2 className="text-2xl font-bold mb-4">
								Project Overview
							</h2>
							<p>
								Palette Town is
								a project born
								out of my
								admiration for
								the incredible
								<a
									href="https://pokeapi.co/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent font-medium"
								>
									{" "}
									PokeAPI{" "}
								</a>
								and their
								comprehensive
								Pokemon data. I
								want to express
								my sincere
								gratitude to
								everyone who has
								contributed to
								this incredible
								resource.
							</p>

							<p>
								I created this
								project as a
								simple yet
								effective way to
								showcase my
								approach to
								design and
								development.
								While working
								with Pokemon
								data is fun, my
								main goal was to
								build a clean,
								functional
								application that
								demonstrates how
								I approach UI/UX
								design and
								frontend
								implementation.
							</p>

							<p>
								This project
								also served as
								an excellent
								opportunity to
								deepen my
								understanding of
								Next.js and
								TypeScript.
								Building both a
								frontend
								interface and a
								functional API
								allowed me to
								explore Next.js
								features in a
								practical,
								hands-on way.
							</p>

							<h2 className="text-2xl font-bold mt-8 mb-4">
								The SaaS-Style
								Landing Page
							</h2>
							<p>
								You might notice
								that the landing
								page has a very
								&quot;SaaS&quot;
								(Software as a
								Service) look to
								it. This was
								intentional—I
								find it somewhat
								amusing how
								similar most
								SaaS product
								websites look
								these days. The
								colorful
								gradients,
								floating
								elements, and
								standardized
								layout are
								almost a cliché
								at this point,
								which I find
								delightfully
								kitschy.
								Consider it a
								playful nod to
								current web
								design trends!
							</p>

							<h2 className="text-2xl font-bold mt-8 mb-4">
								Features
							</h2>
							<ul className="list-disc ml-6 space-y-2">
								<li>
									<span className="font-medium">
										Pokémon
										Browsing:
									</span>{" "}
									Browse
									through
									the
									original
									151
									Pokémon
									with
									their
									sprites
									and
									types
								</li>
								<li>
									<span className="font-medium">
										Color
										Extraction:
									</span>{" "}
									Automatic
									extraction
									of
									primary
									and
									secondary
									colors
									based on
									Pokémon
									types
								</li>
								<li>
									<span className="font-medium">
										Detailed
										Views:
									</span>{" "}
									View
									detailed
									information
									about
									each
									Pokémon
									with
									their
									stats,
									descriptions,
									and more
								</li>
								<li>
									<span className="font-medium">
										Copy
										CSS:
									</span>{" "}
									Easily
									copy CSS
									code
									snippets
									for
									using
									the
									color
									palettes
									in your
									own
									projects
								</li>
								<li>
									<span className="font-medium">
										API
										Access:
									</span>{" "}
									Access
									the
									color
									data
									through
									our API
									for
									integration
									with
									other
									projects
								</li>
							</ul>
						</div>

						<div className="md:col-span-4">
							<div className="bg-muted p-4 rounded-lg">
								<h3 className="font-bold text-lg mb-2">
									Quick
									Facts
								</h3>
								<dl className="space-y-2">
									<div>
										<dt className="font-medium">
											Pokémon
											Covered
										</dt>
										<dd>
											151
											(Gen
											1)
										</dd>
									</div>
									<div>
										<dt className="font-medium">
											Color
											Formats
										</dt>
										<dd>
											HEX,
											RGB,
											RGBA
										</dd>
									</div>
									<div>
										<dt className="font-medium">
											Data
											Source
										</dt>
										<dd>
											PokeAPI
										</dd>
									</div>
									<div>
										<dt className="font-medium">
											Framework
										</dt>
										<dd>
											Next.js
										</dd>
									</div>
								</dl>
							</div>

							<div className="mt-6 bg-primary/10 p-4 rounded-lg border border-primary/20">
								<h3 className="font-bold text-lg mb-2">
									API
									Documentation
								</h3>
								<p className="text-sm mb-3">
									Access
									our
									comprehensive
									API
									documentation
									to
									integrate
									Pokémon
									color
									palettes
									into
									your
									projects.
								</p>
								<Link
									href="/api"
									passHref
								>
									<Button className="w-full">
										View
										API
										Docs
									</Button>
								</Link>
							</div>
						</div>
					</div>

					<h2 className="text-2xl font-bold mt-8 mb-4">
						Learning Experience
					</h2>
					<p>
						Working on Palette Town has been
						an invaluable learning
						experience. By creating this
						project, I&apos;ve gained
						hands-on experience with:
					</p>

					<ul className="list-disc ml-6 space-y-2 mt-4">
						<li>
							<span className="font-medium">
								Next.js API
								Routes:
							</span>{" "}
							Building a proper API
							alongside the frontend
							application
						</li>
						<li>
							<span className="font-medium">
								TypeScript:
							</span>{" "}
							Using strong typing to
							create more robust,
							maintainable code
						</li>
						<li>
							<span className="font-medium">
								UI Design
								Principles:
							</span>{" "}
							Creating responsive,
							accessible interfaces
						</li>
						<li>
							<span className="font-medium">
								Data
								Manipulation:
							</span>{" "}
							Processing and
							transforming complex API
							responses
						</li>
					</ul>

					<div className="bg-secondary/20 p-6 rounded-lg mt-8 border border-secondary/30">
						<h2 className="text-2xl font-bold mb-4">
							How to Use
						</h2>
						<ol className="list-decimal ml-6 space-y-3">
							<li>
								<span className="font-medium">
									Browse
									Pokémon:
								</span>{" "}
								Navigate through
								the list of
								Pokémon on the
								main page
							</li>
							<li>
								<span className="font-medium">
									View
									Details:
								</span>{" "}
								Click on a
								Pokémon card to
								see detailed
								information and
								color palette
							</li>
							<li>
								<span className="font-medium">
									Copy
									Colors:
								</span>{" "}
								Use the
								&quot;Copy
								CSS&quot; button
								to get
								ready-to-use CSS
								code
							</li>
							<li>
								<span className="font-medium">
									API
									Integration:
								</span>{" "}
								For developers,
								use our API
								endpoints to
								fetch color data
								programmatically
							</li>
						</ol>
					</div>

					<h2 className="text-2xl font-bold mt-8 mb-4">
						Technical Implementation
					</h2>
					<p>
						Palette Town is built with
						Next.js, leveraging its API
						routes feature to create both
						the frontend interface and the
						color API. The application
						fetches data from PokeAPI and
						processes it to extract color
						information based on Pokémon
						types.
					</p>

					<p>
						For each Pokémon, the primary
						color is determined by its main
						type, while the secondary color
						is either based on its secondary
						type or calculated as a
						complementary color. This
						approach ensures visually
						appealing and thematically
						consistent color palettes.
					</p>

					<div className="mt-12 text-center text-sm text-muted-foreground">
						<p>
							© 2025 Palette Town
							Project • Pokémon and
							Pokémon character names
							are trademarks of
							Nintendo
						</p>
						<p className="mt-1">
							This is a fan project
							and is not affiliated
							with or endorsed by
							Nintendo, Game Freak, or
							The Pokémon Company
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-muted px-8 py-4 flex justify-between items-center">
					<div>
						<Link href="/" passHref>
							<Button
								variant="ghost"
								size="sm"
							>
								Return to Home
							</Button>
						</Link>
					</div>
					<div className="text-sm text-muted-foreground">
						Page 1 of 1
					</div>
				</div>
			</div>
		</div>
	);
}
