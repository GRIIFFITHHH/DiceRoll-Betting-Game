<h1>Features</h1>

- Single-player dice betting (guess 1-6)  
- Server-side randomness using `crypto.randomInt`  
- Balance persistence with SQLite database  
- Bet history tracking  
- Win/loss statistics  
- Faucet system for when balance reaches zero  
- Currency formatting with USD display  

<h1>Setup Instructions</h1>

1. <b>Install dependencies:</b>  
   ```bash
   pnpm install
<b>Initialize the database:</b>

bash
Copy code
pnpm run db:push
<b>Start the development server:</b>

bash
Copy code
pnpm run dev
<b>Visit the game:</b>
Open http://localhost:3000 in your browser.

<h1>Game Rules</h1>
Place a bet between $1.00 and $1000.00

Choose a number from 1-6

If the dice roll matches your guess, you win and double your bet

If wrong, you lose your bet amount

When balance reaches $0, use the faucet to get $50.00

<h1>Tech Stack</h1>
<b>Framework:</b> Next.js (Pages Router)

<b>Database:</b> SQLite with Drizzle ORM

<b>Styling:</b> Inline styles (no external CSS frameworks)

<b>Language:</b> JavaScript (no TypeScript)

<h1>Database Schema</h1> <h2>Players Table</h2>
id - Primary key

balance - Current balance

totalWins - Number of wins

totalLosses - Number of losses

totalWinAmount - Total amount won

totalLossAmount - Total amount lost

<h2>Bets Table</h2>
id - Primary key

playerId - Foreign key to players

amount - Bet amount

guessedNumber - Player's guess (1-6)

rolledNumber - Actual dice roll (1-6)

isWin - Whether the bet won (0/1)

balanceAfter - Balance after the bet

createdAt - Timestamp

<h1>API Endpoints</h1>
GET /api/game-state - Get current player stats

POST /api/roll - Place a bet and roll dice

POST /api/faucet - Get free money when balance is zero

GET /api/bet-history - Get betting history

<h1>Configuration</h1>
<b>Faucet Amount:</b> $50.00 (configurable in lib/utils.js)

<b>Min Bet:</b> $1.00

<b>Max Bet:</b> $1000.00

<b>Starting Balance:</b> $1000.00
