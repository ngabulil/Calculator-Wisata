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

export const parsePaketDays = async (days) => {
  return await Promise.all(
    days.map(async (day) => {
      const parsedDay = { ...day };

      parsedDay.hotels = await Promise.all(
        (day.data.akomodasi.hotels || []).map(async (hotel) => {
          const data = await apiGetHotel(hotel.id_hotel);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.villas = await Promise.all(
        (day.data.akomodasi.villas || []).map(async (villa) => {
          const data = await apiGetVilla(villa.id_villa);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.akomodasi_additionals = await Promise.all(
        (day.data.akomodasi.additional || []).map(async (item) => {
          const data = await apiGetAdditionalAkomodasiById(item.id_additional);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.tours = await Promise.all(
        (day.data.tours || []).map(async (item) => {
          if (item.id_destinasi) {
            const data = await apiGetDestinationById(item.id_destinasi);
            return {
              type: "destination",
              no: item.no,
              ...(data.result || {}),
            };
          } else if (item.id_activity) {
            const data = await apiGetActivityVendorById(item.id_vendor);
            return {
              type: "activity",
              no: item.no,
              ...item,
              ...(data.result || {}),
            };
          } else if (item.id_resto) {
            const data = await apiGetRestaurantById(item.id_resto);
            return {
              type: "restaurant",
              no: item.no,
              ...(data.result || {}),
            };
          } else {
            return {
              type: "unknown",
              ...item,
            };
          }
        })
      );

      parsedDay.mobils = await Promise.all(
        (day.data.transport.mobils || []).map(async (mobil) => {
          const data = await apiGetMobilById(mobil.id_mobil);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.transport_additionals = await Promise.all(
        (day.data.transport.additional || []).map(async (item) => {
          const data = await apiGetAdditionalMobilById(item.id_additional);
          return {
            ...(data.result || null),
          };
        })
      );

      return parsedDay;
    })
  );
};
