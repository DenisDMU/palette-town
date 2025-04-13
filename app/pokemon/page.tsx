import { Suspense } from "react";
import PokemonClient from "./PokemonClient";

export default function PokemonPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center min-h-screen">
					Loading...
				</div>
			}
		>
			<PokemonClient />
		</Suspense>
	);
}
