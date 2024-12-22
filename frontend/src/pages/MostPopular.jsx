import { useState, useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Loader } from "../components/Spinner";
import ScrollToTop from "../components/scrollToTop";

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-16 sm:pt-32 sm:pl-12">
            {animeData.map((anime) => (
              <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id} />
            ))}
          </div>
          {pageCount < totalPageCount && (
            <div className="text-center mt-4 mb-8">
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
