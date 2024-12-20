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
  const [videoLoading, setVideoLoading] = useState(true); // Track video loading state
  const [subtitleUrl, setSubtitleUrl] = useState(null); // For subtitles
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
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    // Fetch episodes even if no ?ep= query
    fetchEpisodes();
  }, [anime]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!fullPath.includes('?ep=')) return; // Ensure we're fetching video only when ?ep= is present

      setVideoLoading(true); // Start video loading
      try {
        // Try primary server first
        const link = await fetch(`${animeKey}episode/sources?animeEpisodeId=${fullPath}`);
        if (!link.ok) throw new Error("Primary server failed");

        const responseData = await link.json();
        if (!responseData.data?.sources?.length) throw new Error("No video sources available");

        setVideoUrl(responseData.data.sources[0].url);

        // Handle subtitles
        const tracks = responseData.data.tracks || [];
        let selectedSubtitle = null;

        if (tracks.length === 1) {
          // If only one track is available, use it
          selectedSubtitle = tracks[0].file;
        } else {
          // Find English subtitles, default, or fallback to the first track
          selectedSubtitle =
            tracks.find((track) => track.label?.toLowerCase() === "english")?.file ||
            tracks.find((track) => track.default)?.file ||
            tracks[0]?.file;
        }

        setSubtitleUrl(selectedSubtitle);
      } catch (error) {
        console.error("Error fetching video or subtitles:", error);
      } finally {
        setVideoLoading(false); // Stop video loading
      }
    };

    fetchVideo();
  }, [fullPath]);

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
        {"Watching "}
      </div>

      <div className="flex flex-col bg-black lg:flex-row lg:space-x-4">
        {/* Video Section */}
        <div
          className="bg-black w-full lg:w-[80%] ml-0 lg:ml-8 pl-2 pr-4 py-8 lg:py-4 order-1 lg:order-1"
          style={{ height: videoUrl ? "auto" : "300px" }}
        >
          {videoLoading ? ( // Show loader when video is loading
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : (
            <div className="h-full">
              <VideoPlayer videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
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
