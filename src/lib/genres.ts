export type Genre = {
  slug: string;
  name: string;
  tagline: string;
  gradient: string;
};

export const genres: Genre[] = [
  {
    slug: "electronic",
    name: "Electronic",
    tagline: "Synths, beats and big drops",
    gradient: "from-[#A6E23A] to-[#4CD964]",
  },
  {
    slug: "ambient",
    name: "Ambient",
    tagline: "Spacious textures for deep focus",
    gradient: "from-[#4CD964] to-[#1BC5A0]",
  },
  {
    slug: "chillout",
    name: "Chillout",
    tagline: "Slow down and unwind",
    gradient: "from-[#1BC5A0] to-[#0E6B5C]",
  },
  {
    slug: "techno",
    name: "Techno",
    tagline: "Driving rhythms, all night",
    gradient: "from-[#0E6B5C] to-[#0B3D3A]",
  },
  {
    slug: "lofi",
    name: "Lo-Fi Beats",
    tagline: "Dusty loops for study and rest",
    gradient: "from-[#A6E23A] to-[#7BC62D]",
  },
  {
    slug: "hiphop",
    name: "Hip-Hop",
    tagline: "Beats, bars and soul",
    gradient: "from-[#2E9E5B] to-[#146B45]",
  },
  {
    slug: "jazz",
    name: "Jazz",
    tagline: "Smooth keys and late nights",
    gradient: "from-[#4CD964] to-[#A6E23A]",
  },
  {
    slug: "rock",
    name: "Rock",
    tagline: "Guitars turned all the way up",
    gradient: "from-[#1BC5A0] to-[#4CD964]",
  },
];

const moreGenres: Genre[] = [
  {
    slug: "pop",
    name: "Pop",
    tagline: "Catchy hooks and bright melodies",
    gradient: "from-[#7BC62D] to-[#1BC5A0]",
  },
  {
    slug: "classical",
    name: "Classical",
    tagline: "Timeless strings and piano",
    gradient: "from-[#0E6B5C] to-[#4CD964]",
  },
  {
    slug: "soundtrack",
    name: "Soundtrack",
    tagline: "Cinematic scores and themes",
    gradient: "from-[#1BC5A0] to-[#146B45]",
  },
  {
    slug: "world",
    name: "World",
    tagline: "Sounds from every corner",
    gradient: "from-[#A6E23A] to-[#1BC5A0]",
  },
];

export const allGenres: Genre[] = [...genres, ...moreGenres];
