export const calculateFinalPrice = (basePrice, type, value) => {
  if (type === "fixed") return basePrice + value
  if (type === "percent") return basePrice + (basePrice * value) / 100
  return basePrice
}
