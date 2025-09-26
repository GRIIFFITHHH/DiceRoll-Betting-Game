// lib/utils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const FAUCET_AMOUNT = 50.0;
export const MIN_BET = 1.0;
export const MAX_BET = 1000.0;
