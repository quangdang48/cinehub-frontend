import { useRef, useEffect } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

export interface VideoInfo {
  videoSrc: string;
}

export interface UseVideoPlayerProps extends VideoInfo {}

const VideoPlayerComponent = (props: UseVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  /**
   * Define video options to be sent to player
   */
  const getVideoOptions = () => {
    let source = {
      src: props.videoSrc,
      type: "application/x-mpegURL"
    } as any;

    return {
      autoplay: false,
      controls: true,
      responsive: true,

      fluid: true,
      sources: [source],
    };
  };

  useEffect(() => {
    const options = getVideoOptions();
    console.log("setup videoJS options >> ", { options });

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement as HTMLDivElement);

      const player = videojs(videoElement, options, () => {
        // onVideoPlayerReady(player);
      });

      playerRef.current = player;
      
      //   (player as any).hlsQualitySelector({ // for this, you must install https://www.npmjs.com/package/videojs-hls-quality-selector
      //     displayCurrentQuality: true,
      //   });
    }
  }, [videoRef.current, props.videoSrc]);


  return (
    <div>
      <h1>Video player</h1>
      <div data-vjs-player>
        <div ref={videoRef as any} />
      </div>
    </div>
  );
};

export default VideoPlayerComponent;