import { FAQSection, Hero } from "@/components";
import FilmSection from "@/components/home/film-section";

const trendingShows = [
  { id: 1, title: "Genie Wish", image: "/genie-wish-movie-cover.jpg" },
  { id: 2, title: "4 Rascals", image: "/4-rascals-family-comedy.jpg" },
  { id: 3, title: "The Witcher", image: "/the-witcher-fantasy-series.jpg" },
  { id: 4, title: "Survivor", image: "/survivor-reality-show.jpg" },
  { id: 5, title: "Mystery Show", image: "/mystery-thriller-series.jpg" },
]

const popularShows = [
  { id: 6, title: "Breaking Bad", image: "/breaking-bad.jpg" },
  { id: 7, title: "Stranger Things", image: "/stranger-things.jpg" },
  { id: 8, title: "The Crown", image: "/the-crown.jpg" },
  { id: 9, title: "Chernobyl", image: "/chernobyl.jpg" },
  { id: 10, title: "Sherlock", image: "/sherlock.jpg" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <FilmSection title="Trending now" shows={trendingShows} />
      <FilmSection title="Popular picks" shows={popularShows} />
      <FAQSection />
    </main>
  )
}
