import { useState, useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Loader } from "../components/Spinner";
import ScrollToTop from "../components/scrollToTop";
import { motion } from "motion/react"
const animeKey = import.meta.env.VITE_ANIME_KEY;

const MostPopular = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${animeKey}category/most-popular?page=${pageCount}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setAnimeData(result.data.animes);
        setTotalPageCount(result.data.totalPages); // Update total pages
      } catch (error) {
        console.error("Error fetching most popular anime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, [pageCount]); // Refetch when pageCount changes

  const handleNextPage = () => {
    if (pageCount < totalPageCount) {
      setPageCount(pageCount + 1); // Increment pageCount to load next page
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
    }
  };

const SkeletonAnimeGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-4 sm:pt-32 sm:pl-2"
    >
      {Array(10) // Render 10 skeleton cards for a placeholder effect
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full h-[350px] bg-gray-900 animate-pulse rounded-lg"
          ></div>
        ))}
    </motion.div>
  );
};

const PageSkeleton = () => (
  <div className="bg-black min-h-screen md:pt-0 pt-[55px] pb-12">
    <SkeletonAnimeGrid />
  </div>
);

  return (
    <>
      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          <motion.div 
          initial={{ opacity: 0.2, y: 100 }}
          transition={{ duration: .5}}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-4 sm:pt-32 sm:pl-2">
            {animeData.map((anime) => (
              <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id} />
            ))}
          </motion.div>
          {pageCount < totalPageCount && (
            <div className="text-center mt-4 pb-8">
              <button
                onClick={handleNextPage}
                className="bg-pink-200 px-3 py-1 rounded text-black"
              >
                Next page
              </button>
            </div>
          )}
          <ScrollToTop />
        </>
      )}
    </>
  );
};

export default MostPopular;
