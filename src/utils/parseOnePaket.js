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

      parsedDay.destinations = await Promise.all(
        (day.destinations || []).map(async (dest) => {
          const data = await apiGetDestinationById(dest.id_destinasi);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.activities = await Promise.all(
        (day.activities || []).map(async (act) => {
          const data = await apiGetActivityVendorById(act.id_vendor);
          return {
            ...act,
            ...(data.result || null),
          };
        })
      );

      parsedDay.restaurants = await Promise.all(
        (day.restaurants || []).map(async (resto) => {
          const data = await apiGetRestaurantById(resto.id_resto);
          return {
            ...(data.result || null),
          };
        })
      );

      parsedDay.mobils = await Promise.all(
        (day.mobils || []).map(async (mobil) => {
          const data = await apiGetMobilById(mobil.id_mobil);
          return {
            ...(data.result || null),
          };
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
