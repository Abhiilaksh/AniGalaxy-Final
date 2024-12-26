import { AnimeCard } from "./AnimeCard";
import { Heading } from "./Heading";
import { useRef, useEffect } from "react";

export const AnimeSection = ({ title, animeData }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      if (scrollRef.current.scrollLeft + clientWidth >= scrollWidth - 1) {
  
        scrollRef.current.scrollLeft = 0;
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    // Automatically handle looping effect
    const scrollContainer = scrollRef.current;
    const handleScroll = () => {
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      if (scrollContainer.scrollLeft + clientWidth >= scrollWidth) {
        scrollContainer.scrollLeft = 0;
      }
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="mt-4 relative">
      <div className="ml-4"><Heading label={title} /></div>
      {/* Left Button */}
      <button         
  onClick={scrollLeft}         
  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-35 text-white text-2xl font-extrabold rounded-full z-50 ml-8 px-5 py-4 transition-all  hidden md:block text-center"       
>
        &#8592;
      </button>
      {/* Anime List */}
      <ul
        ref={scrollRef}
        className="flex overflow-x-auto mt-4 scrollbar-hide no-scrollbar"
      >
        {animeData.concat(animeData).map((anime) => ( // Duplicating the list to make it infinite
          <li key={anime.id}>
            <AnimeCard
              title={anime.name}
              image={anime.poster}
              id={anime.id}
            />
          </li>
        ))}
      </ul>
      {/* Right Button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-35 text-white text-2xl font-extrabold rounded-full z-50 ml-8 px-5 py-4 transition-all  hidden md:block text-center"
      >
        &#8594;
      </button>
    </div>
  );
};
