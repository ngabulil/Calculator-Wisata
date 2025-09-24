export const formatCurrencyWithCode = (value, currency = "IDR") => {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  } else {
    const exchangeRate = parseFloat(localStorage.getItem("invoiceExchangeRate") || "1");
    const convertedValue = value / exchangeRate;
    const roundedValue = Math.round(convertedValue);
    return `${roundedValue.toLocaleString("id-ID")} ${currency}`;
  }
};

export const formatCurrency = (amount, currency = "IDR") => {
  return formatCurrencyWithCode(amount, currency);
};