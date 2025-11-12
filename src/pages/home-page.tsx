import { FAQSection, FeaturesSection, Hero, TrendingSection } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <TrendingSection />
      <FeaturesSection />
      <FAQSection />
    </main>
  )
}
