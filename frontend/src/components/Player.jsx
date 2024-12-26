import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import { useNavigate } from "react-router-dom";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";

const VideoPlayer = ({ videoUrl, subtitleUrl, outro, intro, next }) => {
  const videoNode = useRef(null);
  const player = useRef(null);
  const skipIntroButton = useRef(null);
  const nextEpisodeButton = useRef(null);
  const navigate = useNavigate(); // Use the navigate function

  useEffect(() => {
    if (videoNode.current) {
      const initializePlayer = () => {
        const createButton = (text, onClickHandler, additionalClasses) => {
          const button = document.createElement("button");
          button.className = `absolute z-50 px-8 py-4 rounded-md hover:bg-opacity-100 ${additionalClasses}`;
          button.innerHTML = text;
          button.onclick = onClickHandler;
          button.style.display = "none";
          button.style.position = "absolute";
          button.style.backgroundColor = "rgba(255, 250, 250, 0.88)";
          button.style.color = "black";
          button.style.border = "none";
          button.style.cursor = "pointer";
          button.style.zIndex = "1000";
          return button;
        };

        player.current = videojs(videoNode.current, {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: false,
          preload: "auto",
          playbackRates: [0.5, 1, 1.5, 2],
          sources: [
            {
              src: videoUrl,
              type: "application/x-mpegURL",
            },
          ],
          tracks: subtitleUrl
            ? [
                {
                  kind: "captions",
                  label: "English",
                  src: subtitleUrl,
                  srclang: "en",
                  default: true,
                },
              ]
            : [],
        });

        const createAndAppendButtons = () => {
          const container = player.current.el();

          skipIntroButton.current = createButton(
            "Skip Intro",
            () => {
              if (intro && player.current) {
                player.current.currentTime(intro.end);
              }
            },
            "bottom-14 right-12"
          );

          // Only create the "Next Episode" button if `next` is not null
          if (next) {
            nextEpisodeButton.current = document.createElement("button");
            nextEpisodeButton.current.className =
              "absolute z-50 px-8 py-4 rounded-md hover:bg-opacity-100 bottom-14 right-28";
            nextEpisodeButton.current.innerHTML = "Next Episode";
            nextEpisodeButton.current.style.display = "none";
            nextEpisodeButton.current.style.position = "absolute";
            nextEpisodeButton.current.style.backgroundColor = "rgba(255, 250, 250, 0.88)";
            nextEpisodeButton.current.style.color = "black";
            nextEpisodeButton.current.style.border = "none";
            nextEpisodeButton.current.style.cursor = "pointer";
            nextEpisodeButton.current.style.zIndex = "1000";

            nextEpisodeButton.current.onclick = () => {
              console.log("Navigating to next episode:", next);
              if (next) {
                navigate(`/watch/${next}`); // Navigate to the next episode
              }
            };

            container.appendChild(nextEpisodeButton.current);
          }

          container.appendChild(skipIntroButton.current);
        };

        createAndAppendButtons();

        const updateButtonVisibility = () => {
          const currentTime = player.current.currentTime();

          if (intro && currentTime >= intro.start && currentTime < intro.end) {
            skipIntroButton.current.style.display = "block";
          } else {
            skipIntroButton.current.style.display = "none";
          }

          if (outro && currentTime >= outro.start && nextEpisodeButton.current) {
            nextEpisodeButton.current.style.display = "block";
          } else {
            nextEpisodeButton.current.style.display = "none";
          }
        };

        const handleFullscreenChange = () => {
          if (player.current.isFullscreen()) {
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock("landscape").catch((error) => {
                console.warn("Failed to lock orientation:", error);
              });
            }
          } else {
            if (screen.orientation && screen.orientation.unlock) {
              screen.orientation.unlock();
            }
          }
          updateButtonVisibility();
        };

        const handleKeyPress = (e) => {
          if (!player.current || document.activeElement.tagName === "INPUT") return;

          switch (e.code) {
            case "Space":
              e.preventDefault();
              player.current.paused() ? player.current.play() : player.current.pause();
              break;
            case "ArrowLeft":
              e.preventDefault();
              player.current.currentTime(Math.max(0, player.current.currentTime() - 5));
              break;
            case "ArrowRight":
              e.preventDefault();
              player.current.currentTime(player.current.currentTime() + 5);
              break;
            case "ArrowUp":
              e.preventDefault();
              player.current.volume(Math.min(1, player.current.volume() + 0.1));
              break;
            case "ArrowDown":
              e.preventDefault();
              player.current.volume(Math.max(0, player.current.volume() - 0.1));
              break;
            default:
              break;
          }
        };

        player.current.on("fullscreenchange", handleFullscreenChange);
        player.current.on("timeupdate", updateButtonVisibility);
        document.addEventListener("keydown", handleKeyPress);

        return () => {
          document.removeEventListener("keydown", handleKeyPress);
          player.current.dispose();
        };
      };

      initializePlayer();
    }
  }, [videoUrl, subtitleUrl, intro, outro, next, navigate]); // Add navigate as a dependency

  return (
    <div className="video-container relative h-[200px] md:h-[550px] md:w-[95%] md:pl-16 mt-[-10px]">
      <video
        ref={videoNode}
        className="video-js vjs-default-skin vjs-big-play-centered"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
