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
      (day.data.akomodasi.hotels || []).map(async (hotel) => {
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
          hargaExtrabed: 0,
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
      (day.data.akomodasi.villas || []).map(async (villa) => {
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
          hargaExtrabed: 0,
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
      (day.data.akomodasi.additional || []).map(async (add) => {
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

    const rawTours = await Promise.all(
      (day.data.tours || []).map(async (item) => {
        const type = item.id_destinasi
          ? "destination"
          : item.id_activity
          ? "activity"
          : item.id_resto
          ? "restaurant"
          : "unknown";

        const baseType = item.type_wisata || "";

        if (type === "destination") {
          const label = await getLabel(
            apiGetDestinationById,
            item.id_destinasi,
            `Destinasi ${item.id_destinasi}`
          );

          return {
            no: item.no,
            selectedDest: {
              value: item.id_destinasi,
              label,
              originalData: {},
            },
            selectedType: {
              value: baseType,
              label: capitalizeFirst(baseType),
            },
            id_destinasi: item.id_destinasi,
            type_wisata: baseType,
            description: item.description || "",
          };
        }

        if (type === "activity") {
          const labelVendor = await getLabel(
            apiGetActivityVendorById,
            item.id_vendor,
            `Vendor ${item.id_vendor}`
          );

          const labelActivity = await getLabel(
            apiGetActivityDetailsById,
            item.id_activity,
            `Activity ${item.id_activity}`
          );

          return {
            no: item.no,
            selectedVendor: {
              value: item.id_vendor,
              label: labelVendor,
            },
            selectedActivity: {
              value: item.id_activity,
              label: labelActivity,
              fullData: {},
            },
            selectedTypeWisata: {
              value: baseType,
              label: capitalizeFirst(baseType),
            },
            id_vendor: item.id_vendor,
            id_activity: item.id_activity,
            type_wisata: baseType,
            description: item.description || "",
          };
        }

        if (type === "restaurant") {
          const labelResto = await getLabel(
            apiGetRestaurantById,
            item.id_resto,
            `Restoran ${item.id_resto}`
          );

          const labelMenu = await getLabelRestoMenu(
            apiGetAllRestaurant,
            item.id_resto,
            item.id_menu,
            `Menu ${item.id_menu}`
          );

          return {
            no: item.no,
            selectedResto: {
              value: item.id_resto,
              label: labelResto,
            },
            selectedPackage: {
              value: item.id_menu,
              label: labelMenu,
              fullData: {},
            },
            selectedTypeWisata: {
              value: baseType,
              label: capitalizeFirst(baseType),
            },
            id_resto: item.id_resto,
            id_package: item.id_menu,
            type_wisata: baseType,
          };
        }

        return item;
      })
    );

    const tours = rawTours.sort((a, b) => a.no - b.no);

    const mobils = await Promise.all(
      (day.data.transport.mobils || []).map(async (mobil) => {
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
      (day.data.transport.additional || []).map(async (add) => {
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

    const tourTypeWisata =
      tours.find((t) => t.type_wisata && t.type_wisata !== "")?.type_wisata ||
      "";

    return {
      name: day.name,
      description_day: day.description_day,
      data: {
        akomodasi: {
          hotels,
          villas,
          additional: akomodasiAdditionals,
        },
        tours: tours,
        type_wisata: tourTypeWisata,
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
