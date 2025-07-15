import { apiDelete, apiGet, apiPost, apiPut } from "./api";

import Cookies from "js-cookie";

export const apiGetAllDestination = async () => {
  try {
    const response = await apiGet("/tiket-masuk/");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostDestination = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/tiket-masuk/", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutDestination = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/tiket-masuk/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteDestination = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/tiket-masuk/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
