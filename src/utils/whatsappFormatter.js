export const generateWhatsAppMessage = ({ hotels = [], villas = [], tours = [], extras = [], total }) => {
  let lines = []

  if (hotels.length > 0) {
    lines.push("# *Hotel*")
    hotels.forEach((h, i) => {
      lines.push(`${i + 1}. ${h.hotelName} – ${h.nights} malam – Rp ${h.totalPrice.toLocaleString("id-ID")}`)
    })
    lines.push("") // newline
  }

  if (villas.length > 0) {
    lines.push("# *Villa*")
    villas.forEach((v, i) => {
      lines.push(`${i + 1}. ${v.villaName} – ${v.nights} malam – Rp ${v.totalPrice.toLocaleString("id-ID")}`)
    })
    lines.push("")
  }

  if (tours.length > 0) {
    lines.push("# *Tour*")
    tours.forEach((t, i) => {
      lines.push(`${i + 1}. ${t.tourName} – Rp ${t.finalPrice.toLocaleString("id-ID")}`)
    })
    lines.push("")
  }

  if (extras.length > 0) {
    lines.push("# *Biaya Tambahan*")
    extras.forEach((e, i) => {
      lines.push(`${i + 1}. ${e.label} – Rp ${e.finalPrice.toLocaleString("id-ID")}`)
    })
    lines.push("")
  }

  lines.push(`# *Total Keseluruhan*: Rp ${total.toLocaleString("id-ID")}`)
  lines.push("")
  lines.push("Silakan konfirmasi untuk booking. Terima kasih!")

  return lines.join("\n")
}
