import React, { useEffect, useRef, useCallback } from "react";
import videojs from "video.js";
import { useNavigate } from "react-router-dom";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";

const VideoPlayer = ({ videoUrl, subtitleUrl, outro, intro, next }) => {
  const videoNode = useRef(null);
  const player = useRef(null);
  const skipIntroButton = useRef(null);
  const nextEpisodeButton = useRef(null);
  const navigate = useNavigate();

  const createButton = useCallback((text, onClickHandler, additionalClasses) => {
    const button = document.createElement("button");
    button.className = `absolute z-50 px-5 py-3 rounded-md hover:bg-opacity-100 ${additionalClasses}`;
    button.innerHTML = text;
    button.onclick = onClickHandler;
    button.style.display = "none";
    button.style.position = "absolute";
    button.style.backgroundColor = "rgba(0, 0, 0, 0.35)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";
    button.style.fontSize = "16px";
    button.style.fontWeight = "500";
    return button;
  }, []);

  useEffect(() => {
    if (videoNode.current) {
      const initializePlayer = () => {
        player.current = videojs(videoNode.current, {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: false,
          preload: "auto",
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
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
          html5: {
            hls: {
              enableLowInitialPlaylist: true,
              smoothQualityChange: true,
            },
          },
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

          if (next) {
            nextEpisodeButton.current = createButton(
              "Next Episode",
              () => {
                if (next) {
                  // Save current timestamp before navigating
                  localStorage.setItem(`video-progress-${videoUrl}`, player.current.currentTime());
                  navigate(`/watch/${next}`);
                }
              },
              "bottom-14 right-12"
            );
            container.appendChild(nextEpisodeButton.current);
          }

          container.appendChild(skipIntroButton.current);
        };

        createAndAppendButtons();

        // Handle button visibility with smooth transitions
        const updateButtonVisibility = () => {
          const currentTime = player.current.currentTime();
          
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
            skipIntroButton.current, 
            intro && currentTime >= intro.start && currentTime < intro.end
          );

          updateButtonDisplay(
            nextEpisodeButton.current,
            outro && currentTime >= outro.start && currentTime < outro.end
          );
        };

        const handleFullscreenChange = () => {
          if (player.current.isFullscreen()) {
            // Prevent screen sleep in fullscreen
            if ('wakeLock' in navigator) {
              navigator.wakeLock.request('screen').catch(err => 
                console.warn('Wake Lock error:', err)
              );
            }
            
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

          const actions = {
            Space: () => {
              e.preventDefault();
              player.current.paused() ? player.current.play() : player.current.pause();
            },
            ArrowLeft: () => {
              e.preventDefault();
              const skipAmount = e.shiftKey ? 10 : 5;
              player.current.currentTime(Math.max(0, player.current.currentTime() - skipAmount));
            },
            ArrowRight: () => {
              e.preventDefault();
              const skipAmount = e.shiftKey ? 10 : 5;
              player.current.currentTime(player.current.currentTime() + skipAmount);
            },
            ArrowUp: () => {
              e.preventDefault();
              player.current.volume(Math.min(1, player.current.volume() + (e.shiftKey ? 0.2 : 0.1)));
            },
            ArrowDown: () => {
              e.preventDefault();
              player.current.volume(Math.max(0, player.current.volume() - (e.shiftKey ? 0.2 : 0.1)));
            },
            KeyM: () => {
              e.preventDefault();
              player.current.muted(!player.current.muted());
            },
            KeyF: () => {
              e.preventDefault();
              player.current.isFullscreen() ? player.current.exitFullscreen() : player.current.requestFullscreen();
            }
          };

          if (actions[e.code]) {
            actions[e.code]();
          }
        };

        // Save progress periodically
        const saveProgressInterval = setInterval(() => {
          if (player.current) {
            localStorage.setItem(`video-progress-${videoUrl}`, player.current.currentTime());
          }
        }, 5000);

        const savedProgress = localStorage.getItem(`video-progress-${videoUrl}`);
        if (savedProgress) {
          player.current.currentTime(parseFloat(savedProgress));
        }

        player.current.on("fullscreenchange", handleFullscreenChange);
        player.current.on("timeupdate", updateButtonVisibility);
        document.addEventListener("keydown", handleKeyPress);
        
        player.current.on('ended', () => {
          if (next) {
            navigate(`/watch/${next}`);
          }
        });

        return () => {
          clearInterval(saveProgressInterval);
          if (player.current) {
            localStorage.setItem(`video-progress-${videoUrl}`, player.current.currentTime());
          }
          document.removeEventListener("keydown", handleKeyPress);
          player.current.dispose();
        };
      };

      initializePlayer();
    }
  }, [videoUrl, subtitleUrl, intro, outro, next, navigate, createButton]);

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