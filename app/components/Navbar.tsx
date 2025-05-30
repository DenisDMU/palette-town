"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [pikachuSprite, setPikachuSprite] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		const fetchPikachuSprite = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					"https://pokeapi.co/api/v2/pokemon/25"
				);
				const data = await response.json();
				setPikachuSprite(data.sprites.front_default);
			} catch (error) {
				console.error(
					"Error fetching Pikachu sprite:",
					error
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPikachuSprite();
	}, []);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<>
			<section className="py-4 lg:py-8 flex justify-center fixed w-full top-0 z-50">
				<div className="container max-w-5xl">
					<div className="border border-primary/30 rounded-[27px] md:rounded-full bg-background/80 backdrop-blur shadow-sm">
						<div className="grid grid-cols-2 lg:grid-cols-3 p-2 px-4 md:pr-2 items-center">
							<div>
								{isLoading ? (
									<div className="h-9 w-9 rounded-full bg-primary/20 animate-pulse"></div>
								) : (
									<Image
										src={
											pikachuSprite ||
											""
										}
										alt="Pikachu Logo"
										width={
											40
										}
										height={
											40
										}
										className="h-9 md:h-auto w-auto"
									/>
								)}
							</div>
							<div className="lg:flex justify-center items-center hidden w-full">
								<nav className="flex gap-6 font-medium text-foreground">
									<Link
										href="/"
										className="hover:text-primary transition-colors"
									>
										Home
									</Link>
									<Link
										href="/pokemon"
										className="hover:text-primary transition-colors"
									>
										Pokemon
									</Link>
									<Link
										href="/api"
										className="hover:text-primary transition-colors"
									>
										API
									</Link>
									<Link
										href="/docs"
										className="hover:text-primary transition-colors"
									>
										Docs
									</Link>
								</nav>
							</div>
							<div className="flex justify-end gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="feather feather-menu text-primary lg:hidden"
									onClick={() =>
										setIsOpen(
											!isOpen
										)
									}
								>
									<line
										x1="3"
										y1="6"
										x2="21"
										y2="6"
										className={twMerge(
											"origin-left transition",
											isOpen &&
												"rotate-45 -translate-y-1"
										)}
									></line>
									<line
										x1="3"
										y1="12"
										x2="21"
										y2="12"
										className={twMerge(
											"transition",
											isOpen &&
												"opacity-0"
										)}
									></line>
									<line
										x1="3"
										y1="18"
										x2="21"
										y2="18"
										className={twMerge(
											"origin-left transition",
											isOpen &&
												"-rotate-45 translate-y-1"
										)}
									></line>
								</svg>
							</div>
						</div>
						<AnimatePresence>
							{isOpen && (
								<motion.nav
									initial={{
										height: 0,
									}}
									animate={{
										height: "auto",
									}}
									exit={{
										height: 0,
									}}
									className="text-foreground overflow-hidden"
								>
									<div className="flex flex-col items-center gap-4 py-4">
										<Link
											href="/"
											className="hover:text-primary transition-colors"
										>
											Home
										</Link>
										<Link
											href="/pokemon"
											className="hover:text-primary transition-colors"
										>
											Pokemons
										</Link>
										<Link
											href="/api"
											className="hover:text-primary transition-colors"
										>
											API
										</Link>
										<Link
											href="/docs"
											className="hover:text-primary transition-colors"
										>
											Docs
										</Link>
									</div>
								</motion.nav>
							)}
						</AnimatePresence>
					</div>
				</div>
			</section>
			<div className="pb-[86px] md:pb-[98px] lg:pb-[130px]"></div>
		</>
	);
}
