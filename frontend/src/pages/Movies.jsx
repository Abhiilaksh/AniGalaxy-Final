import { useState,useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Loader } from "../components/Spinner";
const animeKey = import.meta.env.VITE_ANIME_KEY;

export const Movies=()=>{
    const[animeData,setAnimeData]=useState([]);
    const [loading, setLoading] = useState(false); 
    useEffect(()=>{
        const fetchMovie=async()=>{
            try {
                setLoading(true)
                const response=await fetch(`${animeKey}category/movie`)
                const result=await response.json();
                setAnimeData(result.data.animes);}
            catch(error){
                <div>Failed to load Data</div>
            }
            finally{
                setLoading(false)
            }
            
        }
        fetchMovie();
    },[])

    return(
        <>
         {loading?(<Loader/>):(<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-16 sm:pt-32 sm:pl-12">
        {animeData.map((anime) => (
                <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id}/>
            ))}
        </div>)}</>
    )
}