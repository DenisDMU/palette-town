"use client";
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const text = `Palette Town instantly connects you with unique color schemes inspired by the original 150 Pokémon, perfect for your design projects and creative adventures`;
const words = text.split(" ");
export default function Introduction() {
	const scrollTarget = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: scrollTarget,
		offset: ["start end", "end end"],
	});
	const [currentWord, setCurrentWord] = useState(0);
	const wordIndex = useTransform(
		scrollYProgress,
		[0, 1],
		[0, words.length]
	);

	useEffect(() => {
		wordIndex.on("change", (latest) => {
			setCurrentWord(latest);
		});
	}, [wordIndex]);

	return (
		<section className="py-28 lg:py-40">
			<div className="container max-w-5xl mx-auto ">
				<div className="sticky top-20 md:top-28 lg:top-40">
					<div className="flex justify-center">
						<div className="inline-flex border border-primary gap-2 text-primary uppercase px-3 py-1 rounded-full items-center">
							Why Palette Town?
						</div>
					</div>
					<div className="text-4xl md:text-6xl lg:text-7xl text-center font-medium mt-10">
						<span className="text-blue-300">
							Your design projects
							deserve better.
						</span>{" "}
						<span className=" ">
							{words.map(
								(
									word,
									wordIndex
								) => (
									<span
										key={
											wordIndex
										}
										className={twMerge(
											"transition duration-500 text-white/15",
											wordIndex <
												currentWord &&
												"text-white"
										)}
									>{`${word} `}</span>
								)
							)}
						</span>
						<span className="text-primary block">
							That&apos;s why we
							created Palette Town.
						</span>
					</div>
				</div>
				<div
					className="h-[150vh]"
					ref={scrollTarget}
				></div>
			</div>
		</section>
	);
}
