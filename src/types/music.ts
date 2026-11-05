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

export type Artist = {
  id: string;
  name: string;
  image: string;
  joindate?: string;
};

export type Album = {
  id: string;
  name: string;
  releasedate?: string;
  artist_id: string;
  artist_name: string;
  image: string;
};

export type PlaylistResult = {
  id: string;
  name: string;
  user_name?: string;
};
