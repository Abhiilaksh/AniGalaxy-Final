import { useState, useEffect } from "react";
import { AnimeCard } from "./AnimeCard";
import { Heading } from "./Heading";

export const RelatedAnime = ({ data }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    // Function to determine the number of items based on screen size
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(4); // For mobile devices
      } else {
        setVisibleCount(5); // For larger devices
      }
    };

    // Set initial value and add event listener
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    // Cleanup event listener
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <>
      <div className="pt-12 mb-[-35px] pl-4 md:pl-16">
        <Heading label="Related Anime" size="xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-16 sm:pt-24 sm:pl-12 pl-2">
        {data.slice(0, visibleCount).map((anime) => (
          <AnimeCard key={anime.id} title={anime.name} image={anime.poster} id={anime.id} />
        ))}
      </div>
    </>
  );
};
