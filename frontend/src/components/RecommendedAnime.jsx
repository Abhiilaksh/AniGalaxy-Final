import { AnimeCard } from "./AnimeCard"
import { Heading } from "./Heading";
export const RecommendedAnime=({data})=>{
    return (
        <>
       <div className="pt-2 mb-[-35px] pl-4 md:pl-16"> <Heading label="Recommendation" size="xl"/></div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-16 sm:pt-24 sm:pl-12 pl-2">
        
        {data.slice(0,10).map((anime) => (
          <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id} />
        ))}
      </div>
      </>
    );

}