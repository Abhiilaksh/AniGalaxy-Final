import { useParams } from "react-router-dom"
import { useState,useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import { Heading } from "../components/Heading";
import { Loader } from "../components/Spinner";
export const SearchResult=()=>{
    const {query}=useParams();
    const [result,setResult]=useState([])
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        const fetchResult=async()=>{
          try{
            setLoading(true);
            const response=await fetch(`https://aniwatch-api-abhiilakshs-projects.vercel.app/api/v2/hianime/search?q=${query}`)
            const data=await response.json();
            setResult(data.data.animes);
            console.log(result);
          }
          catch(error){
            console.log(error)
          }
          finally{
            setLoading(false)
          }
        }
        fetchResult();
    },[query])
    return(
        <>
        {loading?(<Loader/>):(<><div className=" pt-16 sm:pt-24 flex justify-center"><Heading label={`Search results for ${query} :`} size={"2xl"}></Heading></div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-16 sm:pt-24 sm:pl-24">
          {result.map((anime) => (
            <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id}/>
          ))}
        </div></>)}
        </>
    )
}