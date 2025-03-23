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
    <div className="flex items-center gap-2">
      <button onClick={onToggleMuted}>
        {muted ? <VolumeOff size={16} /> : volume > 0.5 ? <Volume2 size={16} /> : <Volume1 size={16} />}
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
        className="w-16"
      />
    </div>
  );
});
