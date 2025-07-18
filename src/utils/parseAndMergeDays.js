import { parseData } from "./parseData";

export async function parseAndMergeDays(rawDays = []) {
  const parsedDays = await parseData(rawDays);

const enrich = (items, parsedItems, nameKey, fallbackPrefix, extraFields = []) =>
  (items || []).map((item, i) => {
    const parsedItem = parsedItems?.[i] || {};
    const enriched = {
      ...item,
      displayName:
        parsedItem.name ||
        item.name ||
        item[nameKey]?.name ||
        item[nameKey]?.label ||
        `${fallbackPrefix} ${i + 1}`,
    };

    extraFields.forEach((field) => {
      enriched[field] = parsedItem[field] ?? item[field] ?? 0;
    });

    return enriched;
  });

  const merged = rawDays.map((rawDay, index) => {
    const parsedDay = parsedDays[index] || {};

    return {
      ...rawDay,
      date: rawDay.date,
      hotels: enrich(rawDay.hotels, parsedDay.hotels, "hotel", "Hotel", ["star"]),
      villas: enrich(rawDay.villas, parsedDay.villas, "villa", "Villa", ["star"]),
      restaurants: enrich(rawDay.restaurants, parsedDay.restaurants, "resto", "Restoran"),
      mobils: enrich(rawDay.mobils, parsedDay.mobils, "mobil", "Mobil"),
      destinations: enrich(rawDay.destinations, parsedDay.destinations, "destinasi", "Destinasi"),
      activities: enrich(rawDay.activities, parsedDay.activities, "aktivitas", "Aktivitas"),
      transport_additionals: enrich(rawDay.transport_additionals, parsedDay.transport_additionals, null, "Tambahan Transportasi"),
      akomodasi_additionals: enrich(rawDay.akomodasi_additionals, parsedDay.akomodasi_additionals, null, "Tambahan Akomodasi"),
    };
  });

  return merged;
}

export default parseAndMergeDays;