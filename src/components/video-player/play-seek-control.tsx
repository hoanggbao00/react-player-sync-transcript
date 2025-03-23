import { PlayIcon, RewindIcon } from "lucide-react";
import { PauseIcon } from "lucide-react";
import { memo } from "react";

interface PlaySeekProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
}

export const PlaySeekControl = memo(({ isPlaying, onPlayPause, onSeekBackward, onSeekForward }: PlaySeekProps) => {
  return (
    <>
      <button onClick={onSeekBackward}>
        <RewindIcon size={16} />
      </button>
      <button onClick={onPlayPause}>{isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}</button>
      <button onClick={onSeekForward}>
        <RewindIcon size={16} className="rotate-180" />
      </button>
    </>
  );
});
