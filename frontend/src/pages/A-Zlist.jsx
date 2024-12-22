import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Loader } from "../components/Spinner";  // Assuming you have a Loader component
import ScrollToTop from "../components/scrollToTop";
import { Heading } from "../components/Heading";
const animeKey = import.meta.env.VITE_ANIME_KEY;

export const AZList = () => {
  const { alpha } = useParams();
  const [pageCount, setPageCount] = useState(1);
  const [totalPageCount, setTotalCount] = useState(0);
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to track if data is being fetched
  const navigate = useNavigate(); // To programmatically change the route

  const url = `${animeKey}azlist/${alpha}?page=${pageCount}`;
  console.log(url);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true); // Set loading to true when fetching starts
      const response = await fetch(url);
      const data = await response.json();
      setAnimeData(data.data.animes);
      setTotalCount(data.data.totalPages);
      setLoading(false); // Set loading to false when fetching is complete
    };
    fetchAnime();
  }, [alpha, pageCount]); // Dependency on pageCount to refetch data when the page changes

  const handleNextPage = () => {
    if (pageCount < totalPageCount) {
      const nextPage = pageCount + 1;
      setPageCount(nextPage);
      // Update the URL to navigate to the next page
      navigate(`/a-z/${alpha}?page=${nextPage}`);
      // Scroll to the top of the page after button click
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
     <div className="pt-4 "><Footer /></div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader /> {/* Assuming Loader is your loader component */}
        </div>
      ) : (
        <>        
        <div className="text-center text-3xl ">
            <Heading label={alpha.toUpperCase()} /></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 sm:pt-32 sm:pl-12">
            {animeData.map((anime) => (
              <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id} />
            ))}
          </div>
          {pageCount < totalPageCount && (
            <div className="text-center">
              <button
                onClick={handleNextPage}
                className="bg-pink-200 px-3 py-1 rounded text-black mt-4 mb-8"
              >
                Next page
              </button>
              <ScrollToTop></ScrollToTop>
            </div>
            
          )}
        </>
      )}
     
    </>
  );
};
