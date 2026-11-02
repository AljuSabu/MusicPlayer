export type Track = {
  id: string;
  name: string;
  duration: number; // seconds
  artist_id: string;
  artist_name: string;
  album_id: string;
  album_name: string;
  image: string; // cover art URL
  audio: string; // stream URL
  license_ccurl: string;
  shareurl: string;
};

export type JamendoResponse<T> = {
  headers: {
    status: string;
    code: number;
    error_message: string;
    results_count: number;
  };
  results: T[];
};

export type Playlist = {
  id: string;
  name: string;
  creator?: string;
  trackCount: number;
  coverGradient: string; //Tailwind gradient classes
};