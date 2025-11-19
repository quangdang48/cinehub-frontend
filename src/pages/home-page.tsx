"use client";

import { FAQSection, Hero, FilmSection } from "@/components";
import { FilmService } from "@/services/FilmService";
import { mapFilmToShow } from "@/components/home/film-section";

import { useState, useEffect } from "react";

export default function Home() {
  // -----------------------
  // Most viewed
  // -----------------------
  const [mostViewedShows, setMostViewedShows] = useState<any[]>([]);
  const [pageMostViewed, setPageMostViewed] = useState(1);  
  const [loadingMostViewed, setLoadingMostViewed] = useState(false);
  const PAGE_SIZE = 10;

  async function loadMostViewed(pageNumber: number) {
    setLoadingMostViewed(true);
    try {
      const res = await FilmService.filmControllerGetMostViewedV1(
        pageNumber,
        PAGE_SIZE
      );
      const shows = mapFilmToShow(res.data ?? []);
      if (pageNumber === 1) {
        setMostViewedShows(shows);
      } else {
        setMostViewedShows(prev => [...prev, ...shows]);
      }
    } catch (error) {
      console.error("Load most viewed error:", error);
    } finally {
      setLoadingMostViewed(false);
    }
  }

  // -----------------------
  // Latest releases
  // -----------------------
  const [latestShows, setLatestShows] = useState<any[]>([]);
  const [pageLatest, setPageLatest] = useState(1);  
  const [loadingLatest, setLoadingLatest] = useState(false);

  async function loadLatestReleases(pageNumber: number) {
    setLoadingLatest(true);
    try {
      const res = await FilmService.filmControllerGetByReleaseV1(
        pageNumber,
        PAGE_SIZE,
        'DESC' // sắp xếp từ mới nhất
      );
      const shows = mapFilmToShow(res.data ?? []);
      if (pageNumber === 1) {
        setLatestShows(shows);
      } else {
        setLatestShows(prev => [...prev, ...shows]);
      }
    } catch (error) {
      console.error("Load latest releases error:", error);
    } finally {
      setLoadingLatest(false);
    }
  }

  useEffect(() => {
    loadMostViewed(1);
    loadLatestReleases(1);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Hero />

      <FilmSection
        title="Most viewed"
        shows={mostViewedShows}
        loading={loadingMostViewed}
        onNext={() => {
          if (loadingMostViewed) return;
          setPageMostViewed(prev => {
            const nextPage = prev + 1;
            loadMostViewed(nextPage);
            return nextPage;
          });
        }}
      />

      <FilmSection
        title="Latest releases"
        shows={latestShows}
        loading={loadingLatest}
        onNext={() => {
          if (loadingLatest) return;
          setPageLatest(prev => {
            const nextPage = prev + 1;
            loadLatestReleases(nextPage);
            return nextPage;
          });
        }}
      />

      <FAQSection />
    </main>
  );
}
