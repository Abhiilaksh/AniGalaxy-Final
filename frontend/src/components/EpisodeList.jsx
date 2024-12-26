import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const EpisodeList = ({ episodes, ranges, range, handleRangeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeEpisodeId, setActiveEpisodeId] = useState(null);

  const hasFiller = episodes.some(episode => episode.isFiller);

  // Effect to update active episode when URL changes
  useEffect(() => {
    const fullPath = location.pathname.replace("/watch/", "") + location.search; // Remove /watch/ and add query params
    console.log('URL changed - Full path:', fullPath);
    setActiveEpisodeId(fullPath); // Set the active episode ID
    console.log('Active episode set to:', fullPath);
  }, [location.pathname, location.search]); // Add location.search to dependencies
  

  useEffect(() => {
    if (episodes.length > 0) {
      const queryParams = new URLSearchParams(location.search);
      if (!queryParams.has('ep')) {
        navigate(`/watch/${episodes[0].episodeId}`, { replace: true });
      }
    }
  }, [episodes, location, navigate]);

  const handleEpisodeClick = (episodeId) => {
    navigate(`/watch/${episodeId}`);
  };

  return (
    <div
      className={`${
        episodes.length < 30 ? "lg:w-96" : "lg:w-96"
      } overflow-y-scroll  px-6  pt-5 bg-black text-white  rounded-md scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 border-[.25px]  border-gray-600 rounded-md lg:ml-auto mx-2 `}
      style={{ height: "500px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          Episodes:
          {hasFiller && (
            <>
              <br />
              <div>
                <span className="mr-1 text-pink-400 text-3xl">•</span>
                <span className="mb-1 text-pink-400">Fillers</span>
              </div>
            </>
          )}
        </div>
        <select
          onChange={handleRangeChange}
          className="p-2 pr-8 bg-gray-900 text-white rounded"
        >
          {ranges.map(([start, end], index) => (
            <option key={index} value={index}>
              {start + 1}–{end}
            </option>
          ))}
        </select>
      </div>

      <div className={`grid ${episodes.length < 30 ? "grid-cols-1" : "grid-cols-5"} gap-2`}>
        {episodes.slice(range[0], range[1]).map((episode, i) => (
          <button
            key={episode.episodeId}
            className={`mb-4 w-12 ${
              episodes.length < 30 ? "w-full text-left" : "bg-gray-900 rounded text-center"
            } text-white ${
              episode.episodeId === activeEpisodeId ? "bg-pink-600" : ""
            }`}
            onClick={() => handleEpisodeClick(episode.episodeId)}
          >
            {episodes.length < 30 ? (
              <div
                className={`border-[.5px] rounded-md px-6 py-2 text-left text-lg ${
                  episode.isFiller ? "text-pink-600 font-bold" : ""
                } ${
                  episode.episodeId === activeEpisodeId ? "bg-lime-300 text-black " : ""
                }`}
              >
                {`${episode.number}  ${episode.title}`}
              </div>
            ) : (
              <div 
                className={`${episode.isFiller ? "text-pink-400 font-bold" : ""} ${
                  episode.episodeId === activeEpisodeId ? "bg-lime-300 text-black  font-bold rounded px-2" : ""
                }`}
              >
                {i + range[0] + 1}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;