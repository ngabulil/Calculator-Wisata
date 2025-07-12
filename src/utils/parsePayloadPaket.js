export default function parsePayloadPaket(input) {
  return {
    name: input.name,
    description: input.description,
    days: input.days.map((day) => {
      const akomodasi = day.data?.akomodasi || {};
      const tour = day.data?.tour || {};
      const transport = day.data?.transport || {};

      return {
        name: day.name,
        description_day: day.description_day,
        hotels:
          akomodasi.hotels?.map((h) => ({
            id_hotel: h.id_hotel,
            id_tipe_kamar: h.id_tipe_kamar,
            season: {
              season_type: h.season?.type,
              id_musim: h.season?.id_musim,
            },
          })) || [],
        villas:
          akomodasi.villas?.map((v) => ({
            id_villa: v.id_villa,
            id_tipe_kamar: v.id_tipe_kamar,
            season: {
              season_type: v.season?.type,
              id_musim: v.season?.id_musim,
            },
          })) || [],
        akomodasi_additionals: akomodasi.additional || [],
        destinations: tour.destinations || [],
        activities: tour.activities || [],
        restaurants: tour.restaurants || [],
        mobils: transport.mobils || [],
        transport_additionals: transport.additional || [],
      };
    }),
  };
}
