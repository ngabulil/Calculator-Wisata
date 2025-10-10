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
      description: parsedItem.description || item.description || "",
    };

    extraFields.forEach((field) => {
      enriched[field] = parsedItem[field] ?? item[field] ?? 0;
    });
    return enriched;
  });

   const enrichTourItems = (items, parsedItems) => 
    (items || []).map((item, i) => {
      const parsedItem = parsedItems?.[i] || {};
      
      let displayName = parsedItem.name || item.name || '';
      if (!displayName) {
        if (item.id_destinasi) {
          displayName = item.destinasi?.name || `Destination ${i + 1}`;
        } else if (item.id_activity) {
          displayName = item.aktivitas?.name || `Activity ${i + 1}`;
        } else if (item.id_resto) {
          displayName = item.resto?.name || `Restaurant ${i + 1}`;
        } else {
          displayName = `Tour Item ${i + 1}`;
        }
      }

      return {
        ...item,
        displayName,
        description: parsedItem.description || item.description || ""
      };
    });

  const parseAdditionalByGroup = (rawItems, parsedItems) => {
  if (!rawItems) return { adult: [], child: [] };

  const adultItems = Array.isArray(rawItems.adult) ? rawItems.adult : [];
  const parsedAdultItems = parsedItems?.adult || [];

  const mapAdditional = (items, parsed, prefix) =>
    items.map((item, i) => {
      const parsedItem = parsed[i] || {};
      return {
        ...item,
        displayName: parsedItem.name || item.name || item.nama || item.displayName || `${prefix} ${i + 1}`,
        description: parsedItem.description || item.description || "",
      };
    });

  return {
    adult: mapAdditional(adultItems, parsedAdultItems,),
  };
};

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
      tours: enrichTourItems(
        rawDay.tours || rawDay.tour, 
        parsedDay.tours || parsedDay.tour
      ),
      transport_additionals_by_group: parseAdditionalByGroup(
        rawDay.transport_additionals_by_group,
        parsedDay.transport_additionals_by_group,
      ),
      akomodasi_additionals_by_group: parseAdditionalByGroup(
        rawDay.akomodasi_additionals_by_group,
        parsedDay.akomodasi_additionals_by_group,
      ),
    };
  });
  
  return merged;
}

export default parseAndMergeDays;
