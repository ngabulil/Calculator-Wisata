import { apiDelete, apiGet, apiPost, apiPut } from "./api";

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
    const response = await apiPut(`/hotels/${id}`, data);
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
export const apiPutHotelRooms = async (id, data) => {
  try {
    const response = await apiPut(`/hotels/rooms/${id}`, data);
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

export const apiPostNormalSeasons = async (data) => {
  try {
    const response = await apiPost("/hotels/normal-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutNormalSeasons = async (id, data) => {
  try {
    const response = await apiPut(`/hotels/normal-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteNormalSeasons = async (id) => {
  try {
    const response = await apiDelete(`/hotels/normal-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostHighSeasons = async (data) => {
  try {
    const response = await apiPost("/hotels/high-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutHighSeasons = async (id, data) => {
  try {
    const response = await apiPut(`/hotels/high-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteHighSeasons = async (id) => {
  try {
    const response = await apiDelete(`/hotels/high-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//

export const apiPostPeakSeasons = async (data) => {
  try {
    const response = await apiPost("/hotels/peak-seasons", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPutPeakSeasons = async (id, data) => {
  try {
    const response = await apiPut(`/hotels/peak-seasons/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeletePeakSeasons = async (id) => {
  try {
    const response = await apiDelete(`/hotels/peak-seasons/${id} `);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
