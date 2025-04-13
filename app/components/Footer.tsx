const footerLinks = [
	{ href: "https://github.com/DenisDMU", label: "MY GITHUB" },
	{ href: "#", label: "HOME" },
];

export default function Footer() {
	return (
		<section className="py-16">
			<div className="container">
				<div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
					<div></div>
					<div>
						<nav className="flex gap-6">
							{footerLinks.map(
								(link) => (
									<a
										href={
											link.href
										}
										key={
											link.label
										}
										className="text-black/50 text-sm"
										target="_blank"
										rel="noopener noreferrer"
									>
										{
											link.label
										}
									</a>
								)
							)}
						</nav>
					</div>
				</div>
			</div>
		</section>
	);
}
