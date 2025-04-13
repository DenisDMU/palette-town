"use client";
import { twMerge } from "tailwind-merge";
import { type AdventureType } from "./Pokemon";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AdventureCol(props: {
	adventures: AdventureType;
	className?: string;
	reverse?: boolean;
}) {
	const { adventures, className, reverse } = props;

	// Dupliquer le tableau d'aventures pour l'animation infinie
	// mais avec des clés uniques pour chaque élément
	const duplicatedAdventures = [
		...adventures.map((adventure) => ({
			...adventure,
			id: `first-${adventure.name}`,
		})),
		...adventures.map((adventure) => ({
			...adventure,
			id: `second-${adventure.name}`,
		})),
	];

	return (
		<motion.div
			initial={{
				y: reverse ? "-50%" : 0,
			}}
			animate={{
				y: reverse ? 0 : "-50%",
			}}
			transition={{
				duration: 15,
				repeat: Infinity,
				ease: "linear",
			}}
			className={twMerge(
				"flex flex-col gap-4 pb-4",
				className
			)}
		>
			{duplicatedAdventures.map((adventure) => (
				<div
					key={adventure.id}
					className="bg-neutral-900 border border-white/10
                    rounded-3xl p-6"
				>
					<div className="flex justify-center">
						<Image
							src={adventure.icon}
							alt={adventure.name}
							width={96}
							height={96}
							className="size-24 object-contain"
						/>
					</div>
					<h3 className="text-3xl text-center mt-6">
						{adventure.name}
					</h3>
					<p className="text-center text-white/50 mt-2">
						{adventure.description}
					</p>
				</div>
			))}
		</motion.div>
	);
}
