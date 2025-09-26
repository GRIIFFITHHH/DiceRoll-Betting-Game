// pages/api/roll.js
import { db, initializePlayer } from "../../lib/db";
import { players, bets } from "../../lib/schema";
import { eq } from "drizzle-orm";
import { MIN_BET, MAX_BET } from "../../lib/utils";
import { randomInt } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, guessedNumber } = req.body;

    // Validate inputs
    if (!amount || !guessedNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (amount < MIN_BET || amount > MAX_BET) {
      return res
        .status(400)
        .json({ error: `Bet must be between $${MIN_BET} and $${MAX_BET}` });
    }

    if (guessedNumber < 1 || guessedNumber > 6) {
      return res
        .status(400)
        .json({ error: "Guessed number must be between 1 and 6" });
    }

    // Get current player
    let playerData = await db.select().from(players).limit(1);

    if (playerData.length === 0) {
      await initializePlayer();
      playerData = await db.select().from(players).limit(1);
    }

    const player = playerData[0];

    // Check if player has enough balance
    if (player.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Roll the dice (server-side randomness)
    const rolledNumber = randomInt(1, 7);
    const isWin = rolledNumber === guessedNumber;

    // Calculate new balance
    const newBalance = isWin
      ? player.balance + amount
      : player.balance - amount;

    // Update player stats
    const updatedStats = {
      balance: newBalance,
      totalWins: isWin ? player.totalWins + 1 : player.totalWins,
      totalLosses: isWin ? player.totalLosses : player.totalLosses + 1,
      totalWinAmount: isWin
        ? player.totalWinAmount + amount
        : player.totalWinAmount,
      totalLossAmount: isWin
        ? player.totalLossAmount
        : player.totalLossAmount + amount,
    };

    // Update player in database
    await db.update(players).set(updatedStats).where(eq(players.id, player.id));

    // Record the bet
    await db.insert(bets).values({
      playerId: player.id,
      amount: amount,
      guessedNumber: guessedNumber,
      rolledNumber: rolledNumber,
      isWin: isWin ? 1 : 0,
      balanceAfter: newBalance,
    });

    // Return the result
    res.status(200).json({
      rolledNumber,
      guessedNumber,
      isWin,
      amount,
      gameState: updatedStats,
    });
  } catch (error) {
    console.error("Roll error:", error);
    res.status(500).json({ error: "Failed to process roll" });
  }
}
