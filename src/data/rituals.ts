export const UPCOMING_RITUALS = [
  {
    id: "1",
    name: "Qingming Festival (Tomb Sweeping Day)",
    date: "2026-04-05",
    lunarDate: "3rd Month, 19th Day",
    description:
      "A traditional festival for honoring ancestors by sweeping their tombs, offering food, and burning joss paper.",
    type: "festival",
    isUpcoming: true,
  },
  {
    id: "2",
    name: "Grandpa Lim's Death Anniversary",
    date: "2026-05-12",
    lunarDate: "4th Month, 26th Day",
    description: "Annual remembrance for Grandpa Lim (Hokkien tradition).",
    type: "personal",
    isUpcoming: true,
  },
  {
    id: "3",
    name: "Guan Yin Bodhisattva's Enlightenment Day",
    date: "2026-07-28",
    lunarDate: "6th Month, 19th Day",
    description:
      "Celebrating the day Guan Yin attained enlightenment. Devotees visit temples and offer prayers.",
    type: "deity",
    isUpcoming: false,
  },
  {
    id: "4",
    name: "Hungry Ghost Festival Starts",
    date: "2026-08-13",
    lunarDate: "7th Month, 1st Day",
    description: "First day of the Ghost Month when the gates of hell are opened.",
    type: "festival",
    isUpcoming: false,
  },
];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface InventoryItem extends Product {
  stock: number;
  threshold: number;
}

export const PRODUCTS: Product[] = [
  /* [NANO BANANA PROMPT: A high-quality, cinematic product shot of traditional Chinese joss paper gold ingots arranged neatly on a premium dark wood table, warm lighting, deep red background, photorealistic, 4k] */
  {
    id: "PROD-001",
    name: "Premium Gold Joss Paper (Stack)",
    category: "Paper Offerings",
    price: 5.5,
    image: "/images/joss_paper.png",
    description: "Traditional premium gold joss paper money used for Chinese rituals.",
  },
  {
    id: "PROD-002",
    name: "Sandalwood Incense (Box)",
    category: "Incense",
    price: 12.0,
    image: "/images/sandalwood_incense.png",
    description: "High-quality sandalwood incense sticks with low smoke.",
  },
  /* [NANO BANANA PROMPT: A high-quality, cinematic product shot of thick red Chinese ceremonial candles with gold characters, traditional altar setting, warm candlelight, deep red background, photorealistic, 4k] */
  {
    id: "PROD-003",
    name: "Giant Red Candles (Pair)",
    category: "Candles",
    price: 18.0,
    image: "/images/red_candles.png",
    description: "Thick red incense candles with gold Chinese characters inscribed.",
  },
  /* [NANO BANANA PROMPT: A high-quality, cinematic product shot of fresh, vibrant yellow ceremonial nana bananas placed on an elegant traditional red plate, warm lighting, deep red background, photorealistic, 4k] */
  {
    id: "PROD-004",
    name: "Ceremonial Nana Banana",
    category: "Food Offerings",
    price: 6.5,
    image: "/images/nana_banana.png",
    description:
      "Fresh, vibrant yellow bananas placed on an elegant traditional red plate for offerings.",
  },
  {
    id: "PROD-005",
    name: "Paper Clothing (Male Set)",
    category: "Paper Offerings",
    price: 8.5,
    image: "/images/paper_clothing.png",
    description: "Traditional paper clothing offering set.",
  },
  {
    id: "PROD-006",
    name: "Tea Leaves Offering Pack",
    category: "Food Offerings",
    price: 4.0,
    image: "/images/tea_leaves.png",
    description: "Premium tea leaves for daily altar rituals.",
  },
];

export const MOCK_INVENTORY: InventoryItem[] = PRODUCTS.map((p) => ({
  ...p,
  stock: Math.floor(Math.random() * 100) + 5, // Random stock between 5-105
  threshold: 20,
}));
