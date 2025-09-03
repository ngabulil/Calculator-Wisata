export function roundPrice(value) {
  if (typeof value !== "number" || isNaN(value)) {
    return 0;
  }
  return Math.round(value / 1000) * 1000;
}