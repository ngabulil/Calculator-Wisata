import { apiDelete, apiGet, apiPost, apiPut } from "./api";

import Cookies from "js-cookie";

const token = Cookies.get("token");

export const apiLoginAdmin = async (data) => {
  try {
    const response = await apiPost(`/admin/login`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiGetAllAdmin = async () => {
  try {
    const response = await apiGet("/admin", "", token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiGetUser = async (tokenData) => {
  try {
    const response = await apiGet("/admin/me", "", tokenData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiGetAdmin = async (id) => {
  try {
    const response = await apiGet(`/admin/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostAdmin = async (data) => {
  try {
    const response = await apiPost(`/admin`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutAdmin = async (id, data) => {
  try {
    const response = await apiPut(`/admin/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteAdmin = async (id) => {
  try {
    const response = await apiDelete(`/admin/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
