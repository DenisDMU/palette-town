const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "/PokeAPI/sprites/**",
			},
		],
	},

	// Ajouter cache-control aux ressources statiques
	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
				],
			},
			{
				// Mettre en cache les images statiques
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
					},
				],
			},
		];
	},
};

export default nextConfig;
