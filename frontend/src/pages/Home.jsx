import SlideShow from "../components/Carousel1";
import { useEffect, useState } from "react";
import { Loader } from "../components/Spinner";
const animeKey = import.meta.env.VITE_ANIME_KEY;

import { AnimeSection } from "../components/AnimeSection";

export const Home = () => {
    const [slide, setSlide] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading
    const [trending,setTrending]=useState([]);
    const[latest,setLatest]=useState([]);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                const response = await fetch(`${animeKey}home`);
                const data = await response.json();
                setSlide(data.data.spotlightAnimes);
                setTrending(data.data.trendingAnimes)
                setLatest(data.data.latestEpisodeAnimes)
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchData();
    }, []);
    

    return (
        <>
        
        <div className="bg-black md:pt-0 pt-[55px]">
            {loading ? (
                <Loader /> // Show spinner while loading
            ) : (<>
                <SlideShow animeData={slide} />
                <AnimeSection title="Trending Anime" animeData={trending} />
                <AnimeSection title="Latest Episodes" animeData={latest} />
                </>
            )}
        </div>
      
        </>
    );
};