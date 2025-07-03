export default function formatRupiah(angka) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
}
