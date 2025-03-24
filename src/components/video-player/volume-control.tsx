import { Volume1, Volume2 } from "lucide-react";

import { VolumeOff } from "lucide-react";
import { memo } from "react";

interface VolumeControlProps {
  muted: boolean;
  volume: number;
  onToggleMuted: () => void;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = memo(({ muted, volume, onToggleMuted, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onToggleMuted} className="hover:text-white/80 transition-colors cursor-pointer" title={muted ? 'Unmute' : 'Mute'}>
        {muted ? <VolumeOff size={20} /> : volume > 0.5 ? <Volume2 size={20} /> : <Volume1 size={20} />}
      </button>
      <input
        type="range"
        min={0}
        step={0.01}
        max={1}
        value={muted ? 0 : volume}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          onVolumeChange(newValue);
        }}
        className="w-16 accent-purple-500"
      />
    </div>
  );
});
