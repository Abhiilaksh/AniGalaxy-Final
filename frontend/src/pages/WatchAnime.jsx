import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import EpisodeList from "../components/EpisodeList"; // Import the reusable component
import { useLocation } from "react-router-dom";
import VideoPlayer from "../components/Player";
import { Loader } from "../components/Spinner";

const animeKey = import.meta.env.VITE_ANIME_KEY;

export const Watch = () => {
  const { anime } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [range, setRange] = useState([0, 100]); // Default range: 0–100
  const [videoUrl, setVideoUrl] = useState(null);
  const location = useLocation();

  // Extract the entire URL after the base domain
  const fullPath = location.pathname.replace('/watch/', '') + location.search;
  

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        // Fetch all episodes
        const response = await fetch(`${animeKey}anime/${anime}/episodes`);
        if (!response.ok) throw new Error("Failed to fetch episodes");
        const result = await response.json();
        setEpisodes(result.data.episodes);
  
        // Fetch video source with fallback mechanism
        let link;
        try {
          // Try primary server first
          link = await fetch(`${animeKey}episode/sources?animeEpisodeId=${fullPath}`);
          if (!link.ok) throw new Error("Primary server failed");
        } catch (primaryError) {
          console.warn("Primary server failed, trying fallback server:", primaryError);
          // Fallback to secondary server
          link = await fetch(`${animeKey}episode/sources?animeEpisodeId=${fullPath}&server=hd-2`);
          if (!link.ok) throw new Error("Fallback server failed");
        }
  
        // Process video source response
        const responseData = await link.json();
        if (!responseData.data?.sources?.length) throw new Error("No video sources available");
        setVideoUrl(responseData.data.sources[0].url);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, handle error state
      }
    };
  
    fetchEpisodes();
  }, [anime, fullPath]);

  // Create ranges for the episode list in chunks of 100
  const totalRanges = Math.ceil(episodes.length / 100);
  const ranges = [];
  for (let i = 0; i < totalRanges; i++) {
    ranges.push([i * 100, Math.min((i + 1) * 100, episodes.length)]);
  }

  const handleRangeChange = (e) => {
    const selectedRange = ranges[e.target.value];
    setRange(selectedRange);
  };

  return (
    <>
      <div className="pt-32 text-center text-2xl font-bold">
  {/* Add a title or something here */}
</div>

<div className="flex flex-col lg:flex-row lg:space-x-4">
  {/* Video Section */}
  <div className="bg-black w-full lg:w-[80%] ml-0 lg:ml-8 pl-2 pr-4 py-16 order-1 lg:order-1">
    <h1 className="text-white">HLS Video Player</h1>
    {videoUrl ? (
      <VideoPlayer videoUrl={videoUrl} />
    ) : (
      <div>
        <Loader />
      </div>
    )}
  </div>

  {/* Episode List Section */}
  <div className="w-full lg:w-auto order-2 lg:order-2">
    <EpisodeList
      episodes={episodes}
      ranges={ranges}
      range={range}
      handleRangeChange={handleRangeChange}
    />
  </div>
</div>
    </>
  );
};
