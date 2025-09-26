import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { players, bets } from "@lib/schema.js";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema: { players, bets } });

// Initialize database with default player if not exists
export async function initializePlayer() {
  try {
    const existingPlayer = await db.select().from(players).limit(1);
    if (existingPlayer.length === 0) {
      await db.insert(players).values({
        balance: 1000.0,
        totalWins: 0,
        totalLosses: 0,
        totalWinAmount: 0,
        totalLossAmount: 0,
      });
    }
    return await db.select().from(players).limit(1);
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}
