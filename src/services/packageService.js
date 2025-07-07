import { apiDelete, apiGet, apiPost } from "./api";

export const apiGetAllActivityVendor = async () => {
  try {
    const response = await apiGet("/activity/vendors/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetAllRestaurant = async () => {
  try {
    const response = await apiGet("/restaurant/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

