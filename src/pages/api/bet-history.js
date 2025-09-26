// pages/api/bet-history.js
import { db, initializePlayer } from "../../lib/db";
import { bets, players } from "../../lib/schema";
import { desc, eq } from "drizzle-orm";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get current player
    let playerData = await db.select().from(players).limit(1);

    if (playerData.length === 0) {
      await initializePlayer();
      playerData = await db.select().from(players).limit(1);
    }

    const player = playerData[0];

    // Get bet history for player
    const betHistory = await db
      .select()
      .from(bets)
      .where(eq(bets.playerId, player.id))
      .orderBy(desc(bets.createdAt))
      .limit(50);

    // Convert isWin from number to boolean for frontend
    const formattedHistory = betHistory.map((bet) => ({
      ...bet,
      isWin: bet.isWin === 1,
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Bet history error:", error);
    res.status(500).json({ error: "Failed to load bet history" });
  }
}
