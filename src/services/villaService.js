import { apiDelete, apiGet, apiPost, apiPut } from "./api";

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
  try {
    const response = await apiPost("/villas", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutVilla = async (id, data) => {
  try {
    const response = await apiPut(`/villas/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteVilla = async (id) => {
  try {
    const response = await apiDelete(`/villas/${id}`);
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
  try {
    const response = await apiPost("/villas/rooms", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutVillaRooms = async (id, data) => {
  try {
    const response = await apiPut(`/villas/rooms/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteVillaRooms = async (id, data) => {
  try {
    const response = await apiDelete(`/villas/rooms/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//  seasons

export const apiPostNormalSeasons = async (data) => {
  try {
    const response = await apiPost("/villas/normal-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutNormalSeasons = async (id, data) => {
  try {
    const response = await apiPut(`/villas/normal-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteNormalSeasons = async (id) => {
  try {
    const response = await apiDelete(`/villas/normal-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostHighSeasons = async (data) => {
  try {
    const response = await apiPost("/villas/high-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHighSeasons = async (id, data) => {
  try {
    const response = await apiPut(`/villas/high-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHighSeasons = async (id) => {
  try {
    const response = await apiDelete(`/villas/high-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostPeakSeasons = async (data) => {
  try {
    const response = await apiPost("/villas/peak-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutPeakSeasons = async (id, data) => {
  try {
    const response = await apiPut(`/villas/peak-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeletePeakSeasons = async (id) => {
  try {
    const response = await apiDelete(`/villas/peak-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostHoneySeasons = async (data) => {
  try {
    const response = await apiPost("/villas/honeymoon-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHoneySeasons = async (id, data) => {
  try {
    const response = await apiPut(`/villas/honeymoon-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHoneySeasons = async (id) => {
  try {
    const response = await apiDelete(`/villas/honeymoon-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
