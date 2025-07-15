import { apiDelete, apiGet, apiPost, apiPut } from "./api";

import Cookies from "js-cookie";



export const apiGetAllRestaurant = async () => {
  try {
    const response = await apiGet("/restaurant/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetRestaurant = async (id) => {
  try {
    const response = await apiGet(`/restaurant/full/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPostRestaurant = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost("/restaurant/full", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutRestaurant = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/restaurant/full/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteRestaurant = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/restaurant/full/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
