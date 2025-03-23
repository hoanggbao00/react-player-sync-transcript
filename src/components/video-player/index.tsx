import { memo, RefObject, useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { formatSecondsToHHMMSS } from "../../utils/format-time";
import { ToggleFullscreen } from "./toggle-fullscreen";
import { PlaySeekControl } from "./play-seek-control";
import { VolumeControl } from "./volume-control";
import { defaultUrl } from "../../data";

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
  seekStep?: number
  /**
   * Ref object to access player events
   */
  ref?: RefObject<ReactPlayer | null>;
}

function VideoPlayerInner({ url = defaultUrl, onProgress, seekStep,  ref }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSeekForward = useCallback(() => {
    const currentTime = playerRef.current?.getCurrentTime();
    const step = seekStep ?? 5

    if (currentTime && currentTime + step < duration) {
      playerRef.current?.seekTo(currentTime + step);
    }
  }, [duration, seekStep]);

  const handleSeekBackward = useCallback(() => {
    const currentTime = playerRef.current?.getCurrentTime();
    const step = seekStep ?? 5
    if (currentTime && currentTime - step > 0) {
      playerRef.current?.seekTo(currentTime - step);
    }
  }, [seekStep]);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => !prev);
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
  }, [handleFullscreen, handlePlayPause, handleSeekBackward, handleSeekForward]);

  return (
    <div className="w-fit aspect-video overflow-hidden">
      <div className="relative" ref={containerRef}>
        <ReactPlayer
          ref={(node) => {
            if (node) {
              if (ref) ref.current = node;
              playerRef.current = node;
            }
          }}
          url={url}
          playing={isPlaying}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
          onProgress={({ played, playedSeconds }) => {
            setPlayed(played);
            onProgress?.(playedSeconds)
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          controls={false}
          volume={volume}
          muted={muted}
          onDuration={setDuration}
        />

        {/* Custom controls */}
        <div className="absolute bottom-0 inset-x-0">
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
            className="w-full absolute -top-3"
          />

          {/* Controls */}
          <div className="flex items-center gap-4 text-white bg-black/50 p-2 justify-between">
            {/* Play/Pause, Seek Backward, Seek Forward */}
            <div className="flex items-center gap-2">
              <PlaySeekControl
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onSeekBackward={handleSeekBackward}
                onSeekForward={handleSeekForward}
              />
              <VolumeControl muted={muted} volume={volume} onToggleMuted={toggleMuted} onVolumeChange={setVolume} />
            </div>

            {/* Time, Fullscreen */}
            <div className="flex items-center gap-2">
              <time className="text-xs">
                {formatSecondsToHHMMSS(played * duration)} / {formatSecondsToHHMMSS(duration)}
              </time>

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
