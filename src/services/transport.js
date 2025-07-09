import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const apiGetAllMobil = async () => {
  try {
    const response = await apiGet("/mobil/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutMobilFull = async (id, data) => {
  try {
    const response = await apiPut(`/mobil/full/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostMobilFull = async (data) => {
  try {
    const response = await apiPost("/mobil/full", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteMobilFull = async (id) => {
  try {
    const response = await apiDelete(`/mobil/full/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetMobilById = async (id) => {
  try {
    const response = await apiGet(`/mobil/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetAllAdditionalMobil = async () => {
  try {
    const response = await apiGet("/transport/additional");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiGetAdditionalMobilById = async (id) => {
  try {
    const response = await apiGet(`/transport/additional/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostAdditionalMobil = async (data) => {
  try {
    const response = await apiPost("/transport/additional", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiDeleteAdditionalMobil = async (id) => {
  try {
    const response = await apiDelete(`/transport/additional/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
