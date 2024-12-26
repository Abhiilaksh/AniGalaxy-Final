import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";

const VideoPlayer = ({ videoUrl, subtitleUrl, outro, intro }) => {
  const videoNode = useRef(null);
  const player = useRef(null);
  const skipIntroButton = useRef(null);
  const skipOutroButton = useRef(null);

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

          skipOutroButton.current = createButton(
            "Skip Outro",
            () => {
              if (outro && player.current) {
                player.current.currentTime(outro.end);
              }
            },
            "bottom-14 right-28"
          );

          container.appendChild(skipIntroButton.current);
          container.appendChild(skipOutroButton.current);
        };

        createAndAppendButtons();

        const updateButtonVisibility = () => {
          const currentTime = player.current.currentTime();

          if (intro && currentTime >= intro.start && currentTime < intro.end) {
            skipIntroButton.current.style.display = "block";
          } else {
            skipIntroButton.current.style.display = "none";
          }

          if (outro && currentTime >= outro.start && currentTime < outro.end) {
            skipOutroButton.current.style.display = "block";
          } else {
            skipOutroButton.current.style.display = "none";
          }
        };

        const handleFullscreenChange = () => {
          if (player.current.isFullscreen()) {
            // Lock to landscape on mobile
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock("landscape").catch((error) => {
                console.warn("Failed to lock orientation:", error);
              });
            }
          } else {
            // Unlock orientation
            if (screen.orientation && screen.orientation.unlock) {
              screen.orientation.unlock();
            }
          }
          updateButtonVisibility();
        };

        const handleKeyPress = (e) => {
          if (!player.current || document.activeElement.tagName === "INPUT")
            return;

          switch (e.code) {
            case "Space":
              e.preventDefault();
              player.current.paused()
                ? player.current.play()
                : player.current.pause();
              break;
            case "ArrowLeft":
              e.preventDefault();
              player.current.currentTime(
                Math.max(0, player.current.currentTime() - 5)
              );
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
  }, [videoUrl, subtitleUrl, intro, outro]);

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
