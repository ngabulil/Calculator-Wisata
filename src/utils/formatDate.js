export default function formatDateOnly(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
