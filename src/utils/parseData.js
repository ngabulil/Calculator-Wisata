import {
  // apiGetActivityVendorById,
  apiGetRestaurantById,
  apiGetDestinationById,
} from "../services/packageService";
import { apiGetHotel } from "../services/hotelService";
import { apiGetVilla } from "../services/villaService";
import { apiGetAdditionalAkomodasiById } from "../services/akomodasiService";
import { apiGetAdditionalMobilById } from "../services/transport";
import { apiGetActivityDetailsById } from "../services/activityService";

export const parseData = async (days) => {
  return await Promise.all(
    days.map(async (day) => {
      const parsedDay = { ...day };

      parsedDay.hotels = await Promise.all(
        (day.hotels || []).map(async (hotel) => {
          const data = await apiGetHotel(hotel.id_hotel);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.villas = await Promise.all(
        (day.villas || []).map(async (villa) => {
          const data = await apiGetVilla(villa.id_villa);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.akomodasi_additionals = await Promise.all(
        (day.akomodasi_additionals || []).map(async (item) => {
          const data = await apiGetAdditionalAkomodasiById(item.id_additional);
          return {
            ...(data.result || null),
          };
        })
      );

parsedDay.tour = await Promise.all(
  (day.tour || []).map(async (item) => {
    try {
      if (item.id_destinasi) {
        const res = await apiGetDestinationById(item.id_destinasi);
        return res.result || {};
      } else if (item.id_resto) {
        const res = await apiGetRestaurantById(item.id_resto);
        return res.result || {};
      } else if (item.id_activity) {
        const res = await apiGetActivityDetailsById(item.id_activity);
        return res.result || {};
      } else {
        return {};
      }
    } catch (err) {
      console.warn("Failed to fetch tour item", err);
      return {};
    }
  })
);

      parsedDay.transport_additionals = await Promise.all(
        (day.transport_additionals || []).map(async (item) => {
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
