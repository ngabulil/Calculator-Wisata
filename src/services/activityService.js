import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import Cookies from "js-cookie";

export const apiGetAllActivityDetails = async () => {
  try {
    const response = await apiGet("/activity/details");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiGetActivityDetailsById = async (id) => {
  try {
    const response = await apiGet(`/activity/details/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostActivityDetails = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/activity/details", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutActivityDetails = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/activity/details/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteActivityDetails = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/activity/details/${id}`, token);
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
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/activity/vendors", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutActivityVendors = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/activity/vendors/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteActivityVendors = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/activity/vendors/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
