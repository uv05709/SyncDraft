const ADJECTIVES = [
  "Swift",
  "Nova",
  "Pixel",
  "Bright",
  "Calm",
  "Spark",
  "Cloud",
  "Echo",
  "Velvet",
  "Summit"
];

const NOUNS = [
  "Writer",
  "Editor",
  "Creator",
  "Thinker",
  "Builder",
  "Scholar",
  "Pilot",
  "Scribe",
  "Maker",
  "Dreamer"
];

const COLORS = [
  "#2563EB",
  "#D946EF",
  "#059669",
  "#EA580C",
  "#7C3AED",
  "#0891B2",
  "#DC2626",
  "#4338CA"
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function buildGuestUser(userId: string) {
  const seed = hashString(userId);
  const adjective = ADJECTIVES[seed % ADJECTIVES.length];
  const noun = NOUNS[(seed + 7) % NOUNS.length];
  const color = COLORS[(seed + 3) % COLORS.length];

  return {
    id: userId,
    info: {
      name: `${adjective} ${noun}`,
      color,
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
        userId
      )}&backgroundColor=bfdbfe,c4b5fd,fbcfe8`
    }
  };
}
