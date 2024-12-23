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
      const videoContainer = videoNode.current.parentNode;

      // Create custom buttons
      const createButton = (text, onClickHandler, additionalClasses) => {
        const button = document.createElement("button");
        button.className = `absolute z-10 px-8 py-4 rounded-md hover:bg-opacity-100 ${additionalClasses}`;
        button.innerHTML = text;
        button.onclick = onClickHandler;
        button.style.display = "none"; // Start with buttons hidden
        button.style.backgroundColor = "rgba(255, 250, 250, 0.88)";
        button.style.color = "black";
        return button;
      };

      // Initialize player
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

      // Create skip buttons
      const createAndAppendButtons = () => {
        skipIntroButton.current = createButton(
          "Skip Intro",
          () => {
            if (intro && player.current) {
              player.current.currentTime(intro.end);
            }
          },
          "bottom-14 right-12" // Position for the intro button
        );

        skipOutroButton.current = createButton(
          "Skip Outro",
          () => {
            if (outro && player.current) {
              player.current.currentTime(outro.end);
            }
          },
          "bottom-14 right-12" // Position for the outro button
        );

        videoContainer.appendChild(skipIntroButton.current);
        videoContainer.appendChild(skipOutroButton.current);
      };

      createAndAppendButtons();

      // Fullscreen event listener
      const handleFullscreenChange = () => {
        if (player.current.isFullscreen()) {
          // Lock screen orientation to landscape when fullscreen is activated
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation
              .lock("landscape")
              .catch((err) => console.warn("Orientation lock failed:", err));
          }
        }
      };

      // Listen for Video.js fullscreenchange event
      player.current.on("fullscreenchange", handleFullscreenChange);

      // Time update handler to show/hide skip buttons
      const handleTimeUpdate = () => {
        const currentTime = player.current.currentTime();

        // Show/hide intro skip button only in fullscreen
        if (player.current.isFullscreen() && intro && currentTime >= intro.start && currentTime < intro.end) {
          skipIntroButton.current.style.display = "block";
        } else {
          skipIntroButton.current.style.display = "none";
        }

        // Show/hide outro skip button only in fullscreen
        if (player.current.isFullscreen() && outro && currentTime >= outro.start && currentTime < outro.end) {
          skipOutroButton.current.style.display = "block";
        } else {
          skipOutroButton.current.style.display = "none";
        }
      };

      player.current.on("timeupdate", handleTimeUpdate);
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
