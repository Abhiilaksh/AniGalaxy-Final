import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import Video.js CSS
import "videojs-contrib-quality-levels"; // Quality levels plugin

const VideoPlayer = ({ videoUrl, subtitleUrl }) => {
  const videoNode = useRef(null); // Reference for the video DOM node
  const player = useRef(null); // Reference for the Video.js instance

  useEffect(() => {
    if (videoNode.current) {
      // Initialize Video.js player
      player.current = videojs(videoNode.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: false, // Disable fluid mode for fixed size
        preload: "auto",
        playbackRates: [0.5, 1, 1.5, 2], // Speed control
        sources: [
          {
            src: videoUrl,
            type: "application/x-mpegURL", // HLS MIME type
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

      // Handle fullscreen landscape mode
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
    }

    
  }, [videoUrl, subtitleUrl]);

  return (
    <div
      className="video-container h-[200px] md:h-[550px] md:w-[95%] md:pl-16 mt-[-10px]"
      style={{
        // Fixed height for the container
     // Full width
        position: "relative", // Optional for overlay or additional styles
      }}
    >
      <video
        ref={videoNode}
        className="video-js vjs-default-skin vjs-big-play-centered"
        style={{
          height: "100%", // Ensure the video fills the container height
          width: "100%", // Ensure the video fills the container width
          objectFit: "contain", // Adjust this based on your preference (cover, contain, fill)
        }}
      />
    </div>
  );
};

export default VideoPlayer;
