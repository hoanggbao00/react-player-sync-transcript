import { memo, useCallback, useEffect, useState } from "react";
import { ITranscriptionSegment } from "../types/transcript.types";
import { formatSecondsToHHMMSS } from "../utils/format-time";

interface TranscriptItemProps {
  item: ITranscriptionSegment;
  isActive: boolean;
  onClick: (timestamp: number) => void;
  index: number;
}

const TranscriptItemInner = ({ item, isActive, onClick: onClickProps, index }: TranscriptItemProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeOut = index * 100;
    if (timeOut > 1000) timeOut = 1000;
    setTimeout(() => {
      setIsVisible(true);
    }, timeOut);
  }, [index]);

  const onClick = useCallback(() => {
    onClickProps(item.start);
  }, [onClickProps, item.start]);

  return (
    <div
      key={item.start}
      className={`flex gap-4 p-2 text-sm rounded-lg transition-colors hover:bg-purple-400/20 items-center cursor-pointer ${
        isActive ? "bg-blue-300/50" : ""
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={onClick}
    >
      <span
        className={`inline-block font-medium rounded-lg transition-colors px-2 py-1 h-fit ${
          isActive ? "bg-blue-500 text-white" : "bg-neutral-100 "
        }`}
      >
        {formatSecondsToHHMMSS(item.start)}
      </span>
      <p dangerouslySetInnerHTML={{ __html: item.text }} />
    </div>
  );
};

TranscriptItemInner.displayName = "TranscriptItem";
const TranscriptItem = memo(TranscriptItemInner);

export default TranscriptItem;
