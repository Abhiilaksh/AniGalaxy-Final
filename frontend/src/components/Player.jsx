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

      // Create custom buttons with inline styles
      const createButton = (text, onClickHandler, additionalClasses) => {
        const button = document.createElement("button");
        button.className = `skip-button ${additionalClasses}`;
        button.innerHTML = text;
        button.onclick = onClickHandler;

        // Add inline styles for consistent rendering
        button.style.position = "absolute";
        button.style.zIndex = "10";
        button.style.padding = "8px 16px";
        button.style.borderRadius = "4px";
        button.style.backgroundColor = "rgba(255, 250, 250, 0.88)";
        button.style.color = "black";
        button.style.cursor = "pointer";
        button.style.display = "none"; // Default to hidden

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

      // Create and append skip buttons
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
        "bottom-14 right-20"
      );

      videoContainer.appendChild(skipIntroButton.current);
      videoContainer.appendChild(skipOutroButton.current);

      // Handle time update and show/hide buttons
      const handleTimeUpdate = () => {
        const currentTime = player.current.currentTime();

        // Show skip intro button
        if (intro && currentTime >= intro.start && currentTime < intro.end) {
          skipIntroButton.current.style.display = "block";
        } else {
          skipIntroButton.current.style.display = "none";
        }

        // Show skip outro button
        if (outro && currentTime >= outro.start && currentTime < outro.end) {
          skipOutroButton.current.style.display = "block";
        } else {
          skipOutroButton.current.style.display = "none";
        }
      };

      // Handle fullscreen change
      const handleFullscreenChange = () => {
        const isFullscreen = player.current.isFullscreen();

        if (isFullscreen) {
          // Show buttons during fullscreen
          if (intro) skipIntroButton.current.style.display = "block";
          if (outro) skipOutroButton.current.style.display = "block";
        } else {
          // Hide buttons when not fullscreen
          skipIntroButton.current.style.display = "none";
          skipOutroButton.current.style.display = "none";
        }
      };

      player.current.on("timeupdate", handleTimeUpdate);
      player.current.on("fullscreenchange", handleFullscreenChange);

      // Cleanup on unmount
      return () => {
       
        if (skipIntroButton.current) {
          videoContainer.removeChild(skipIntroButton.current);
        }

        if (skipOutroButton.current) {
          videoContainer.removeChild(skipOutroButton.current);
        }
      };
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
