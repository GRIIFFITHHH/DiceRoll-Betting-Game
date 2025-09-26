import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const players = sqliteTable("players", {
  id: integer("id").primaryKey(),
  balance: real("balance").notNull().default(1000.0),
  totalWins: integer("total_wins").notNull().default(0),
  totalLosses: integer("total_losses").notNull().default(0),
  totalWinAmount: real("total_win_amount").notNull().default(0),
  totalLossAmount: real("total_loss_amount").notNull().default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bets = sqliteTable("bets", {
  id: integer("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  amount: real("amount").notNull(),
  guessedNumber: integer("guessed_number").notNull(),
  rolledNumber: integer("rolled_number").notNull(),
  isWin: integer("is_win").notNull(), // 0 or 1 (boolean)
  balanceAfter: real("balance_after").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
