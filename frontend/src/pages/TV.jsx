import { AnimeCard } from "../components/AnimeCard"
import { useState,useEffect } from "react"
export const TV=()=>{
    const [animeData,setAnimeData]=useState([]);
    useEffect(()=>{
        const fetchTv=async ()=>{
            const response=await fetch ("https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/category/tv");
            const result=await response.json();
            setAnimeData(result.data.animes)
            console.log(result.data.animes)
        }
        
        fetchTv();
    },[])

    return(
        <>
         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-16 sm:pt-32 sm:pl-12">
        {animeData.map((anime) => (
                <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id}/>
            ))}
        </div>
        </>
    )
}