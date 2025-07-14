import { apiDelete, apiGet, apiPost } from "./api";

import Cookies from "js-cookie";

const token = Cookies.get("token");

export const apiGetAllHotel = async () => {
  try {
    const response = await apiGet("/hotels/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetAllVilla = async () => {
  try {
    const response = await apiGet("/villas/full");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetAdditionalAkomodasiById = async (id) => {
  try {
    const response = await apiGet(`/akomodasi/additional/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetAdditionalAkomodasi = async () => {
  try {
    const response = await apiGet("/akomodasi/additional");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostAdditionalAkomodasi = async (data) => {
  try {
    const response = await apiPost("/akomodasi/additional", data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiDeleteAdditionalAkomodasi = async (id) => {
  try {
    const response = await apiDelete(`/akomodasi/additional/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
