import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EpisodeList = ({ episodes, ranges, range, handleRangeChange }) => {
  const [activeEpisode, setActiveEpisode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hasFiller = episodes.some(episode => episode.isFiller);

  // Set the first episode by default if no episode is selected
  useEffect(() => {
    if (episodes.length > 0 && !activeEpisode) {
      setActiveEpisode(episodes[0].episodeId);
      
      // Check if ep query param exists, if not, navigate to the first episode
      const queryParams = new URLSearchParams(location.search);
      if (!queryParams.has('ep')) {
        // Navigate to the first episode, but do it in a way that prevents appending `ep` repeatedly
        navigate(`/watch/${episodes[0].episodeId}`, { replace: true });
      }
      
    }
  }, [episodes, activeEpisode, location, navigate]);

  const handleEpisodeClick = (episodeId) => {
    setActiveEpisode(episodeId);
    // Update the URL with the clicked episode ID
    navigate(`/watch/${episodeId}`);
  };

  return (
    <div
      className={`${
        episodes.length < 30 ? "lg:w-96" : "lg:w-96"
      } overflow-y-scroll p-4 bg-black text-white mr-4 rounded-md scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 border rounded-xl lg:ml-auto`}
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
          className="p-2 bg-gray-900 text-white rounded"
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
              className={`mb-4 w-12 ${episodes.length < 30 ? "w-full text-left" : "bg-gray-900  rounded  text-center"} ${activeEpisode === episode.episodeId ? "bg-lime-300 text-black rounded-md" : "text-white"}`}
              onClick={() => handleEpisodeClick(episode.episodeId)}
            >
              {episodes.length < 30 ? (
                <div
                  className={`border rounded-md px-6 py-2 text-left text-lg ${episode.isFiller ? "text-pink-600 font-bold"  : ""}`}
                >
                  {`${episode.number}  ${episode.title}`}
                </div>
              ) : (
                <div className={`${episode.isFiller ? "text-pink-400 font-bold" : ""}`}>
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