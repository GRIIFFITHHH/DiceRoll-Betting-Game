// pages/api/faucet.js
import { db, initializePlayer } from "@lib/db";
import { players } from "@lib/schema";
import { eq } from "drizzle-orm";
import { FAUCET_AMOUNT } from "@lib/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    // Only allow faucet if balance is 0 or negative
    if (player.balance > 0) {
      return res
        .status(400)
        .json({ error: "Faucet only available when balance is zero or below" });
    }

    // Add faucet amount to balance
    const newBalance = player.balance + FAUCET_AMOUNT;

    await db
      .update(players)
      .set({ balance: newBalance })
      .where(eq(players.id, player.id));

    const updatedPlayer = await db
      .select()
      .from(players)
      .where(eq(players.id, player.id))
      .limit(1);

    res.status(200).json({
      success: true,
      amount: FAUCET_AMOUNT,
      gameState: {
        balance: updatedPlayer[0].balance,
        totalWins: updatedPlayer[0].totalWins,
        totalLosses: updatedPlayer[0].totalLosses,
        totalWinAmount: updatedPlayer[0].totalWinAmount,
        totalLossAmount: updatedPlayer[0].totalLossAmount,
      },
    });
  } catch (error) {
    console.error("Faucet error:", error);
    res.status(500).json({ error: "Failed to process faucet request" });
  }
}
