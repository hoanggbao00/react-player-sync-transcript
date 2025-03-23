import { Maximize2 } from "lucide-react";
import { memo } from "react";

interface ToggleFullscreenProps {
  onToggleFullscreen: () => void;
}

export const ToggleFullscreen = memo(({ onToggleFullscreen }: ToggleFullscreenProps) => {
  return (
    <button onClick={onToggleFullscreen}>
      <Maximize2 size={16} />
    </button>
  )
})
