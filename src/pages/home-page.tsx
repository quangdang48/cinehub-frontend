import { Footer } from "../components/common/Footer";
import FAQSection from "../components/home/faq-section";
import FeaturesSection from "../components/home/features-section";
import Header from "../components/home/header";
import Hero from "../components/home/hero";
import TrendingSection from "../components/home/trending-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <div className="relative z-10">
        <TrendingSection />
        <FeaturesSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  )
}
