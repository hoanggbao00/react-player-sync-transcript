import { memo, RefObject, useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { formatSecondsToHHMMSS } from "../../utils/format-time";
import { ToggleFullscreen } from "./toggle-fullscreen";
import { PlaySeekControl } from "./play-seek-control";
import { VolumeControl } from "./volume-control";

interface VideoPlayerProps {
  url?: string;
  /**
   * Function called every seconds played
   * @param progress seconds on number
   * @returns void
   */
  onProgress?: (progress: number) => void;
  /**
   * Seek Step on seconds
   * @default 5
   */
  seekStep?: number;
  /**
   * Ref object to access player events
   */
  ref?: RefObject<ReactPlayer | null>;
}

function VideoPlayerInner({ url, onProgress, seekStep, ref }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopPropagation = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(
    (e?: React.MouseEvent) => {
      stopPropagation(e);
      setIsPlaying((prev) => {
        const controlRef = containerRef.current?.querySelector("#video-controls") as HTMLDivElement;
        if (prev) {
          if (controlRef) {
            controlRef.style.opacity = "1";
          }
        } else {
          if (timeOutRef.current) clearTimeout(timeOutRef.current);
          timeOutRef.current = setTimeout(() => {
            controlRef.style.opacity = "0";
          }, 2000);
        }

        return !prev;
      });
    },
    [stopPropagation],
  );

  const handleSeekForward = useCallback(
    (e?: React.MouseEvent) => {
      stopPropagation(e);
      const currentTime = playerRef.current?.getCurrentTime();
      const step = seekStep ?? 5;

      if (currentTime && currentTime + step < duration) {
        playerRef.current?.seekTo(currentTime + step);
      }
    },
    [duration, seekStep, stopPropagation],
  );

  const handleSeekBackward = useCallback(
    (e?: React.MouseEvent) => {
      stopPropagation(e);
      const currentTime = playerRef.current?.getCurrentTime();
      const step = seekStep ?? 5;
      if (currentTime && currentTime - step > 0) {
        playerRef.current?.seekTo(currentTime - step);
      }
    },
    [seekStep, stopPropagation],
  );

  const toggleMuted = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const handleVolumeControl = useCallback((type: "increase" | "decrease") => {
    setVolume((prev) => {
      const step = type === "increase" ? 0.05 : -0.05;

      if (prev + step <= 0 && prev + step >= 1) return prev;

      return prev + step;
    });
  }, []);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  }, []);

  // Handle keydown
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          handlePlayPause();
          e.preventDefault();
          break;
        case "ArrowLeft":
          handleSeekBackward();
          break;
        case "ArrowRight":
          handleSeekForward();
          break;
        case "ArrowUp":
          handleVolumeControl("increase");
          break;
        case "ArrowDown":
          handleVolumeControl("decrease");
          break;
        case "f":
          handleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { signal });

    return () => {
      controller.abort();
    };
  }, [handleFullscreen, handlePlayPause, handleSeekBackward, handleSeekForward, handleVolumeControl]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const controlsElement = e.currentTarget.querySelector("#video-controls") as HTMLDivElement;

    if (controlsElement) {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
      controlsElement.style.opacity = "1";
      document.documentElement.style.cursor = "auto";
      timeOutRef.current = setTimeout(() => {
        if (!playerRef.current?.props.playing) return;
        controlsElement.style.opacity = "0";
        document.documentElement.style.cursor = "none";
      }, 2000);
    }
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent) => {
    const controlsElement = e.currentTarget.querySelector("#video-controls") as HTMLDivElement;

    if (controlsElement && playerRef.current?.props.playing) {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
      controlsElement.style.opacity = "0";
    }
  }, []);

  return (
    <div className="w-fit aspect-video overflow-hidden">
      <div className="relative" ref={containerRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <ReactPlayer
          ref={(node) => {
            if (node) {
              if (ref) ref.current = node;
              playerRef.current = node;
            }
          }}
          url={url}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0
              },
            },
          }}
          loop={false}
          playing={isPlaying}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
          onProgress={({ played, playedSeconds }) => {
            setPlayed(played);
            onProgress?.(playedSeconds);
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          controls={false}
          volume={volume}
          muted={muted}
          onDuration={setDuration}
          playsinline
        />

        {/* Custom controls */}
        <div
          className="absolute inset-0 bg-black/20 rounded-xl opacity-0 transition-opacity duration-500"
          id="video-controls"
          onClick={handlePlayPause}
        >
          <div className="absolute w-full flex justify-center top-1/2 -translate-y-1/2 gap-4 text-white [&>button]:cursor-pointer [&>button]:transition-colors">
            <PlaySeekControl
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeekBackward={handleSeekBackward}
              onSeekForward={handleSeekForward}
            />
          </div>

          {/* Controls */}
          <div
            className="absolute w-full bottom-0 bg-gradient-to-b from-transparent to to-black z-10 p-2 pt-4"
            onClick={stopPropagation}
          >
            <input
              type="range"
              min={0}
              max={1}
              value={played}
              step={0.01}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                setPlayed(newValue);
                playerRef.current?.seekTo(newValue);
              }}
              className="w-full accent-purple-500"
            />
            <div className="flex items-center gap-4 text-white justify-between">
              <div className="flex items-center gap-4">
                <time className="text-xs">
                  {formatSecondsToHHMMSS(played * duration)} / {formatSecondsToHHMMSS(duration)}
                </time>
                <VolumeControl muted={muted} volume={volume} onToggleMuted={toggleMuted} onVolumeChange={setVolume} />
              </div>

              {/*Fullscreen */}
              <ToggleFullscreen onToggleFullscreen={handleFullscreen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VideoPlayer = memo(VideoPlayerInner);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
