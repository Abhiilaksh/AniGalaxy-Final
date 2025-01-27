import React, { useEffect, useRef, useCallback } from "react";
import Plyr from "plyr";
import Hls from "hls.js";
import "plyr/dist/plyr.css";
import { useNavigate } from "react-router-dom";

const VideoPlayer = ({ videoUrl, subtitleUrl, outro, intro, next }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const navigate = useNavigate();
  const skipIntroRef = useRef(null);
  const nextEpisodeRef = useRef(null);

  const createButton = useCallback((text, onClickHandler, additionalClasses) => {
    const button = document.createElement("button");
    button.className = `plyr__control absolute z-50 px-5 py-3 rounded-md ${additionalClasses}`;
    button.innerHTML = text;
    button.onclick = onClickHandler;
    button.style.display = "none";
    button.style.position = "absolute";
    button.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";
    button.style.fontSize = "14px";
    button.style.fontWeight = "500";
    return button;
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Plyr with captions settings
    playerRef.current = new Plyr(videoRef.current, {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'captions',
        'settings',
        'fullscreen'
      ],
      settings: ['captions', 'quality', 'speed'],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
      tooltips: { controls: true, seek: true },
      keyboard: { focused: true, global: true },
      captions: { active: true, update: true, language: 'en' }
    });

    // Setup HLS
    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current.loadSource(videoUrl);
      hlsRef.current.attachMedia(videoRef.current);

      // Handle HLS manifest loaded
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        // Handle quality levels
        const availableQualities = hlsRef.current.levels.map((l) => l.height);
        const qualityOptions = availableQualities.map((quality) => {
          return { default: quality === availableQualities[0], label: `${quality}p`, value: quality };
        });
        playerRef.current.quality = qualityOptions;

        // Enable captions if available
        if (subtitleUrl) {
          // Remove existing tracks
          while (videoRef.current.firstChild) {
            videoRef.current.removeChild(videoRef.current.firstChild);
          }

          // Add new track
          const track = document.createElement('track');
          track.kind = 'captions';
          track.label = 'English';
          track.srclang = 'en';
          track.src = subtitleUrl;
          track.default = true;
          videoRef.current.appendChild(track);

          // Force captions update
          setTimeout(() => {
            if (playerRef.current) {
              playerRef.current.currentTrack = 0;
              playerRef.current.toggleCaptions(true);
            }
          }, 0);
        }
      });

      // Handle quality changes
      playerRef.current.on('qualitychange', (e) => {
        if (hlsRef.current) {
          hlsRef.current.currentLevel = e.detail.value;
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      videoRef.current.src = videoUrl;
    }

    // Add custom buttons
    const container = videoRef.current.parentElement;
    
    if (intro) {
      skipIntroRef.current = createButton(
        "Skip Intro",
        () => {
          if (playerRef.current) {
            playerRef.current.currentTime = intro.end;
          }
        },
        "bottom-14 right-12"
      );
      container.appendChild(skipIntroRef.current);
    }

    if (next) {
      nextEpisodeRef.current = createButton(
        "Next Episode",
        () => {
          localStorage.setItem(`video-progress-${videoUrl}`, playerRef.current.currentTime);
          navigate(`/watch/${next}`);
        },
        "bottom-14 right-12"
      );
      container.appendChild(nextEpisodeRef.current);
    }

    // Handle button visibility
    const updateButtonVisibility = () => {
      if (!playerRef.current) return;

      const currentTime = playerRef.current.currentTime;
      
      const updateButtonDisplay = (button, shouldShow) => {
        if (button) {
          button.style.transition = 'opacity 0.3s ease';
          button.style.opacity = shouldShow ? '1' : '0';
          setTimeout(() => {
            button.style.display = shouldShow ? 'block' : 'none';
          }, shouldShow ? 0 : 300);
        }
      };

      updateButtonDisplay(
        skipIntroRef.current,
        intro && currentTime >= intro.start && currentTime < intro.end
      );

      updateButtonDisplay(
        nextEpisodeRef.current,
        outro && currentTime >= outro.start && currentTime < outro.end
      );
    };

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      if (playerRef.current.fullscreen.active) {
        if ('wakeLock' in navigator) {
          navigator.wakeLock.request('screen').catch(err => 
            console.warn('Wake Lock error:', err)
          );
        }
        
        if (screen.orientation?.lock) {
          screen.orientation.lock("landscape").catch((error) => {
            console.warn("Failed to lock orientation:", error);
          });
        }
      } else {
        if (screen.orientation?.unlock) {
          screen.orientation.unlock();
        }
      }
    };

    

    

    
    playerRef.current.on('timeupdate', updateButtonVisibility);
    playerRef.current.on('enterfullscreen', handleFullscreenChange);
    playerRef.current.on('exitfullscreen', handleFullscreenChange);
    playerRef.current.on('ended', () => {
      if (next) {
        navigate(`/watch/${next}`);
      }
    });

  
    
  }, [videoUrl, subtitleUrl, intro, outro, next, navigate, createButton]);

  return (
    <div className="video-container relative h-[200px] md:h-[550px] md:w-[95%] md:pl-16 mt-[-10px]">
      <video
        ref={videoRef}
        className="plyr-react plyr"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default VideoPlayer;