export default function buildPayloadPaket(data) {
  return {
    name: data.name,
    description: data.description,
    days: data.days.map((day) => ({
      name: day.name,
      description_day: day.description_day,
      data: {
        akomodasi: {
          hotels:
            day.data?.akomodasi?.hotels?.map((hotel) => ({
              id_hotel: hotel.hotel.value,
              id_tipe_kamar: hotel.roomType.value,
              season: {
                type: resolveSeason(data.season),
                id_musim: hotel.idMusim,
              },
            })) ?? [],

          villas:
            day.data?.akomodasi?.villas?.map((villa) => ({
              id_villa: villa.villa.value,
              id_tipe_kamar: villa.roomType.value,
              season: {
                type: resolveSeason(data.season),
                id_musim: villa.idMusim,
              },
            })) ?? [],

          additional:
            day.data?.akomodasi?.additional?.map((item) => ({
              id_additional: item.selectedInfo.value,
            })) ?? [],
        },

        tour: {
          destinations:
            day.data?.tour?.destinations?.map((dest) => ({
              id_destinasi: dest.selectedDest.value,
              type_wisata: dest.selectedType.value,
            })) ?? [],

          activities:
            day.data?.tour?.activities?.map((act) => ({
              id_vendor: act.selectedVendor.value,
              id_activity: act.selectedActivity.value,
              type_wisata: "domestik", // selalu "domestik"? ubah jika perlu
            })) ?? [],

          restaurants:
            day.data?.tour?.restaurants?.map((resto) => ({
              id_resto: resto.selectedResto.value,
              id_menu: resto.selectedPackage.value,
            })) ?? [],
        },

        transport: {
          mobils:
            day.data?.transport?.mobils?.map((mobil) => ({
              id_mobil: mobil.mobil.value,
              keterangan: mobil.kategori.toLowerCase(),
              id_area: mobil.id_area,
            })) ?? [],

          additional:
            day.data?.transport?.additional?.map((item) => ({
              id_additional: item.selectedInfo.value,
            })) ?? [],
        },
      },
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
