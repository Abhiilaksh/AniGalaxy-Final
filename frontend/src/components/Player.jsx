import { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr from "plyr-react";
import "plyr-react/plyr.css"; // Import Plyr CSS

const VideoPlayer = ({ videoUrl }) => {
  const playerRef = useRef(null); // Reference for the Plyr component

  useEffect(() => {
    // Initialize Plyr player
    const player = playerRef.current.plyr;

    // Check if HLS.js is supported
    if (Hls.isSupported()) {
      const hls = new Hls();

      // Load the video URL (HLS stream)
      hls.loadSource(videoUrl);

      // Attach HLS to the Plyr player
      hls.attachMedia(player.media);

      // Listen for HLS errors
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.fatal) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error encountered.');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error encountered.');
              break;
            case Hls.ErrorTypes.OTHER_ERROR:
              console.error('Other error encountered.');
              break;
            default:
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    }
  }, [videoUrl]);

  return (
    <div className="video-container w-full max-w-4xl mx-auto ml-24">
      <Plyr ref={playerRef} />
    </div>
  );
};

export default VideoPlayer;