import { parsePaketDays } from "./parseOnePaket";
export async function parseAndMergeDays(rawDays = []) {
  const parsedDays = await parsePaketDays(rawDays);

  const enrich = (items, parsedItems, nameKey, fallbackPrefix) =>
    (items || []).map((item, i) => ({
      ...item,
      displayName:
        parsedItems?.[i]?.name ||
        item.name ||
        item[nameKey]?.name ||
        item[nameKey]?.label ||
        `${fallbackPrefix} ${i + 1}`,
    }));

  const merged = rawDays.map((rawDay, index) => {
    const parsedDay = parsedDays[index] || {};

    return {
      ...rawDay,
      hotels: enrich(rawDay.hotels, parsedDay.hotels, "hotel", "Hotel"),
      villas: enrich(rawDay.villas, parsedDay.villas, "villa", "Villa"),
      mobils: enrich(rawDay.mobils, parsedDay.mobils, "mobil", "Mobil"),
      restaurants: enrich(rawDay.restaurants, parsedDay.restaurants, "resto", "Restoran"),
      destinations: enrich(rawDay.destinations, parsedDay.destinations, "destinasi", "Destinasi"),
      activities: enrich(rawDay.activities, parsedDay.activities, "aktivitas", "Aktivitas"),
      transport_additionals: enrich(rawDay.transport_additionals, parsedDay.transport_additionals, null, "Tambahan Transportasi"),
      akomodasi_additionals: enrich(rawDay.akomodasi_additionals, parsedDay.akomodasi_additionals, null, "Tambahan Akomodasi"),
    };
  });

  return merged;
}

export default parseAndMergeDays;