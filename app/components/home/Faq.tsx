"use client";
import { twMerge } from "tailwind-merge";
import Tag from "./Tag";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
	{
		question: "Is Palette Town free to use?",
		answer: "Yes, Palette Town is completely free to use. You can browse, generate, and export color palettes from all 150 original Pokémon without any cost.",
	},
	{
		question: "How do I find color palettes?",
		answer: "Simply enter a Pokémon's name in the search bar or browse our collection. Each Pokémon has its own unique color scheme based on its appearance in the games and anime.",
	},
	{
		question: "What export formats are available?",
		answer: "We support exporting in multiple formats including HEX, RGB, HSL, and CSS variables. You can also copy color codes directly to your clipboard or download palette files for design software.",
	},
	{
		question: "Which Pokémon are included?",
		answer: "Currently, Palette Town features all 150 original Pokémon from the first generation. Each one has a carefully curated color palette based on its distinctive appearance.",
	},
	{
		question: "How can I use these palettes in my projects?",
		answer: "Once you've found a palette you like, you can export the colors to your preferred format or copy the codes. The palettes work great for websites, illustrations, UI design, branding, and any other creative projects.",
	},
];

export default function Faq() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<section className="py-24">
			<div className="container  mx-auto">
				<div className="flex justify-center">
					<Tag>FAQ</Tag>
				</div>
				<h2 className="text-6xl font-medium mt-6 text-center text-blue-300 max-w-xl mx-auto">
					Questions? Find your{" "}
					<span className="text-primary">
						answers
					</span>
				</h2>
				<div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
					{faqs.map((faq, faqIndex) => (
						<div
							key={faq.question}
							className="bg-neutral-900 rounded-2xl border border-white/10 p-6"
						>
							<div
								className="flex justify-between items-center text-blue-300"
								onClick={() =>
									setSelectedIndex(
										faqIndex
									)
								}
							>
								<h3 className="font-medium">
									{
										faq.question
									}
								</h3>
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
									className={twMerge(
										"feather feather-plus text-primary flex-shrink-0 transition duration-300",
										selectedIndex ===
											faqIndex &&
											"rotate-45"
									)}
								>
									<line
										x1="12"
										y1="5"
										x2="12"
										y2="19"
									></line>
									<line
										x1="5"
										y1="12"
										x2="19"
										y2="12"
									></line>
								</svg>
							</div>
							<AnimatePresence>
								{selectedIndex ===
									faqIndex && (
									<motion.div
										initial={{
											height: 0,
											marginTop: 0,
										}}
										animate={{
											height: "auto",
											marginTop: 24,
										}}
										exit={{
											height: 0,
											marginTop: 0,
										}}
										className={twMerge(
											"overflow-hidden"
										)}
									>
										<p className="text-white/50">
											{
												faq.answer
											}
										</p>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
