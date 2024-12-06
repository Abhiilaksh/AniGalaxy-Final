import { useState,useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";

export const Movies=()=>{
    const[animeData,setAnimeData]=useState([]);
    useEffect(()=>{
        const fetchMovie=async()=>{
            const response=await fetch("https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/category/movie")
            const result=await response.json();
            setAnimeData(result.data.animes);
            
        }
        fetchMovie();
    },[])

    return(
        <>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-16 sm:pt-24 sm:pl-24">
        {animeData.map((anime) => (
                <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id}/>
            ))}
        </div></>
    )
}