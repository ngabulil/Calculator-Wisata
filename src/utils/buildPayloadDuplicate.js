export default function buildPayloadDuplicate(paket) {
  return {
    name: paket.name,
    description: paket.description,
    days: paket.days.map((day) => ({
      name: day.name,
      description_day: day.description_day,
      data: day.data
        ? {
            akomodasi: {
              hotels:
                day.data?.akomodasi?.hotels?.map((hotel) => ({
                  id_hotel: hotel.id_hotel,
                  id_tipe_kamar: hotel.id_tipe_kamar,
                  season: {
                    type: hotel.season_type || "normal",
                    id_musim: hotel.id_musim,
                  },
                })) ?? [],

              villas:
                day.data?.akomodasi?.villas?.map((villa) => ({
                  id_villa: villa.id_villa,
                  id_tipe_kamar: villa.id_tipe_kamar,
                  season: {
                    type: villa.season_type || "normal",
                    id_musim: villa.id_musim,
                  },
                })) ?? [],

              additional:
                day.data?.akomodasi?.additional?.map((item) => ({
                  id_additional: item.id_additional,
                })) ?? [],
            },

            tours:
              day.data?.tours?.map((tourItem) => {
                const base = {
                  no: tourItem.no,
                  type_wisata: tourItem.type_wisata || "",
                };

                if (tourItem.id_destinasi) {
                  return { ...base, id_destinasi: tourItem.id_destinasi };
                }

                if (tourItem.id_activity) {
                  return {
                    ...base,
                    id_vendor: tourItem.id_vendor,
                    id_activity: tourItem.id_activity,
                  };
                }

                if (tourItem.id_resto) {
                  return {
                    ...base,
                    id_resto: tourItem.id_resto,
                    id_menu: tourItem.id_menu,
                  };
                }

                return base;
              }) ?? [],

            transport: {
              mobils:
                day.data?.transport?.mobils?.map((mobil) => ({
                  id_mobil: mobil.id_mobil,
                  keterangan: mobil.keterangan?.toLowerCase() || "",
                  id_area: mobil.id_area,
                })) ?? [],

              additional:
                day.data?.transport?.additional?.map((item) => ({
                  id_additional: item.id_additional,
                })) ?? [],
            },
          }
        : "",
    })),
  };
}
