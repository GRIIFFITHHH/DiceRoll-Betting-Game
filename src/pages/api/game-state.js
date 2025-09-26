// pages/api/game-state.js
import { db, initializePlayer } from "../../lib/db";
import { players } from "../../lib/schema";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let playerData = await db.select().from(players).limit(1);

    if (playerData.length === 0) {
      await initializePlayer();
      playerData = await db.select().from(players).limit(1);
    }

    const player = playerData[0];

    res.status(200).json({
      balance: player.balance,
      totalWins: player.totalWins,
      totalLosses: player.totalLosses,
      totalWinAmount: player.totalWinAmount,
      totalLossAmount: player.totalLossAmount,
    });
  } catch (error) {
    console.error("Game state error:", error);
    res.status(500).json({ error: "Failed to load game state" });
  }
}
