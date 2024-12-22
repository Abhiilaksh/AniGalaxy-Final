import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import EpisodeList from "../components/EpisodeList";
import VideoPlayer from "../components/Player";
import { Loader } from "../components/Spinner";
import AnimeDiscussion from "../components/AnimeDiscussion";

const ITEMS_PER_PAGE = 100;
const animeKey = import.meta.env.VITE_ANIME_KEY;

export const Watch = () => {
  const { anime } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState({
    episodes: [],
    range: [0, ITEMS_PER_PAGE],
    videoUrl: null,
    videoLoading: true,
    subtitleUrl: null,
    title: "",
    dubAvailable: false,
    isDub: false,
  });

  const fullPath = location.pathname.replace("/watch/", "") + location.search;

  const fetchEpisodes = useCallback(async () => {
    try {
      const response = await fetch(`${animeKey}anime/${anime}/episodes`);
      if (!response.ok) throw new Error("Failed to fetch episodes");

      const result = await response.json();
      const episodes = result.data.episodes;

      const currentEpisode = episodes.find((ep) =>
        fullPath.includes(ep.episodeId)
      );

      setState((prev) => ({
        ...prev,
        episodes,
        title: currentEpisode?.title || "",
      }));
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  }, [anime, fullPath]);

  const fetchVideo = useCallback(async () => {
    if (!fullPath.includes("?ep=")) return;

    setState((prev) => ({ ...prev, videoLoading: true }));

    try {
      const isDub = fullPath.includes("category=dub");

      const [subResponse, dubResponse] = await Promise.all([
        fetch(
          `${animeKey}episode/sources?animeEpisodeId=${fullPath}&category=sub`
        ),
        fetch(
          `${animeKey}episode/sources?animeEpisodeId=${fullPath}&category=dub`
        ),
      ]);

      if (!subResponse.ok) throw new Error("Primary server failed");

      const subData = await subResponse.json();
      const dubData = await dubResponse.json();

      if (!subData.data?.sources?.length) throw new Error("No video sources available");

      const selectedSubtitle = isDub
        ? null
        : getSelectedSubtitle(subData.data.tracks);

      const videoSource =
        isDub && dubData.data?.sources?.length
          ? dubData.data.sources[0].url
          : subData.data.sources[0].url;

      setState((prev) => ({
        ...prev,
        videoUrl: videoSource,
        subtitleUrl: selectedSubtitle,
        dubAvailable: dubResponse.ok && !!dubData.data?.sources?.length,
        isDub: isDub && dubResponse.ok && !!dubData.data?.sources?.length,
      }));
    } catch (error) {
      console.error("Error fetching video or subtitles:", error);
    } finally {
      setState((prev) => ({ ...prev, videoLoading: false }));
    }
  }, [fullPath]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const getSelectedSubtitle = (tracks = []) => {
    if (tracks.length === 0) return null;
    if (tracks.length === 1) return tracks[0].file;

    return (
      tracks.find((track) => track.label?.toLowerCase() === "english")?.file ||
      tracks.find((track) => track.default)?.file ||
      tracks[0]?.file
    );
  };

  const handleRangeChange = (e) => {
    const totalRanges = Math.ceil(state.episodes.length / ITEMS_PER_PAGE);
    const ranges = Array.from({ length: totalRanges }, (_, i) => [
      i * ITEMS_PER_PAGE,
      Math.min((i + 1) * ITEMS_PER_PAGE, state.episodes.length),
    ]);

    setState((prev) => ({
      ...prev,
      range: ranges[e.target.value],
    }));
  };

  const handleAudioToggle = () => {
    const basePath = fullPath.split("&category=")[0];
    const newPath = state.isDub ? basePath : `${basePath}&category=dub`;
    navigate(`/watch/${newPath}`);
  };

  const currentEpisode = state.episodes.find((ep) =>
    fullPath.includes(ep.episodeId)
  );
  const episodeNumber = currentEpisode?.episodeId.match(/\d+/)?.[0] || null;

  return (
    <div className="min-h-screen bg-black">
      
      <div className="flex flex-col lg:flex-row lg:space-x-4 p-4">
        <div className="w-full lg:w-[80%] min-h-[300px]">
        <h1 className="pt-32 text-center text-2xl font-bold text-white">
        {state.title}
      </h1>

          {state.videoLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : (
            <VideoPlayer
              videoUrl={state.videoUrl}
              subtitleUrl={state.subtitleUrl}
            />
          )}
      <div className="text-center mt-[-20px] sm:mt-4 mb-4 sm:mb-2">
            {state.dubAvailable && (
            <button
              onClick={handleAudioToggle}
              className="mt-4 px-4 py-2 bg-pink-100 text-black rounded hover:bg-pink-200 transition-colors"
            >
              Switch {state.isDub ? "Back to Sub" : "to Dub"}
            </button>
          )}
            </div>
          
        </div>

        <div className="w-full lg:w-auto mx-3 mt-4 md:mt-32">
          <EpisodeList
            episodes={state.episodes}
            ranges={Array.from(
              {
                length: Math.ceil(state.episodes.length / ITEMS_PER_PAGE),
              },
              (_, i) => [
                i * ITEMS_PER_PAGE,
                Math.min((i + 1) * ITEMS_PER_PAGE, state.episodes.length),
              ]
            )}
            range={state.range}
            handleRangeChange={handleRangeChange}
          />
        </div>
      </div>
           
      {/* {currentEpisode && (
        <div className="mt-8 px-4">
          <AnimeDiscussion animeId={anime} episode={episodeNumber} />
        </div>
      )} */}
    </div>
  );
};
