import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import Cookies from "js-cookie";

export const apiGetAllVilla = async () => {
  try {
    const response = await apiGet("/villas/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetVilla = async (id) => {
  try {
    const response = await apiGet(`/villas/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostVilla = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/villas", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutVilla = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/villas/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteVilla = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/villas/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//  rooms

export const apiGetAllVillaRooms = async () => {
  try {
    const response = await apiGet("/villas/rooms");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiGetVillaRoomsById = async (id) => {
  try {
    const response = await apiGet(`/villas/rooms/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostVillaRooms = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/villas/rooms", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutVillaRooms = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/villas/rooms/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteVillaRooms = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/villas/rooms/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//  seasons

export const apiPostNormalSeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/villas/normal-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutNormalSeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/villas/normal-seasons/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteNormalSeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/villas/normal-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostHighSeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/villas/high-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHighSeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/villas/high-seasons/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHighSeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/villas/high-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostPeakSeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/villas/peak-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutPeakSeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/villas/peak-seasons/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeletePeakSeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/villas/peak-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostHoneySeasons = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/villas/honeymoon-seasons", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHoneySeasons = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(
      `/villas/honeymoon-seasons/${id}`,
      data,
      token
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHoneySeasons = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/villas/honeymoon-seasons/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
