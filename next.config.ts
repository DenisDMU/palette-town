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
	// Keep any other existing configuration options
};

export default nextConfig;
