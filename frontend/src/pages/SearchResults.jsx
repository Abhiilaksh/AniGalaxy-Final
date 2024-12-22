import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Heading } from "../components/Heading";
import { Loader } from "../components/Spinner";
import ScrollToTop from "../components/scrollToTop";

const animeKey = import.meta.env.VITE_ANIME_KEY;

export const SearchResult = () => {
  const { query } = useParams();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const navigate = useNavigate(); // To navigate to next page

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${animeKey}search?q=${query}&page=${pageCount}`);
      const data = await response.json();
      setResult(data.data.animes);
      setTotalPageCount(data.data.totalPages); // Update total pages
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [query, pageCount]); // Re-fetch when query or page changes

  const handleNextPage = () => {
    if (pageCount < totalPageCount) {
      const nextPage = pageCount + 1;
      setPageCount(nextPage);
      navigate(`/search/${query}?page=${nextPage}`); // Update URL with new page
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="pt-16 sm:pt-24 flex justify-center">
            <Heading label={`Search results for ${query} :`} size={"2xl"} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-16 sm:pt-24 sm:pl-24">
            {result.map((anime) => (
              <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id} />
            ))}
            <ScrollToTop />
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
        </>
      )}
    </>
  );
};
