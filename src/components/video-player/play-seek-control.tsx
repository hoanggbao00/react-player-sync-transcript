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
      <button onClick={onSeekBackward} className="hover:text-white/60" title='Rewind 5s'>
        <RewindIcon size={24} />
      </button>
      <button onClick={onPlayPause} className="hover:text-white/60" title={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <PauseIcon size={48} /> : <PlayIcon size={48} />}
      </button>
      <button onClick={onSeekForward} title='Forward 5s'>
        <RewindIcon size={24} className="rotate-180 hover:text-white/60" />
      </button>
    </>
  );
});
