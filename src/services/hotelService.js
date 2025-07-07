import { apiDelete, apiGet, apiPost } from "./api";

export const apiGetAllHotel = async () => {
  try {
    const response = await apiGet("/hotels/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetHotel = async (id) => {
  try {
    const response = await apiGet(`/hotels/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostHotel = async (data) => {
  try {
    const response = await apiPost("/hotels", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHotel = async (id, data) => {
  try {
    const response = await apiPost(`/hotels/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiDeleteHotel = async (id) => {
  try {
    const response = await apiDelete(`/hotels/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//  rooms

export const apiGetAllHotelRooms = async () => {
  try {
    const response = await apiGet("/hotels/rooms");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostHotelRooms = async (data) => {
  try {
    const response = await apiPost("/hotels/rooms", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// seasons

export const apiPostNormalSeasons = async (data) => {
  try {
    const response = await apiPost("/hotels/normal-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostHighSeasons = async (data) => {
  try {
    const response = await apiPost("/hotels/high-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostPeakSeasons = async (data) => {
  try {
    const response = await apiPost("/hotels/peak-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
