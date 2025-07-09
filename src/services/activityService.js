import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const apiGetAllActivityDetails = async () => {
  try {
    const response = await apiGet("/activity/details");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostActivityDetails = async (data) => {
  try {
    const response = await apiPost("/activity/details", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutActivityDetails = async (id) => {
  try {
    const response = await apiPut(`/activity/details/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteActivityDetails = async (id) => {
  try {
    const response = await apiDelete(`/activity/details/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiGetAllActivityVendors = async () => {
  try {
    const response = await apiGet("/activity/vendors");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostActivityVendors = async (data) => {
  try {
    const response = await apiPost("/activity/vendors", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutActivityVendors = async (id) => {
  try {
    const response = await apiPut(`/activity/vendors/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteActivityVendors = async (id) => {
  try {
    const response = await apiDelete(`/activity/vendors/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
