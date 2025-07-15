import {
  apiGetActivityVendorById,
  apiGetRestaurantById,
  apiGetDestinationById,
  apiGetAllRestaurant,
} from "../services/packageService";
import { apiGetHotel, apiGetHotelRoomsById } from "../services/hotelService";
import { apiGetVilla, apiGetVillaRoomsById } from "../services/villaService";
import { apiGetMobilById, apiGetAllMobil } from "../services/transport";
import { apiGetAdditionalAkomodasiById } from "../services/akomodasiService";
import { apiGetAdditionalMobilById } from "../services/transport";
import { apiGetActivityDetailsById } from "../services/activityService";

export default async function parseDays(daysFromApi) {
  async function getLabel(fn, id, defaultLabel = "") {
    try {
      const data = await fn(id);
      return data?.result?.name || data.result.resto_name || defaultLabel;
    } catch {
      return defaultLabel;
    }
  }
  async function getLabelRestoMenu(fn, id_resto, id_menu, defaultLabel = "") {
    const data = await fn();

    const resto = data.result.find((item) => item.id === id_resto);

    if (resto) {
      const foundPackage = resto.packages.find(
        (pkg) => pkg.id_package === id_menu
      );

      if (foundPackage) {
        const packageName = foundPackage.package_name;
        return packageName;
      } else {
        return defaultLabel;
      }
    } else {
      return defaultLabel;
    }
  }

  async function getLabelMobil(fn, id_mobil, id_area, defaultLabel) {
    const data = await fn();

    const mobil = data.result.find((item) => item.id === id_mobil);

    if (mobil) {
      const foundKeteranganKey = Object.keys(mobil.keterangan).find((key) =>
        mobil.keterangan[key].some((item) => item.id_area === id_area)
      );

      if (foundKeteranganKey) {
        const matchedItem = mobil.keterangan[foundKeteranganKey].find(
          (item) => item.id_area === id_area
        );

        console.log(foundKeteranganKey);

        const packageName = matchedItem?.area ?? defaultLabel;

        return packageName;
      } else {
        return defaultLabel;
      }
    } else {
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

        const hotelRoomLabel = await getLabel(
          apiGetHotelRoomsById,
          hotel.id_tipe_kamar,
          `Room ${hotel.id_tipe_kamar}`
        );

        return {
          jumlahKamar: 1,
          jumlahExtrabed: 1,
          hargaPerKamar: 0,
          hargaExtrabed: 300000,
          hotel: { value: hotel.id_hotel, label: hotelLabel },
          roomType: {
            value: hotel.id_tipe_kamar,
            label: hotelRoomLabel,
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

        const villaRoomLabel = await getLabel(
          apiGetVillaRoomsById,
          villa.id_tipe_kamar,
          `Room ${villa.id_tipe_kamar}`
        );

        return {
          jumlahKamar: 1,
          jumlahExtrabed: 1,
          hargaPerKamar: 0,
          hargaExtrabed: 400000,
          villa: { value: villa.id_villa, label: villaLabel },
          roomType: {
            value: villa.id_tipe_kamar,
            label: villaRoomLabel,
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
            originalData: {},
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

        const labelAct = await getLabel(
          apiGetActivityDetailsById,
          act.id_activity,
          `Activity label`
        );

        return {
          selectedVendor: {
            value: act.id_vendor,
            label: label,
          },
          selectedTypeWisata: {
            value: act.type_wisata,
            label: capitalizeFirst(act.type_wisata),
          },
          selectedActivity: {
            value: act.id_activity,
            label: labelAct,
            fullData: {},
          },
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

        const labelMenu = await getLabelRestoMenu(
          apiGetAllRestaurant,
          resto.id_resto,
          resto.id_menu,
          `Menu nich`
        );

        return {
          selectedResto: {
            value: resto.id_resto,
            label: label,
          },
          selectedTypeWisata: {
            value: resto.type_wisata,
            label: capitalizeFirst(resto.type_wisata),
          },
          selectedPackage: {
            value: resto.id_menu,
            label: labelMenu,
            fullData: {},
          },
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

        const labelArea = await getLabelMobil(
          apiGetAllMobil,
          mobil.id_mobil,
          mobil.id_area,
          `Mobil Area`
        );

        return {
          mobil: { value: mobil.id_mobil, label },
          kategori:
            mobil.keterangan == "fullday"
              ? "fullDay"
              : mobil.keterangan == "halfday"
              ? "halfDay"
              : mobil.keterangan == "inout"
              ? "inOut"
              : "menginap",
          area: labelArea,

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


