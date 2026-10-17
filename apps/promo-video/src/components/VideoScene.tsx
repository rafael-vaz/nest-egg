import {AbsoluteFill, OffthreadVideo, staticFile} from "remotion";
import {Caption} from "./Caption";
import {FPS} from "../constants";

export function secondsToFrames(seconds: number, fps: number): number {
  return seconds * fps;
}

interface IVideoSceneProps {
  src: string;
  caption: string;
  startFromSeconds: number;
  playbackRate: number;
}

export const VideoScene: React.FC<IVideoSceneProps> = ({
  src,
  caption,
  startFromSeconds,
  playbackRate,
}) => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={secondsToFrames(startFromSeconds, FPS)}
        playbackRate={playbackRate}
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
      <Caption text={caption} variant="support" />
    </AbsoluteFill>
  );
};
