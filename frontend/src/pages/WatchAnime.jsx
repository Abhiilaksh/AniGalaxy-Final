import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import EpisodeList from "../components/EpisodeList";
import VideoPlayer from "../components/Player";
import { Loader } from "../components/Spinner";
import ScrollToTop from "../components/scrollToTop";
import { RWebShare } from "react-web-share";

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
  const [intro, setIntro] = useState({});
  const [outro, setOutro] = useState({});

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

      // Fetch sub and dub categories in parallel
      const [subResponse, dubResponse] = await Promise.all([
        fetch(
          `${animeKey}episode/sources?animeEpisodeId=${fullPath}&category=sub`
        ),
        fetch(
          `${animeKey}episode/sources?animeEpisodeId=${fullPath}&category=dub`
        ),
      ]);

      let videoData;
      let selectedSubtitle = null;
      let introData = null;
      let outroData = null;

      // Handle dub response if available
      if (dubResponse.ok) {
        const dubData = await dubResponse.json();
        if (isDub && dubData?.data?.sources?.length) {
          videoData = dubData;
        }
      }

      // Handle sub response
      if (subResponse.ok) {
        const subData = await subResponse.json();
        if (!videoData) {
          videoData = subData;
          selectedSubtitle = getSelectedSubtitle(subData.data.tracks);
        }
        introData = subData.data.intro;
        outroData = subData.data.outro;
      }

      // If both sub and dub fail, fallback to raw
      if (!videoData) {
        const rawResponse = await fetch(
          `${animeKey}episode/sources?animeEpisodeId=${fullPath}&category=raw`
        );
        if (!rawResponse.ok) {
          throw new Error("All video source categories failed");
        }
        const rawData = await rawResponse.json();
        videoData = rawData;
        selectedSubtitle = getSelectedSubtitle(rawData.data.tracks);
        introData = rawData.data.intro; // Handle intro for raw
        outroData = rawData.data.outro; // Handle outro for raw
      }

      if (!videoData.data?.sources?.length) {
        throw new Error("No video sources available");
      }

      // Update state with fetched data
      setIntro(introData);
      setOutro(outroData);
      setState((prev) => ({
        ...prev,
        videoUrl: videoData.data.sources[0].url,
        subtitleUrl: selectedSubtitle,
        dubAvailable: !!dubResponse.ok,
        isDub: isDub && !!dubResponse.ok,
      }));
    } catch (error) {
      console.error("Error fetching video or subtitles:", error);
    } finally {
      setState((prev) => ({ ...prev, videoLoading: false }));
    }
  }, [fullPath]);

  const getSelectedSubtitle = (tracks = []) => {
    if (tracks.length === 0) return null;
    if (tracks.length === 1) return tracks[0].file;

    return (
      tracks.find((track) => track.label?.toLowerCase() === "english")?.file ||
      tracks.find((track) => track.default)?.file ||
      tracks[0]?.file
    );
  };

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

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

  const currentEpisodeIndex = state.episodes.findIndex((ep) =>
    fullPath.includes(ep.episodeId)
  );
  const nextEpisode =
    currentEpisodeIndex >= 0 && currentEpisodeIndex < state.episodes.length - 1
      ? state.episodes[currentEpisodeIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col lg:flex-row lg:space-x-4 py-12 md:px-4">
        <div className="w-full lg:w-[80%] min-h-[300px]">
          <h1 className="pt-12 pb-8 text-center text-xl md:text-3xl font-bold text-white px-16 md:ml-32">
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
              intro={intro}
              outro={outro}
              next={nextEpisode?.episodeId || null}
            />
          )}
        </div>

        <div className="w-full lg:w-auto pt-16 sm:pt-24">
          <div className="pb-8 md:pb-4 sm:ml-0 gap-4 mt-[-50px] flex justify-center">
            {state.dubAvailable && (
              <button
                onClick={handleAudioToggle}
                className="mt-4 px-4 py-2 bg-pink-100 text-black rounded hover:bg-pink-200 transition-colors"
              >
                Switch {state.isDub ? "Back to Sub" : "to Dub"}
              </button>
            )}
            <RWebShare
              data={{
                text: `Check out this episode ${state.title}\n \n${window.location.href}`,
                url: window.location.href,
                title: state.title,
              }}
            >
              <button className="mt-4 px-4 py-2 bg-blue-100 text-black rounded transition-colors ml-4">
                Share Episode
              </button>
            </RWebShare>
          </div>

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
      <ScrollToTop />
    </div>
  );
};
