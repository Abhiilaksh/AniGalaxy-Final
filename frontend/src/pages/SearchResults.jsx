import { useParams } from "react-router-dom"
import { useState,useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Heading } from "../components/Heading";
export const SearchResult=()=>{
    const {query}=useParams();
    const [result,setResult]=useState([])
    useEffect(()=>{
        const fetchResult=async()=>{
            const response=await fetch(`https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/search?q=${query}`)
            const data=await response.json();
            setResult(data.data.animes);
            console.log(result);
        }
        fetchResult();
    },[query])
    return(
        <>
        <div className="pt-32 flex justify-center"><Heading label={`Search results for ${query} :`}></Heading></div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-16 sm:pt-24 sm:pl-24">
          {result.map((anime) => (
            <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id}/>
          ))}
        </div>
        </>
    )
}