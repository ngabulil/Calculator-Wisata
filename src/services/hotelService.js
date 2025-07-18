import { apiDelete, apiGet, apiPost, apiPut } from "./api";

import Cookies from "js-cookie";



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
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/hotels", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHotel = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/hotels/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiDeleteHotel = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/hotels/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//  rooms

export const apiGetHotelRoomsById = async (id) => {
  try {
    const response = await apiGet(`/hotels/rooms/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
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
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/hotels/rooms", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutHotelRooms = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/hotels/rooms/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHotelRooms = async (id, data) => {
  try {
    const response = await apiDelete(`/hotels/rooms/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// seasons

export const apiGetNormalSeasonsById = async (id) => {
  try {
    const response = await apiGet(`/hotels/normal-seasons/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostNormalSeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/hotels/normal-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutNormalSeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/hotels/normal-seasons/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteNormalSeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/hotels/normal-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiGetHighSeasonsById = async (id) => {
  try {
    const response = await apiGet(`/hotels/high-seasons/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostHighSeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/hotels/high-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHighSeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/hotels/high-seasons/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHighSeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/hotels/high-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiGetPeakSeasonsById = async (id) => {
  try {
    const response = await apiGet(`/hotels/peak-seasons/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostPeakSeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/hotels/peak-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutPeakSeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/hotels/peak-seasons/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeletePeakSeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/hotels/peak-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
