import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { photo1 } from "../assets/photo";
import { Heading } from "../components/Heading";

export const AnimeInfo = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState({});
  const [stats, setStats] = useState({});
  const [isMovie, setIsMovie] = useState(false);
  const [moreInfo, setMoreInfo] = useState({});

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(
          `https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/anime/${id}`
        );
        const result = await response.json();

        if (result?.data?.anime?.info) {
          const animeInfo = result.data.anime.info;
          setAnimeData(animeInfo);
          setMoreInfo(result.data.anime.moreInfo);
          setStats(animeInfo.stats || {});
          setIsMovie(animeInfo.type === "Movie");
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };
    fetchInfo();
  }, [id]);

  return (
    <>
      <div className="relative w-full h-[600px] rounded-lg">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg"
          style={{ backgroundImage: `url(${photo1})` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col md:flex-row text-white pt-10 md:pt-[100px] px-4 md:px-16 gap-8 md:gap-16">
          {/* Image Section */}
          <div className="w-full md:w-[250px] flex justify-center md:pt-[50px] pt-8">
            <img
              className="rounded-lg w-[150px] md:w-[250px] sm:h-[300px]"
              src={animeData.poster || ""}
              alt={animeData.name || "Anime Poster"}
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col w-full">
          <Heading label={animeData.name}></Heading>
            <div className="flex flex-wrap space-x-1 pt-4">
              {stats.rating && (
                <div className="bg-white text-black font-medium text-sm px-4 py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out">
                  {stats.rating}
                </div>
              )}
              {stats.quality && (
                <div className="bg-amber-200 text-black font-medium text-sm px-4 py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out">
                  {stats.quality}
                </div>
              )}
              {!isMovie && stats.episodes?.sub && (
                <div className="bg-lime-300 text-black font-medium text-sm px-4 py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out">
                  {stats.episodes.sub}
                </div>
              )}
              {moreInfo?.duration && (
                <div className="text-white font-medium text-sm px-4 py-2 rounded cursor-pointer transition duration-200 ease-in-out">
                  {moreInfo.duration}
                </div>
              )}
            </div>
            <div className="flex flex-wrap space-x-4 pt-4">
              <button className="bg-pink-100 text-black font-medium text-sm px-4 py-4 rounded-2xl shadow-md cursor-pointer transition duration-200 ease-in-out">
                Watch Now
              </button>
              <button className="bg-white text-black font-medium text-sm px-4 py-4 rounded-2xl shadow-md cursor-pointer transition duration-200 ease-in-out">
                Add To Favourites
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
