import PokemonDetailClient from "./PokemonDetail";

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = await params;

	return <PokemonDetailClient id={id} />;
}
