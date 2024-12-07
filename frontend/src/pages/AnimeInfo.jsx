import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { anime } from "../assets/photo";
import { Heading } from "../components/Heading";
import { Link } from "react-router-dom";
import { RelatedAnime } from "../components/RelatedAnime";
import { RecommendedAnime } from "../components/RecommendedAnime";
import { Loader } from "../components/Spinner";


export const AnimeInfo = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState({});
  const [stats, setStats] = useState({});
  const [isMovie, setIsMovie] = useState(false);
  const [moreInfo, setMoreInfo] = useState({});
  const[relatedAnime,setRelatedAnime]=useState([])
  const[recommendedAnime,setRecommendedAnime]=useState([])
  const[loading,setLoading]=useState(false)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/anime/${id}`
        );
        const result = await response.json();

        if (result?.data?.anime?.info) {
          const animeInfo = result.data.anime.info;
          setRecommendedAnime(result.data.recommendedAnimes)
          setRelatedAnime(result.data.relatedAnimes)
          console.log(result.data.relatedAnimes)
          setAnimeData(animeInfo);
          setMoreInfo(result.data.anime.moreInfo);
          setStats(animeInfo.stats || {});
          setIsMovie(animeInfo.type === "Movie");
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
      finally{
        setLoading(false)
      }
    };
    fetchInfo();
  }, [id]);

  return (
    <>
     {loading?(<Loader/>):( <><div className="relative w-full h-[600px]  rounded-lg">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-md "
          style={{ backgroundImage: `url(${animeData.poster})` }}
        >

        </div>
        <div className="absolute inset-0 bg-black/[.35] bg-opacity-20 flex flex-col md:flex-row text-white pt-10 md:pt-[100px] px-4 md:px-16 gap-8 md:gap-16">
          {/* Image Section */}
          <div className="w-full md:w-[350px] flex justify-center md:pt-[50px] pt-4">
            <img
              className="rounded-lg w-[150px] md:w-[250px] sm:h-[300px]"
              src={animeData.poster || ""}
              alt={animeData.name || "Anime Poster"}
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col w-full mt-[-40px] sm:mt-0">
          <div className="w-full md:w-[680px]"><Heading label={animeData.name} size={"xl"}></Heading></div>
            <div className="flex flex-wrap space-x-1 pt-4">
              {stats.rating && (
                <div className="py-[10px] bg-white text-black font-medium text-xs sm:text-sm px-4 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out">
                  {stats.rating}
                </div>
              )}
              {stats.quality && (
                <div className="py-[10px] bg-amber-200 text-black font-medium text-xs sm:text-sm px-4 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out">
                  {stats.quality}
                </div>
              )}
              {!isMovie && stats.episodes?.sub && (
                <div className="py-[8px] bg-lime-300 text-black font-medium text-xs sm:text-sm px-4 sm:py-2 rounded shadow-md cursor-pointer transition duration-200 ease-in-out">
                  {stats.episodes.sub}
                </div>
              )}
              {moreInfo?.duration && (
                <div className="py-[10px] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded cursor-pointer transition duration-200 ease-in-out">
                  {moreInfo.duration==='?m'?(""):(moreInfo.duration)}
                </div>
              )}
            </div>
            <div className="flex flex-wrap space-x-4 pt-4">
              <Link to={`/watch/${animeData.id}`}>
              <button className=" py-[12px] bg-pink-100 text-black font-medium text-xs sm:text-sm px-4 sm:py-4 rounded-2xl shadow-md cursor-pointer transition duration-200 ease-in-out">
                Watch Now
              </button></Link>
              <button className="py-[12px] bg-white text-black font-medium text-xs sm:text-sm px-4 sm:py-4 rounded-2xl shadow-md cursor-pointer transition duration-200 ease-in-out">
                Add To Favourites
              </button>
            </div>
            <div className="pt-4 w-[320px] lg:w-[640px] text-sm pl-2">
              <p className="line-clamp-6 lg:line-clamp-none text-justify">
                {animeData.description}
              </p>
            </div>
          </div>
          <div className="hidden 2xl:flex flex-col w-[450px] h-96 p-4  mt-16  text-justify bg-black/[0.2] rounded-lg ">
              <div>Japanese: {moreInfo.japanese}</div>
              <div>Aired: {moreInfo.aired}</div>
              <div>Premiered: {moreInfo.premiered}</div>
              <div>Status: {moreInfo.status}</div>
              <div>Duration: {moreInfo.duration}</div>
              <div>MAL Score: {moreInfo.malscore === "?" ? "N/A" : moreInfo.malscore}</div>
              <div>Genres: {moreInfo.genres?.join(",")}</div>
              <div>Studios: {moreInfo.studios}</div>
              <div>Producers: {moreInfo.producers?.join(", ")}</div>
            </div>
        </div>
      </div>
      <div>
        <RelatedAnime data={relatedAnime}/>
      </div>
      <div>
        <RecommendedAnime data={recommendedAnime}></RecommendedAnime>
      </div></>)}
    </>
  );
};
