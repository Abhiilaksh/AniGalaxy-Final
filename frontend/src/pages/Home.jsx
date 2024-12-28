import React, { useEffect, useState } from "react";
import SlideShow from "../components/Carousel1";
import { Loader } from "../components/Spinner";
import ScrollToTop from "../components/scrollToTop";
import { AnimeSection } from "../components/AnimeSection";
const animeKey = import.meta.env.VITE_ANIME_KEY;

export const Home = () => {
  const [slide, setSlide] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`${animeKey}home`);
        
        if (!response.ok) {
          throw new Error('Server response was not ok');
        }
        
        const data = await response.json();
        
        // Check if we have valid data
        if (!data?.data?.spotlightAnimes || !data?.data?.trendingAnimes || !data?.data?.latestEpisodeAnimes) {
          throw new Error('Invalid data structure received');
        }

        setSlide(data.data.spotlightAnimes);
        setTrending(data.data.trendingAnimes);
        setLatest(data.data.latestEpisodeAnimes);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen md:pt-0 pt-[55px] pb-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen md:pt-0 pt-[55px] pb-12 flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded-lg max-w-lg mx-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h3 className="text-lg font-semibold">Server Error</h3>
          </div>
          <p className="text-gray-200">
            Unable to connect to the server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black md:pt-0 pt-[55px] pb-12">
      <SlideShow animeData={slide} />
      <AnimeSection title="Trending Anime" animeData={trending} />
      <AnimeSection title="Latest Episodes" animeData={latest} />
      <ScrollToTop />
    </div>
  );
};