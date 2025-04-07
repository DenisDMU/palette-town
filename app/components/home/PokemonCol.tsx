"use client";
import { twMerge } from "tailwind-merge";
import { type AdventureType } from "./Pokemon";
import Image from "next/image";
import { motion } from "framer-motion";
import { Fragment } from "react";

export default function AdventureCol(props: {
	adventures: AdventureType;
	className?: string;
	reverse?: boolean;
}) {
	const { adventures, className, reverse } = props;
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
			{Array.from({ length: 2 }).map((_, i) => (
				<Fragment key={i}>
					{adventures.map((adventure) => (
						<div
							key={adventure.name + i}
							className="bg-neutral-900 border border-white/10
                        rounded-3xl p-6"
						>
							<div className="flex justify-center">
								<Image
									src={
										adventure.icon
									}
									alt={
										adventure.name
									}
									width={
										96
									}
									height={
										96
									}
									className="size-24 object-contain"
								/>
							</div>
							<h3 className="text-3xl text-center mt-6">
								{adventure.name}
							</h3>
							<p className="text-center text-white/50 mt-2">
								{
									adventure.description
								}
							</p>
						</div>
					))}
				</Fragment>
			))}
		</motion.div>
	);
}
