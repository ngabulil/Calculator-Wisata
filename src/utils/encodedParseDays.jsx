import {
  apiGetActivityVendorById,
  apiGetRestaurantById,
  apiGetDestinationById,
} from "../services/packageService";
import { apiGetHotel } from "../services/hotelService";
import { apiGetVilla } from "../services/villaService";
import { apiGetMobilById } from "../services/transport";
import { apiGetAdditionalAkomodasiById } from "../services/akomodasiService";
import { apiGetAdditionalMobilById } from "../services/transport";

export default async function parseDays(daysFromApi) {
  async function getLabel(fn, id, defaultLabel = "") {
    try {
      const data = await fn(id);
      return data?.result?.name || defaultLabel;
    } catch {
      return defaultLabel;
    }
  }

  const parseDay = async (day) => {
    const hotels = await Promise.all(
      (day.hotels || []).map(async (hotel) => {
        const hotelLabel = await getLabel(
          apiGetHotel,
          hotel.id_hotel,
          `Hotel ${hotel.id_hotel}`
        );
        return {
          jumlahKamar: 1,
          jumlahExtrabed: 1,
          hargaPerKamar: 0,
          hargaExtrabed: 300000,
          hotel: { value: hotel.id_hotel, label: hotelLabel },
          roomType: {
            value: hotel.id_tipe_kamar,
            label: `Room ${hotel.id_tipe_kamar}`,
          },
          season: `${hotel.season_type}-${0}`,
          seasonLabel: `${capitalizeFirst(
            hotel.season_type
          )} Season - ${capitalizeFirst(hotel.season_type)}`,
          idMusim: hotel.id_musim,
          useExtrabed: false,
        };
      })
    );

    const villas = await Promise.all(
      (day.villas || []).map(async (villa) => {
        const villaLabel = await getLabel(
          apiGetVilla,
          villa.id_villa,
          `Villa ${villa.id_villa}`
        );
        return {
          jumlahKamar: 1,
          jumlahExtrabed: 1,
          hargaPerKamar: 0,
          hargaExtrabed: 400000,
          villa: { value: villa.id_villa, label: villaLabel },
          roomType: {
            value: villa.id_tipe_kamar,
            label: `Room ${villa.id_tipe_kamar}`,
          },
          season: `${villa.season_type}-${0}`,
          seasonLabel: `${capitalizeFirst(
            villa.season_type
          )} Season - ${capitalizeFirst(villa.season_type)}`,
          idMusim: villa.id_musim,
          useExtrabed: false,
        };
      })
    );

    const akomodasiAdditionals = await Promise.all(
      (day.akomodasi_additionals || []).map(async (add) => {
        const label = await getLabel(
          apiGetAdditionalAkomodasiById,
          add.id_additional,
          `Additional ${add.id_additional}`
        );
        return {
          selectedInfo: { value: add.id_additional, label },
          nama: label,
          harga: 0,
          jumlah: 1,
        };
      })
    );

    const destinations = await Promise.all(
      (day.destinations || []).map(async (dest) => {
        const label = await getLabel(
          apiGetDestinationById,
          dest.id_destinasi,
          `Destinasi ${dest.id_destinasi}`
        );
        return {
          selectedDest: {
            value: dest.id_destinasi,
            label,
            originalData: {}, // bisa diisi nanti
          },
          selectedType: {
            value: dest.type_wisata,
            label: capitalizeFirst(dest.type_wisata),
          },
          id_destinasi: dest.id_destinasi,
          type_wisata: dest.type_wisata,
        };
      })
    );

    const activities = await Promise.all(
      (day.activities || []).map(async (act) => {
        const label = await getLabel(
          apiGetActivityVendorById,
          act.id_vendor,
          `Activity ${act.id_activity}`
        );
        return {
          selectedVendor: {
            value: act.id_vendor,
            label: `Vendor ${act.id_vendor}`,
          },
          selectedActivity: { value: act.id_activity, label, fullData: {} },
          id_vendor: act.id_vendor,
          id_activity: act.id_activity,
        };
      })
    );

    const restaurants = await Promise.all(
      (day.restaurants || []).map(async (resto) => {
        const label = await getLabel(
          apiGetRestaurantById,
          resto.id_resto,
          `Menu ${resto.id_menu}`
        );
        return {
          selectedResto: {
            value: resto.id_resto,
            label: `Resto ${resto.id_resto}`,
          },
          selectedPackage: { value: resto.id_menu, label, fullData: {} },
          id_resto: resto.id_resto,
          id_package: resto.id_menu,
        };
      })
    );

    const mobils = await Promise.all(
      (day.mobils || []).map(async (mobil) => {
        const label = await getLabel(
          apiGetMobilById,
          mobil.id_mobil,
          `Mobil ${mobil.id_mobil}`
        );
        return {
          mobil: { value: mobil.id_mobil, label },
          kategori: mobil.keterangan,
          area: `Area ${mobil.id_area}`,
          harga: 400000,
          jumlah: 1,
          id_area: mobil.id_area,
        };
      })
    );

    const transportAdditionals = await Promise.all(
      (day.transport_additionals || []).map(async (add) => {
        const label = await getLabel(
          apiGetAdditionalMobilById,
          add.id_additional,
          `Additional ${add.id_additional}`
        );
        return {
          selectedInfo: { value: add.id_additional, label },
          nama: label,
          harga: 0,
          jumlah: 1,
        };
      })
    );

    return {
      name: day.name,
      description_day: day.description_day,
      data: {
        akomodasi: {
          hotels,
          villas,
          additional: akomodasiAdditionals,
        },
        tour: {
          destinations,
          activities,
          restaurants,
        },
        transport: {
          mobils,
          additional: transportAdditionals,
        },
      },
    };
  };

  const parsed = await Promise.all(daysFromApi.map(parseDay));
  return parsed;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
