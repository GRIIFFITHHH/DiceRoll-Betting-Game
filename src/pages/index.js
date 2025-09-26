// pages/index.js
import { useState, useEffect } from "react";
import { formatCurrency } from "@lib/utils";

export default function Home() {
  const [gameState, setGameState] = useState({
    balance: 0,
    totalWins: 0,
    totalLosses: 0,
    totalWinAmount: 0,
    totalLossAmount: 0,
  });
  const [betAmount, setBetAmount] = useState("");
  const [guessedNumber, setGuessedNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [recentBets, setRecentBets] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");

  // Load initial game state
  useEffect(() => {
    loadGameState();
    loadRecentBets();
  }, []);

  const loadGameState = async () => {
    try {
      const response = await fetch("/api/game-state");
      if (response.ok) {
        const data = await response.json();
        setGameState(data);
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
    }
  };

  const loadRecentBets = async () => {
    try {
      const response = await fetch("/api/bet-history");
      if (response.ok) {
        const data = await response.json();
        setRecentBets(data);
      }
    } catch (error) {
      console.error("Failed to load bet history:", error);
    }
  };

  const rollDice = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError("Please enter a valid bet amount");
      return;
    }

    setIsRolling(true);
    setError("");

    try {
      const response = await fetch("/api/roll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(betAmount),
          guessedNumber: guessedNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Roll failed");
      }

      // Animate dice roll
      setTimeout(() => {
        setLastRoll(result);
        setGameState(result.gameState);
        loadRecentBets();
        setBetAmount("");
        setIsRolling(false);
      }, 1500);
    } catch (error) {
      setError(error.message);
      setIsRolling(false);
    }
  };

  const useFaucet = async () => {
    try {
      const response = await fetch("/api/faucet", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setGameState(data.gameState);
      }
    } catch (error) {
      console.error("Faucet failed:", error);
    }
  };

  const getDiceEmoji = (number) => {
    const diceEmojis = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return diceEmojis[number] || "🎲";
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        🎲 Dice Betting Game
      </h1>

      {/* Game Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#f0f8ff",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
            border: "2px solid #4a90e2",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Balance</h3>
          <p
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "bold",
              color: gameState.balance <= 0 ? "#e74c3c" : "#27ae60",
            }}
          >
            {formatCurrency(gameState.balance)}
          </p>
        </div>

        <div
          style={{
            background: "#f0f8f0",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Wins</h3>
          <p style={{ margin: 0, fontSize: "18px", color: "#27ae60" }}>
            {gameState.totalWins} ({formatCurrency(gameState.totalWinAmount)})
          </p>
        </div>

        <div
          style={{
            background: "#fff0f0",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Losses</h3>
          <p style={{ margin: 0, fontSize: "18px", color: "#e74c3c" }}>
            {gameState.totalLosses} ({formatCurrency(gameState.totalLossAmount)}
            )
          </p>
        </div>
      </div>

      {/* Faucet Button */}
      {gameState.balance <= 0 && (
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <button
            onClick={useFaucet}
            style={{
              backgroundColor: "#f39c12",
              color: "white",
              border: "none",
              padding: "15px 30px",
              fontSize: "20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💰 Get $50.00 (Faucet)
          </button>
        </div>
      )}

      {/* Betting Interface */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Place Your Bet
        </h2>

        {/* Last Roll Result */}
        {lastRoll && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              background: lastRoll.isWin ? "#d4edda" : "#f8d7da",
              borderRadius: "8px",
              border: lastRoll.isWin
                ? "1px solid #c3e6cb"
                : "1px solid #f5c6cb",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>
              {getDiceEmoji(lastRoll.rolledNumber)}
            </div>
            <p
              style={{ margin: "5px 0", fontSize: "18px", fontWeight: "bold" }}
            >
              Rolled: {lastRoll.rolledNumber} | Your guess:{" "}
              {lastRoll.guessedNumber}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "bold",
                color: lastRoll.isWin ? "#155724" : "#721c24",
              }}
            >
              {lastRoll.isWin
                ? `You won ${formatCurrency(lastRoll.amount)}!`
                : `You lost ${formatCurrency(lastRoll.amount)}`}
            </p>
          </div>
        )}

        {/* Rolling Animation */}
        {isRolling && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "48px", animation: "spin 0.5s infinite" }}>
              🎲
            </div>
            <p>Rolling the dice...</p>
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        )}

        {/* Betting Form */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Bet Amount:
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
              max={gameState.balance}
              step="0.01"
              placeholder="Enter bet amount"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
              disabled={isRolling || gameState.balance <= 0}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Guess the dice (1-6):
            </label>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setGuessedNumber(num)}
                  style={{
                    padding: "10px 15px",
                    border:
                      guessedNumber === num
                        ? "2px solid #4a90e2"
                        : "1px solid #ddd",
                    borderRadius: "8px",
                    background: guessedNumber === num ? "#e3f2fd" : "#fff",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  disabled={isRolling}
                >
                  {getDiceEmoji(num)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling || gameState.balance <= 0 || !betAmount}
            style={{
              padding: "15px",
              backgroundColor: isRolling ? "#ccc" : "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: isRolling ? "not-allowed" : "pointer",
            }}
          >
            {isRolling ? "Rolling..." : "🎲 Roll Dice!"}
          </button>

          {error && (
            <p style={{ color: "#e74c3c", textAlign: "center", margin: 0 }}>
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Bet History */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0 }}>Recent Bets</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: "none",
              border: "1px solid #4a90e2",
              color: "#4a90e2",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showHistory ? "Hide History" : "Show All History"}
          </button>
        </div>

        {recentBets.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No bets yet. Place your first bet!
          </p>
        ) : (
          <div
            style={{
              maxHeight: showHistory ? "none" : "300px",
              overflowY: "auto",
            }}
          >
            {(showHistory ? recentBets : recentBets.slice(0, 5)).map((bet) => (
              <div
                key={bet.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "8px",
                  background: bet.isWin ? "#f8f9fa" : "#fff5f5",
                  borderLeft: bet.isWin
                    ? "4px solid #28a745"
                    : "4px solid #dc3545",
                  borderRadius: "4px",
                }}
              >
                <div>
                  <span style={{ fontSize: "20px", marginRight: "10px" }}>
                    {getDiceEmoji(bet.rolledNumber)}
                  </span>
                  <span>
                    Bet {formatCurrency(bet.amount)} on {bet.guessedNumber},
                    rolled {bet.rolledNumber}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: bet.isWin ? "#28a745" : "#dc3545",
                    }}
                  >
                    {bet.isWin ? "+" : "-"}
                    {formatCurrency(bet.amount)}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Balance: {formatCurrency(bet.balanceAfter)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
