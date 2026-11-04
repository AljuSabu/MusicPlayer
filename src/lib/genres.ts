export type Genre = { slug: string; name: string; gradient: string };

export const genres: Genre[] = [
  {
    slug: "electronic",
    name: "Electronic",
    gradient: "from-[#A6E23A] to-[#4CD964]",
  },
  { slug: "ambient", name: "Ambient", gradient: "from-[#4CD964] to-[#1BC5A0]" },
  {
    slug: "chillout",
    name: "Chillout",
    gradient: "from-[#1BC5A0] to-[#0E6B5C]",
  },
  { slug: "techno", name: "Techno", gradient: "from-[#0E6B5C] to-[#0B3D3A]" },
  {
    slug: "lofi",
    name: "Lo-Fi Beats",
    gradient: "from-[#A6E23A] to-[#7BC62D]",
  },
  { slug: "hiphop", name: "Hip-Hop", gradient: "from-[#2E9E5B] to-[#146B45]" },
  { slug: "jazz", name: "Jazz", gradient: "from-[#4CD964] to-[#A6E23A]" },
  { slug: "rock", name: "Rock", gradient: "from-[#1BC5A0] to-[#4CD964]" },
];
