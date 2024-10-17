
import { useRef } from 'react';
import {
  BigPlayButton,
  ControlBar,
  CurrentTimeDisplay,
  ForwardControl,
  LoadingSpinner,
  PlaybackRateMenuButton,
  Player,
  ReplayControl,
  TimeDivider,
  VolumeMenuButton
} from 'video-react';
import "video-react/dist/video-react.css";

interface VideoProps {
  src: string,
  handleDuration?: (e: number) => void
}
export const VideoJS = ({ src, handleDuration }: VideoProps) => {
  const playerRef = useRef(null);

  const handleLoadedMetadata = () => {
    if (playerRef.current) {
      const currentPlayer = playerRef.current.getState().player;
      handleDuration(currentPlayer.duration);
    }
  };
  return (
    <Player poster="/images/video-logo.png" ref={playerRef} onLoadedMetadata={handleLoadedMetadata} >
      <source src={src} />
      <BigPlayButton position="center" />
      <LoadingSpinner />
      <ControlBar>
        <ReplayControl seconds={10} order={1.1} />
        <ForwardControl seconds={10} order={1.1} />
        <CurrentTimeDisplay order={4.1} />
        <TimeDivider order={4.2} />
        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
        <VolumeMenuButton vertical />
      </ControlBar>
    </Player>
  )
};

export default VideoJS;
