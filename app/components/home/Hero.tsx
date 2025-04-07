import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="py-24 flex justify-center items-center w-full">
			<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
				<div className="flex justify-center">
					<div
						className="text-blue-300 inline-flex py-1 px-3 bg-gradient-to-r from-primary to-blue-400
                    rounded-full font-semibold"
					>
						🎲 Get the colors of the 150
						originals Pokemon.
					</div>
				</div>
				<h1 className="text-center text-primary text-6xl md:text-7xl font-medium mt-6">
					Palette Town
				</h1>
				<p className="text-center text-foreground/85 text-xl mt-8 max-w-2xl mx-auto">
					Finding the perfect color palette for
					your design project can be challenging.
					Balancing complementary hues and
					creating harmonious combinations often
					feels like an impossible quest. Palette
					Town is here to inspire you with unique
					color schemes based on the original 150
					Pokémon, bringing nostalgic vibes to
					your next creative adventure.
				</p>
				<form className="flex border border-primary/30 rounded-full p-2 mt-8 max-w-lg mx-auto">
					<input
						type="text"
						placeholder="Enter a pokémon name"
						className="bg-transparent px-4 text-foreground outline-none md:flex-1 w-full"
					/>
					<Button
						className="text-muted-foreground rounded-full whitespace-nowrap h-10"
						type="submit"
					>
						Catch the colors !
					</Button>
				</form>
			</div>
		</section>
	);
}
