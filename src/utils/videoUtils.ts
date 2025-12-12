export const formatTime = (time: number): string => {
  if (!isFinite(time) || time < 0) return '00:00';

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const calculateProgress = (current: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
};

export const isHLSStream = (url: string): boolean => {
  return url.includes('.m3u8');
};

export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export const formatPlaybackRate = (rate: number): string => {
  return rate === 1 ? 'Bình thường' : `${rate}x`;
};

export const normalizeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

