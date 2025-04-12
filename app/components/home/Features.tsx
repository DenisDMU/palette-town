import Tag from "./Tag";
import FeatCard from "./FeatCard";
import Image from "next/image";
import featCard1 from "@/public/feat-card/featcard1.jpg";
import featCard2 from "@/public/feat-card/featcard2.jpg";

const features = [
	"Original 150 Pokémon",
	"Color Harmonies",
	"Export Options",
	"Palette History",
	"Copy HEX/RGB/HSL",
	"Accessibility Ratings",
];

export default function Features() {
	return (
		<section className="container py-24 mx-auto">
			<div className="flex justify-center">
				<Tag>Features</Tag>
			</div>
			<h2 className="text-6xl font-medium text-center mt-6 text-blue-300-foreground max-w-2xl mx-auto">
				Find your next{" "}
				<span className="text-primary">Palette</span>
			</h2>
			<div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 lg:grid-cols-3">
				<FeatCard
					title="Nostalgic Color Inspiration"
					description="Discover unique color palettes based on your favorite Pokémon from the original 150"
					className="md:col-span-2 lg:col-span-1 group transition"
				>
					<div className="relative aspect-video">
						<Image
							src={featCard1}
							alt="Pokémon color palettes"
							className="w-full h-full object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-0"
							fill
						/>
						<Image
							src={featCard2}
							alt="Pokémon color palettes"
							className="w-full h-full object-cover rounded-lg opacity-0 transition-opacity duration-700 group-hover:opacity-100"
							fill
						/>
					</div>
				</FeatCard>
				<FeatCard
					title="No More Color Dilemmas"
					description="Find professional-quality color schemes for your design projects in seconds"
					className="md:col-span-2 lg:col-span-1 group"
				>
					<div className="aspect-video flex items-center justify-center relative overflow-hidden">
						<p className="text-3xl md:text-4xl font-extrabold text-white/20 group-hover:text-white/10 transition duration-500 text-center px-2">
							No need to spend hours
							creating the perfect{" "}
							<span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
								palette
							</span>{" "}
							anymore.
						</p>
						<video
							src="/feat-card/featgif.mp4"
							autoPlay
							loop
							muted
							playsInline
							className="absolute rounded-lg opacity-0 group-hover:opacity-100 transition duration-500 max-w-[90%] max-h-[90%] object-contain"
						/>
					</div>
				</FeatCard>
				<FeatCard
					title="Fun and Engaging"
					description="Explore color palettes in a fun and engaging way"
					className="md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto"
				>
					<div className="aspect-video flex items-center justify-center">
						<p className="text-4xl font-extrabold text-white/20 text-center">
							Discover{" "}
							<span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
								color palettes
							</span>{" "}
							in a fun and engaging
							way.
						</p>
					</div>
				</FeatCard>
			</div>
			<div className="mt-8 flex flex-wrap gap-3 justify-center">
				{features.map((feature) => (
					<div
						key={feature}
						className="bg-neutral-900 border border-white/10 inline-flex px-3 py-1.5 rounded-2xl items-center gap-3
                        md:px-5 md:py-2 hover:scale-105 duration-500 group"
					>
						<span
							className="bg-primary text-blue-300 size-5 rounded-full inline-flex items-center justify-center text-xl
                        group-hover:rotate-45 transition duration-500"
						>
							&#10038;
						</span>
						<span className="font-medium md:text-lg text-blue-300">
							{feature}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
