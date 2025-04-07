import Footer from "./components/Footer";
import Adventures from "./components/home/Pokemon";
import Banner from "./components/home/Banner";
import Faq from "./components/home/Faq";
import Features from "./components/home/Features";
import Hero from "./components/home/Hero";
import Introduction from "./components/home/Introduction";
import LogoSection from "./components/home/LogoSection";

export default function Home() {
	return (
		<>
			<Hero />
			<LogoSection />
			<Introduction />
			<Features />
			<Adventures />
			<Faq />
			<Banner />
			<Footer />
		</>
	);
}
