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
  velocity: number;
  projectedDemand: number;
  trend: "up" | "down" | "flat";
}

export const PRODUCTS: Product[] = [
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
    category: "Incense & Candles",
    price: 12.0,
    image: "/images/sandalwood_incense.png",
    description: "High-quality sandalwood incense sticks with low smoke.",
  },
  {
    id: "PROD-003",
    name: "Giant Red Candles (Pair)",
    category: "Incense & Candles",
    price: 18.0,
    image: "/images/red_candles.png",
    description: "Thick red incense candles with gold Chinese characters inscribed.",
  },
  {
    id: "PROD-004",
    name: "1-7 Days Ritual Candles (Large)",
    category: "Incense & Candles",
    price: 24.5,
    image: "/images/ritual_candles_large.png",
    description:
      "Large format ritual candles designed for continuous burning during 7-day memorial cycles.",
  },
  {
    id: "PROD-005",
    name: "Paper Clothing (Male Set)",
    category: "Paper Offerings",
    price: 8.5,
    image: "/images/paper_clothing.png",
    description: "Traditional paper clothing offering set for ancestral remembrance.",
  },
  {
    id: "PROD-006",
    name: "Tea Leaves Offering Pack",
    category: "Food Offerings",
    price: 4.0,
    image: "/images/tea_leaves.png",
    description:
      "Premium tea leaves specially packed for daily altar rituals and ancestral offerings.",
  },
  {
    id: "PROD-007",
    name: "Traditional Lamp Oil (1L)",
    category: "Altar Supplies",
    price: 14.0,
    image: "/images/lamp_oil.png",
    description:
      "Premium aromatic oil for longevity lamps and continuous burning at household altars.",
  },
  {
    id: "PROD-008",
    name: "6 Assorted Auspicious Candies",
    category: "Food Offerings",
    price: 6.8,
    image: "/images/auspicious_candies.png",
    description:
      "A mix of traditional sweet treats and candies representing sweetness and prosperity.",
  },
  {
    id: "PROD-009",
    name: "Incense Coils (24hr Duration)",
    category: "Incense & Candles",
    price: 15.0,
    image: "/images/incense_coils.png",
    description:
      "Long-burning incense coils ideal for temple visits or home fragrance during festivals.",
  },
  {
    id: "PROD-010",
    name: "Silver Joss Paper Squares",
    category: "Paper Offerings",
    price: 4.5,
    image: "/images/silver_joss_paper.png",
    description:
      "High-quality silver foil joss paper for honoring ancestors and wandering spirits.",
  },
  {
    id: "PROD-011",
    name: "Prosperity Huat Kueh (Set of 3)",
    category: "Food Offerings",
    price: 7.5,
    image: "/images/huat_kueh.png",
    description: "Traditional steamed 'prosperity' cakes symbolizing growth and financial success.",
  },
  {
    id: "PROD-012",
    name: "Longevity Peaches (Shou Tao)",
    category: "Food Offerings",
    price: 12.0,
    image: "/images/longevity_peaches.png",
    description: "Exquisitely shaped peach buns used to wish for longevity and health for elders.",
  },
  {
    id: "PROD-015",
    name: "Luxury Paper Mansion (Qingming)",
    category: "Paper Offerings",
    price: 125.0,
    image: "/images/luxury_paper_mansion.png",
    description:
      "Intricately designed paper villa with fully furnished interiors for major rituals.",
  },
  {
    id: "PROD-016",
    name: "Ancestor Gold Bar Box (10pcs)",
    category: "Paper Offerings",
    price: 9.5,
    image: "/images/gold_bar_box.png",
    description: "Gold-foil paper ingots symbolizing wealth and financial security for ancestors.",
  },
  {
    id: "PROD-018",
    name: "Traditional Aromatic Wood Powder",
    category: "Altar Supplies",
    price: 19.5,
    image: "/images/aromatic_wood_powder.png",
    description: "Finely ground aromatic wood for use in high-end incense burners.",
  },
  {
    id: "PROD-019",
    name: "Red Lotus Candles (Pair)",
    category: "Incense & Candles",
    price: 16.0,
    image: "/images/red_lotus_candles.png",
    description:
      "Lotus-shaped candles symbolizing purity and enlightenment, used for deity offerings.",
  },
  {
    id: "PROD-020",
    name: "Mixed Fruit Offering Platter",
    category: "Food Offerings",
    price: 25.0,
    image: "/images/mixed_fruit_platter.png",
    description:
      "A curated selection of five essential fruits for significant ceremonial occasions.",
  },
];

export const MOCK_INVENTORY: InventoryItem[] = PRODUCTS.map((p) => {
  const isSurging = [
    "Premium Gold Joss Paper (Stack)",
    "Sandalwood Incense (Box)",
    "1-7 Days Ritual Candles (Large)",
    "Longevity Peaches (Shou Tao)",
  ].includes(p.name);

  const trendRand = Math.random();
  const trend = isSurging ? "up" : trendRand > 0.6 ? "up" : trendRand > 0.3 ? "down" : "flat";

  return {
    ...p,
    stock: Math.floor(Math.random() * 100) + 5,
    threshold: 20,
    velocity: isSurging ? Math.floor(Math.random() * 20) + 60 : Math.floor(Math.random() * 45) + 5,
    projectedDemand: isSurging
      ? Math.floor(Math.random() * 15) + 35
      : Math.floor(Math.random() * 40) * (trend === "up" ? 1 : trend === "down" ? -1 : 0),
    trend,
  };
});
