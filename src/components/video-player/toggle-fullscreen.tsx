import { Maximize2 } from "lucide-react";
import { memo } from "react";

interface ToggleFullscreenProps {
  onToggleFullscreen: () => void;
}

export const ToggleFullscreen = memo(({ onToggleFullscreen }: ToggleFullscreenProps) => {
  return (
    <button onClick={onToggleFullscreen} title="Toggle fullscreen" className="hover:text-white/80 transition-colors cursor-pointer">
      <Maximize2 size={20} />
    </button>
  );
});
