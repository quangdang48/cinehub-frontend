import { useEffect } from 'react';

interface KeyboardShortcuts {
  togglePlay: () => void;
  toggleFullscreen: () => void;
  toggleMute: () => void;
  skip: (seconds: number) => void;
  setVolume: (volume: number) => void;
  currentVolume: number;
}

export const useKeyboardShortcuts = ({
  togglePlay,
  toggleFullscreen,
  toggleMute,
  skip,
  setVolume,
  currentVolume,
}: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang focus vào input hoặc textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      switch (key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        
        case 'arrowleft':
          e.preventDefault();
          skip(-10);
          break;
        
        case 'arrowright':
          e.preventDefault();
          skip(10);
          break;
        
        case 'j':
          e.preventDefault();
          skip(-10);
          break;
        
        case 'l':
          e.preventDefault();
          skip(10);
          break;

        case 'f11':
          e.preventDefault();
          toggleFullscreen();
          break;
        
        case 'arrowup':
          e.preventDefault();
          setVolume(currentVolume + 0.1);
          break;
        
        case 'arrowdown':
          e.preventDefault();
          setVolume(currentVolume - 0.1);
          break;
        
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, skip, setVolume, currentVolume]);
};
