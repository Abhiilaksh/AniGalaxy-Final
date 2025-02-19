import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimeCard } from "./AnimeCard";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
        <div className="relative pb-[56.25%] bg-gray-700"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-2 bg-gray-700 rounded w-full mt-2"></div>
        </div>
      </div>
    ))}
  </div>
);

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [animeDetails, setAnimeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchAnimeDetails = async (animeId) => {
      try {
        const response = await fetch(
          `https://aniwatch-api-git-main-abhiilakshs-projects.vercel.app/api/v2/hianime/anime/${animeId}`
        );
        if (!response.ok) throw new Error(`Failed to fetch anime ${animeId}`);
        const data = await response.json();
        
        return {
          id: animeId,
          title: data.data.anime.info.name,
          poster: data.data.anime.info.poster,
        };
      } catch (error) {
        console.error(`Error fetching details for anime ${animeId}:`, error);
        return null;
      }
    };

    const loadHistory = async () => {
      try {
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]").reverse();
        setWatchHistory(history);

        const animeIds = [...new Set(history.map((item) => item.animeId))];

        const animeData = await Promise.all(animeIds.map(fetchAnimeDetails));

        setAnimeDetails(
          animeData.reduce((acc, anime) => {
            if (anime) acc[anime.id] = anime;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your watch history?")) {
      localStorage.removeItem("watchHistory");
      setWatchHistory([]);
      setAnimeDetails({});
    }
  }, []);

  const paginatedHistory = useMemo(() => {
    return watchHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [watchHistory, currentPage]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Watch History</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-center mt-10">
        Error: {error}. Please try again later.
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return (
      <div className="text-white text-center mt-10">
        No watch history found. Start watching some anime!
      </div>
    );
  }

  return (
    <div className="container  px-2 py-8">
      <div className="flex justify-between items-center pl-4 mb-6">
        <h2 className="text-3xl font-bold text-white">Watch History</h2>
        <button
  onClick={clearHistory}
  className=" rounded px-4 py-2 bg-red-600/80  text-white rounded hover:bg-red-600 hover:bg-opacity-90 transition-colors"
>
  Clear History
</button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 ">
        {paginatedHistory.map((item, index) => (
          <AnimeCard
  key={index}
  title={animeDetails[item.animeId]?.title}
  image={animeDetails[item.animeId]?.poster}
  id={item.animeId}
  link={`/watch/${item.animeId}?ep=${item.episodeId}`}
/>
        ))}
      </div>

      {watchHistory.length > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-pink-500 rounded transition-colors ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600"
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {Math.ceil(watchHistory.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= watchHistory.length}
            className={`px-4 py-2 bg-pink-500 rounded transition-colors ${
              currentPage * itemsPerPage >= watchHistory.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-pink-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
