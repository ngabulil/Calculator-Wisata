export default function buildPayloadPaket(data) {
  return {
    name: data.name,
    description: data.description,
    days: data.days.map((day) => ({
      name: day.name,
      description_day: day.description_day,
      data: day.data
        ? {
            akomodasi: {
              hotels:
                day.data?.akomodasi?.hotels?.map((hotel) => ({
                  id_hotel: hotel?.hotel?.value,
                  id_tipe_kamar: hotel?.roomType.value,
                  season: {
                    type: resolveSeason(hotel?.season),
                    id_musim: hotel?.idMusim,
                  },
                })) ?? [],

              villas:
                day.data?.akomodasi?.villas?.map((villa) => ({
                  id_villa: villa?.villa?.value,
                  id_tipe_kamar: villa?.roomType?.value,
                  season: {
                    type: resolveSeason(villa?.season),
                    id_musim: villa?.idMusim,
                  },
                })) ?? [],

              additional:
                day.data?.akomodasi?.additional?.map((item) => ({
                  id_additional: item?.selectedInfo?.value,
                })) ?? [],
            },

            tours:
              day.data?.tours?.map((tourItem) => {
                const base = {
                  no: tourItem.no,
                  type_wisata: day.data.type_wisata || "",
                };

                // Destination
                if (tourItem.selectedDest?.value || tourItem.id_destinasi) {
                  return {
                    ...base,
                    id_destinasi:
                      tourItem.selectedDest?.value || tourItem.id_destinasi,
                  };
                }

                // Activity
                if (tourItem.selectedActivity?.value || tourItem.id_activity) {
                  return {
                    ...base,
                    id_vendor:
                      tourItem.selectedVendor?.value || tourItem.id_vendor,
                    id_activity:
                      tourItem.selectedActivity?.value || tourItem.id_activity,
                  };
                }

                // Restaurant
                if (tourItem.selectedResto?.value || tourItem.id_resto) {
                  return {
                    ...base,
                    id_resto:
                      tourItem.selectedResto?.value || tourItem.id_resto,
                    id_menu:
                      tourItem.selectedPackage?.value || tourItem.id_menu,
                  };
                }

                // Default fallback (tidak dikenali)
                return base;
              }) ?? [],

            transport: {
              mobils:
                day.data?.transport?.mobils?.map((mobil) => ({
                  id_mobil: mobil?.mobil?.value,
                  keterangan: mobil?.kategori?.toLowerCase(),
                  id_area: mobil?.id_area,
                })) ?? [],

              additional:
                day.data?.transport?.additional?.map((item) => ({
                  id_additional: item?.selectedInfo?.value,
                })) ?? [],
            },
          }
        : "",
    })),
  };
}

function resolveSeason(season) {
  if (!season) return "normal";
  if (season.startsWith("normal")) return "normal";
  if (season.startsWith("high")) return "high";
  if (season.startsWith("honeymoon")) return "honeymoon";
  return "peak";
}
