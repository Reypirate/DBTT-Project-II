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
  {
    id: "PROD-003",
    name: "Giant Red Candles (Pair)",
    category: "Candles",
    price: 18.0,
    image: "/images/red_candles.png",
    description: "Thick red incense candles with gold Chinese characters inscribed.",
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
  {
    id: "PROD-007",
    name: "Traditional Lamp Oil (1L)",
    category: "Altar Supplies",
    price: 14.0,
    image: "/images/lamp_oil.png",
    description:
      "Premium aromatic oil for longevity lamps and continuous burning at household altars.",
  },
];

export const MOCK_INVENTORY: InventoryItem[] = PRODUCTS.map((p) => ({
  ...p,
  stock: Math.floor(Math.random() * 100) + 5, // Random stock between 5-105
  threshold: 20,
}));
