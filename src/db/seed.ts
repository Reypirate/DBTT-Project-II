import { db } from "./index";
import { products } from "./schema";
import { PRODUCTS } from "../data/products";
import * as dotenv from "dotenv";
import logger from "../lib/pino";

// Load environment variables from .env or .env.local
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  logger.info("⏳ Starting seed process...");

  if (!process.env.DATABASE_URL) {
    logger.warn(
      "⚠️ DATABASE_URL is not set. Cannot run actual seeding. Please configure .env properly.",
    );
    process.exit(1);
  }

  // Insert actual products from our local data file
  logger.info(`Starting to seed ${PRODUCTS.length} products...`);

  for (const product of PRODUCTS) {
    await db
      .insert(products)
      .values({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price.toString(), // Convert to string for Drizzle's numeric field
        image: product.image,
        description: product.description,
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          image: product.image,
          description: product.description,
        },
      });
  }

  logger.info("✅ Seeding completed successfully");
  process.exit(0);
}

main().catch((e) => {
  logger.error(e, "❌ Seeding failed");
  process.exit(1);
});
