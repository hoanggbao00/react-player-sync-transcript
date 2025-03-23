import { useCallback, useEffect, useRef, useState } from "react";
import VideoPlayer from "./components/video-player";
import { ITranscript } from "./types/transcript.types";
import TranscriptItem from "./components/transcript-item";
import ReactPlayer from "react-player";
import { defaultUrl, mockTranscriptData } from "./data";

export default function App() {
  const [transcriptData] = useState<ITranscript | null>(mockTranscriptData);
  const [activeTimestamp, setActiveTimestamp] = useState<number | undefined>();
  const [url, setUrl] = useState(defaultUrl);
  const playerRef = useRef<ReactPlayer>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeChange = useCallback(
    (currentTime: number) => {
      if (!transcriptData?.segments) return;
      console.log("change");

      // Find the nearest timestamp entry
      let nearestIndex = 0;
      let minDiff = Number.POSITIVE_INFINITY;

      transcriptData.segments.forEach((entry, index) => {
        const timestampSeconds = entry.start;
        const diff = Math.abs(timestampSeconds - currentTime);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIndex = index;
        }
      });

      // Set active timestamp
      const newActiveTimestamp = transcriptData.segments[nearestIndex].start;
      if (newActiveTimestamp !== activeTimestamp) {
        setActiveTimestamp(newActiveTimestamp);
      }
    },
    [transcriptData?.segments, activeTimestamp],
  );

  const handleClick = useCallback((timestamp: number) => {
    setActiveTimestamp(timestamp);

    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      const newProgress = timestamp / duration;
      playerRef?.current?.seekTo(newProgress);
    }
  }, []);

  useEffect(() => {
    if (transcriptData?.segments[0]) {
      setActiveTimestamp(transcriptData.segments[0].start);
    }
  }, [transcriptData]);

  const onLoad = useCallback(() => {
    if (inputRef.current) {
      setUrl(inputRef.current.value || defaultUrl);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center gap-4">
      <div>
        <VideoPlayer onProgress={handleTimeChange} ref={playerRef} url={url} />
        <div className="flex gap-2 items-center mt-2">
          <label htmlFor="input">Enter URL:</label>{" "}
          <input
            defaultValue="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            ref={inputRef}
            type="url"
            className="px-2 py-1 border rounded"
          />
          <button onClick={onLoad} className="border bg-neutral-200 px-2 py-1 rounded">Load</button>
        </div>
      </div>
      <div className="h-screen py-26">
        <p className="text-center mb-2">Transcript for default video only</p>
        <div className="h-full overflow-auto">
          {transcriptData?.segments.map((entry, index) => (
            <TranscriptItem
              key={entry.start}
              item={entry}
              isActive={activeTimestamp === entry.start}
              onClick={handleClick}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
