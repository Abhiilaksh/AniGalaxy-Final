import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { anime } from "../assets/photo";
import { Heading } from "../components/Heading";
import { Link, useNavigate } from "react-router-dom";
import { RelatedAnime } from "../components/RelatedAnime";
import { RecommendedAnime } from "../components/RecommendedAnime";
import { Loader } from "../components/Spinner";
import { AnimeDiscussion } from "../components/AnimeDiscussion";
import ScrollToTop from "../components/scrollToTop";
import { motion } from "motion/react";

const ServerError = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 pt-64">
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl w-full">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-red-700">Server Error</h3>
          <p className="mt-1 text-red-600">
            Unable to fetch anime data. The server might be down or experiencing issues. Please try again later.
          </p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  </div>
);
const SkeletonAnimeSection = () => (
  <motion.div
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 0.5 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative w-full h-[600px] rounded-lg bg-black animate-pulse"
  >
    {/* Blurred Background */}
    <div className="absolute inset-0 bg-black blur-lg"></div>

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/[.35] bg-opacity-20 flex flex-col md:flex-row text-white pt-10 md:pt-[100px] px-4 md:px-16 gap-8 md:gap-16">
      {/* Image Section */}
      <div className="w-full md:w-[350px] flex justify-center md:pt-[50px] pt-8">
        <div className="rounded-lg w-[150px] md:w-[250px] sm:h-[300px] bg-gray-900 animate-pulse"></div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col w-full mt-[-40px] sm:mt-0">
        <div className="w-full md:w-[680px]">
          <div className="h-8 bg-gray-700 animate-pulse rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-700 animate-pulse rounded w-72 mb-2"></div>
          <div className="h-4 bg-gray-700 animate-pulse rounded w-60"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const PageSkeleton = () => (
  <div className="bg-black min-h-screen md:pt-0 pt-[55px] pb-12">
    <SkeletonAnimeSection />
  </div>
);

export const AnimeInfo = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState({});
  const [stats, setStats] = useState({});
  const [isMovie, setIsMovie] = useState(false);
  const [moreInfo, setMoreInfo] = useState({});
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const animeKey = import.meta.env.VITE_ANIME_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`${animeKey}anime/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();

        if (!result?.data?.anime?.info) {
          throw new Error('No anime data found');
        }

        const animeInfo = result.data.anime.info;
        setRecommendedAnime(result.data.recommendedAnimes);
        setRelatedAnime(result.data.relatedAnimes);
        setAnimeData(animeInfo);
        setMoreInfo(result.data.anime.moreInfo);
        setStats(animeInfo.stats || {});
        setIsMovie(animeInfo.type === "Movie");
      } catch (error) {
        console.error("Error fetching anime data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [id, animeKey]);

  useEffect(() => {
    const checkIfFavourite = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`https://api.anigalaxy.xyz/api/v1/user/fav?id=${id}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.status === 403) {
            localStorage.removeItem("token");
            navigate("/signin");
            return;
          }

          const data = await response.json();
          setIsFavourite(data.isFavourite || false);
        } catch (error) {
          console.error("Error checking favourite anime:", error);
        }
      }
    };
    checkIfFavourite();
  }, [id, navigate]);

  const toggleFav = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    setLoadingFav(true);

    try {
      const response = await fetch(`https://api.anigalaxy.xyz/api/v1/user/fav`, {
        method: isFavourite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ animeId: id }),
      });

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      if (response.ok) {
        setIsFavourite(!isFavourite);
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle favourite anime:", errorData.error);
      }
    } catch (error) {
      console.error("Error while toggling favourite anime:", error);
    } finally {
      setLoadingFav(false);
    }
  };
  if (loading) {
    return <PageSkeleton />;
  }

  

  if (error) {
    return (
      <div className="min-h-screen w-full bg-black">
        <ServerError />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <motion.div 
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: .5}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full h-[600px] rounded-lg">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg"
          style={{ backgroundImage: `url(${animeData.poster})` }}
        ></div>
        <div className="absolute inset-0 bg-black/[.35] bg-opacity-20 flex flex-col md:flex-row text-white pt-10 md:pt-[100px] px-4 md:px-16 gap-8 md:gap-16">
          {/* Image Section */}
          <div className="w-full md:w-[350px] flex justify-center md:pt-[50px] pt-8">
            <img
              className="rounded-lg w-[150px] md:w-[250px] sm:h-[300px]"
              src={animeData.poster || anime}
              alt={animeData.name || "Anime Poster"}
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col w-full mt-[-40px] sm:mt-0">
            <div className="w-full md:w-[680px]">
              <Heading label={animeData.name} size={"xl"}></Heading>
            </div>
            <div className="flex flex-wrap space-x-1 pt-4">
              {stats.rating && (
                <div className="py-[10px] bg-white text-black font-medium text-xs sm:text-sm px-4 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out bg-opacity-85">
                  {stats.rating}
                </div>
              )}
              {stats.quality && (
                <div className="py-[10px] bg-amber-200 text-black font-medium text-xs sm:text-sm px-4 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out bg-opacity-85">
                  {stats.quality}
                </div>
              )}
              {!isMovie && stats.episodes?.sub && (
                <div className="py-[10px] bg-lime-300 text-black font-medium text-xs sm:text-sm px-3 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out bg-opacity-85">
                  {stats.episodes.sub}
                </div>
              )}
              {!isMovie && stats.episodes?.dub && (
                <div className="py-[10px] bg-blue-100 text-black font-medium text-xs sm:text-sm px-3 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out bg-opacity-85">
                  {stats.episodes.dub}
                </div>
              )}
              {moreInfo?.duration && (
                <div className="py-[10px] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded cursor-pointer transition duration-200 ease-in-out bg-opacity-85">
                  {moreInfo.duration === "?m" ? "" : moreInfo.duration}
                </div>
              )}
            </div>
            <div className="flex flex-wrap space-x-4 pt-4">
              <Link to={`/watch/${animeData.id}`}>
                <button className="py-[12px] bg-pink-100 text-black font-medium text-xs sm:text-sm px-4 sm:py-4 rounded-2xl shadow-md cursor-pointer transition duration-200 ease-in-out bg-opacity-90">
                  Watch Now
                </button>
              </Link>
              <button
                className={`py-[12px] ${isFavourite ? "bg-green-200" : "bg-white"} text-black font-medium text-xs sm:text-sm px-4 sm:py-4 rounded-2xl shadow-md cursor-pointer transition duration-200 ease-in-out bg-opacity-90`}
                onClick={toggleFav}
                disabled={loadingFav}
              >
                {loadingFav ? "Processing..." : isFavourite ? "Remove from Favourites" : "Add To Favourites"}
              </button>
            </div>
            <div className="pt-4 w-[320px] lg:w-[640px] text-sm pl-2">
              <p className="line-clamp-6 lg:line-clamp-none text-justify">
                {animeData.description}
              </p>
            </div>
          </div>
          <div className="hidden 2xl:flex flex-col w-[600px] p-6 mt-8 text-justify bg-black/20 rounded-lg shadow-md backdrop-blur-sm h-[450px]">
            <div className="font-semibold text-xl mb-4">Anime Details:</div>
            <div className="mb-2">
              <span className="font-medium">Japanese:</span> {moreInfo.japanese || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Aired:</span> {moreInfo.aired || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Premiered:</span> {moreInfo.premiered || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Status:</span> {moreInfo.status || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Duration:</span> {moreInfo.duration || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">MAL Score:</span> {moreInfo.malscore === "?" ? "N/A" : moreInfo.malscore || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Genres:</span> {moreInfo.genres?.join(", ") || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Studios:</span> {moreInfo.studios || "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Producers:</span> {moreInfo.producers?.join(", ") || "N/A"}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: .5}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pl-8 pt-8 h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
        <AnimeDiscussion animeId={id} />
      </motion.div>

      <ScrollToTop />
      
      <motion.div 
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: .5}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}>
        <RelatedAnime data={relatedAnime} />
      </motion.div>
      
      <motion.div 
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: .5}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-12">
        <RecommendedAnime data={recommendedAnime} />
      </motion.div>
    </div>
  );
};