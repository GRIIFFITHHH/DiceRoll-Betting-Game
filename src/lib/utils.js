// lib/utils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const FAUCET_AMOUNT = 100.0;
export const MIN_BET = 1.0;
export const MAX_BET = 10000.0;
