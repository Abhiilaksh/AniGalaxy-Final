import { useState, useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Loader } from "../components/Spinner";
const animeKey = import.meta.env.VITE_ANIME_KEY;

const MostPopular = () => {
    const [animeData, setAnimeData] = useState([]);
    const[loading,setLoading]=useState(false);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${animeKey}category/most-popular`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setAnimeData(result.data.animes);
            } catch (error) {
                console.error("Error fetching most popular anime:", error);
            }
            finally{
                setLoading(false);
            }
        };
        fetchPopular();
    }, []);

    return (
        <>
        {loading?(<Loader/>):<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-16 sm:pt-32 sm:pl-12">
          {animeData.map((anime) => (
            <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id}/>
          ))}
        </div>}
         
      </>
      
    );
};

export default MostPopular;