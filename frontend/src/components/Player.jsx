import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import Video.js CSS

const VideoPlayer = ({ videoUrl,subtitleUrl }) => {
  const videoNode = useRef(null); // Reference for the video DOM node
  const player = useRef(null); // Reference for the Video.js instance

  useEffect(() => {
    // Initialize Video.js player
    if (videoNode.current) {
      player.current = videojs(videoNode.current, {
        autoplay:true,
        controls: true,
        responsive: true,
        fluid: true, // Makes the player responsive
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
              kind: "captions", // Type of track
              label: "English", // Subtitle language
              src: subtitleUrl, // Subtitle URL
              srclang: "en", // Language code (optional)
              default: true, // Make it default if it's the first subtitle
            },
          ]
        : [],
      });

      // Add error handling
      player.current.on("error", () => {
        console.error("An error occurred during playback.");
      });
    }
   
  }, [videoUrl]);

  return (
    <div className="video-container" style={{ minHeight: '300px', width: '100%' }}>
      <video
        ref={videoNode}
        className="video-js vjs-default-skin vjs-big-play-centered"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default VideoPlayer;
