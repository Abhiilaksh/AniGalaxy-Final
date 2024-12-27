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
import AdBanner from "../components/AdBanner";

export const AnimeInfo = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState({});
  const [stats, setStats] = useState({});
  const [isMovie, setIsMovie] = useState(false);
  const [moreInfo, setMoreInfo] = useState({});
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false); // For tracking if anime is added to favourites
  const [loadingFav, setLoadingFav] = useState(false); // For tracking the loading state of adding/removing from favourites
  const animeKey = import.meta.env.VITE_ANIME_KEY;
  const navigate = useNavigate(); // For redirecting to login page if not logged in

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${animeKey}anime/${id}`);
        const result = await response.json();

        if (result?.data?.anime?.info) {
          const animeInfo = result.data.anime.info;
          setRecommendedAnime(result.data.recommendedAnimes);
          setRelatedAnime(result.data.relatedAnimes);
          setAnimeData(animeInfo);
          setMoreInfo(result.data.anime.moreInfo);
          setStats(animeInfo.stats || {});
          setIsMovie(animeInfo.type === "Movie");
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [id]);

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
            // Token is invalid, remove it from localStorage and redirect to login
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

    setLoadingFav(true); // Set loading to true before making the request

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
        // Token is invalid, remove it from localStorage and redirect to login
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      if (response.ok) {
        setIsFavourite(!isFavourite); // Toggle the favourite state
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle favourite anime:", errorData.error);
      }
    } catch (error) {
      console.error("Error while toggling favourite anime:", error);
    } finally {
      setLoadingFav(false); // Set loading to false once the request is finished
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="relative w-full h-[600px] rounded-lg">
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
                    disabled={loadingFav} // Disable the button while loading
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
          </div>

          <div className="pl-8 pt-8 h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
            <AnimeDiscussion animeId={id} />
          </div>
          <AdBanner/>
          <ScrollToTop />
          <div>
            <RelatedAnime data={relatedAnime} />
          </div>
          <div className="pb-12">
            <RecommendedAnime data={recommendedAnime} />
          </div>
        </>
      )}
    </>
  );
};
