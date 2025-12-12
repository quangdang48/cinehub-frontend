import React, { memo, useCallback, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  MonitorPlay,
  PictureInPicture2,
  Loader2,
} from "lucide-react";
import {
  useHLS,
  useVideoState,
  useVideoControls,
  useFullscreen,
  useKeyboardShortcuts,
  useControlsVisibility,
  useQualityLevels,
} from "./hooks";
import {
  formatTime,
  calculateProgress,
  PLAYBACK_RATES,
  formatPlaybackRate,
} from "../../utils/videoUtils";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  onError?: (error: any) => void;
}

export interface VideoQuality {
  label: string;
  value: number;
  height: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = memo(
  ({
    src,
    poster,
    title,
    onTimeUpdate,
    onEnded,
    autoPlay = false,
    onError,
  }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showQuality, setShowQuality] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    const hlsRef = useHLS({ videoRef, src, onError });

    const { state } = useVideoState({ videoRef, onTimeUpdate, onEnded });
    const controls = useVideoControls({ videoRef, state });
    const { isFullscreen, toggleFullscreen } = useFullscreen({ containerRef });
    const { showControls, handleMouseMove, handleMouseLeave } =
      useControlsVisibility({
        isPlaying: state.isPlaying,
      });
    const { availableQualities, currentQuality, setQuality } = useQualityLevels(
      {
        videoRef,
        hlsRef,
      },
    );

    useKeyboardShortcuts({
      togglePlay: controls.togglePlay,
      toggleFullscreen,
      toggleMute: controls.toggleMute,
      skip: controls.skip,
      setVolume: controls.setVolume,
      currentVolume: state.volume,
    });

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      controls.setVolume(parseFloat(e.target.value));
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      controls.seekToPercent(percent);
    };

    const handlePlaybackRateChange = (rate: number) => {
      controls.setPlaybackRate(rate);
      setShowSettings(false);
    };

    const handleQualityChange = (height: number) => {
      setQuality(height);
      setShowQuality(false);
    };

    const progressPercent = calculateProgress(
      state.currentTime,
      state.duration,
    );
    const bufferedPercent = calculateProgress(state.buffered, state.duration);

    const handleVideoAreaClick = useCallback(
      (e: React.MouseEvent) => {
        if (
          (e.target as HTMLElement).closest("button") ||
          (e.target as HTMLElement).closest("input")
        ) {
          return;
        }
        controls.togglePlay();
      },
      [controls.togglePlay],
    );
    return (
      <div
        ref={containerRef}
        className="relative group bg-black overflow-hidden shadow-2xl w-full aspect-video rounded-2xl shadow-black/50"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleVideoAreaClick}
      >
        {/* Watermark */}
        <div className="absolute top-4 right-4 z-50 pointer-events-none opacity-70">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span className="text-xs text-gray-400">Cung cấp bởi</span>
            <span className="font-bold text-yellow-500">CineHub.com</span>
          </div>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          poster={poster}
          className="w-full h-full object-contain"
          autoPlay={autoPlay}
        />

        {/* Loading Spinner */}
        {state.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 pointer-events-none">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-yellow-500/30 animate-pulse" />
            </div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        {!state.isPlaying && !state.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50 pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-2xl animate-pulse scale-150" />
              <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/50">
                <Play className="w-10 h-10 text-black ml-1" fill="black" />
              </div>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black via-transparent to-black/50 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar */}
          <div
            className={`absolute top-0 left-0 right-0 p-4 transition-opacity ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <h3 className="text-white font-bold text-lg drop-shadow-lg">
                {title}
              </h3>
            )}
          </div>

          {/* Center Controls */}
          <div
            className={`absolute inset-0 flex items-center justify-center gap-8 transition-opacity ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                controls.skip(-10);
              }}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                controls.togglePlay();
              }}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
            >
              {state.isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                controls.skip(10);
              }}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 space-y-3 transition-opacity ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress"
              onClick={handleSeek}
              role="slider"
              aria-label="Video progress"
              aria-valuemin={0}
              aria-valuemax={state.duration}
              aria-valuenow={state.currentTime}
            >
              {/* Buffered */}
              <div
                className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                style={{ width: `${bufferedPercent}%` }}
              />
              {/* Progress */}
              <div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-500/50 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
              {/* Glow effect */}
              <div
                className="absolute inset-y-0 left-0 bg-yellow-500/30 blur-sm rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={controls.togglePlay}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  {state.isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={() => controls.skip(-10)}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => controls.skip(10)}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div
                  className="relative flex items-center gap-2"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button
                    onClick={controls.toggleMute}
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    {state.isMuted || state.volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${showVolumeSlider ? "w-24 opacity-100" : "w-0 opacity-0"}`}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={state.isMuted ? 0 : state.volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400"
                    />
                  </div>
                </div>

                <span className="text-white text-sm font-medium tabular-nums">
                  {formatTime(state.currentTime)} / {formatTime(state.duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Quality Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowQuality(!showQuality)}
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    <MonitorPlay
                      className={`w-5 h-5 transition-transform ${showQuality ? "rotate-12" : ""}`}
                    />
                  </button>

                  {showQuality && availableQualities.length > 0 && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden min-w-[120px]">
                      <div className="p-2 border-b border-white/10">
                        <span className="text-gray-400 text-xs font-medium">
                          Chất lượng
                        </span>
                      </div>
                      <div className="p-1">
                        {availableQualities.map((quality) => (
                          <button
                            key={quality.height}
                            onClick={() => handleQualityChange(quality.height)}
                            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                              currentQuality === quality.height
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "text-white hover:bg-white/10"
                            }`}
                          >
                            {quality.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    <Settings
                      className={`w-5 h-5 transition-transform ${showSettings ? "rotate-90" : ""}`}
                    />
                  </button>

                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden min-w-[150px]">
                      <div className="p-2 border-b border-white/10">
                        <span className="text-gray-400 text-xs font-medium">
                          Tốc độ phát
                        </span>
                      </div>
                      <div className="p-1">
                        {PLAYBACK_RATES.map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handlePlaybackRateChange(rate)}
                            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                              state.playbackRate === rate
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "text-white hover:bg-white/10"
                            }`}
                          >
                            {formatPlaybackRate(rate)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PiP */}
                <button
                  onClick={controls.togglePictureInPicture}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  <PictureInPicture2 className="w-5 h-5" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
