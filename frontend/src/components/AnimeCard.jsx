import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

export const AnimeCard = ({ title, image, id ,link}) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchHover = useCallback(async () => {
    if (hoverInfo || isLoading) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      const url = `https://aniwatch-api-git-main-abhiilakshs-projects.vercel.app/api/v2/hianime/qtip/${id}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setHoverInfo(data.data.anime);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error fetching hover info:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id, hoverInfo, isLoading]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    fetchHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link to={link?link:`/anime/${id}`} className="block">
      <div
        className="relative group flex flex-col justify-center items-center p-4 hover:scale-105 transition-all duration-300 w-full sm:w-56 md:w-64 lg:w-72 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Anime Thumbnail with Loading State */}
        <div className="relative w-40 sm:w-56 h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-md">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {/* Dark overlay that appears on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        {/* Anime Title */}
        <h3 className="mt-3 text-center text-base  line-clamp-1">
          {title}
        </h3>

        {/* Centered Hover Info Tooltip */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-gray-800/40 backdrop-blur-[2px] text-white p-4 rounded-lg text-sm w-[90%] max-h-[90%] overflow-y-auto transition-all duration-300">
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-pulse text-center">Loading...</div>
                </div>
              ) : hasError ? (
                <div className="text-red-400 text-center">
                  Failed to load anime details
                </div>
              ) : hoverInfo ? (
                <>
                  <h3 className="text-lg font-bold mb-2 text-white/90">{hoverInfo.name}</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between text-white/80">
                      <span className="font-semibold">Type:</span>
                      <span>{hoverInfo.type}</span>
                    </p>
                  
                    <p className="flex justify-between text-white/80">
                      <span className="font-semibold">Episodes:</span>
                      <span>{hoverInfo.episodes.sub}</span>
                    </p>
                    <p className="flex justify-between text-white/80">
                      <span className="font-semibold">Status:</span>
                      <span>{hoverInfo.status}</span>
                    </p>
                    <div className="mt-3">
                      <p className="font-semibold mb-1 text-white/90">Description:</p>
                      <p className="text-sm line-clamp-3 text-white/70">
                        {hoverInfo.description || "No description available"}
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

