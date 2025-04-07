const footerLinks = [
	{ href: "#", label: "More informations" },
	{ href: "#", label: "MIT" },
	{ href: "#", label: "FAQ" },
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
										className="text-white/50 text-sm"
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
