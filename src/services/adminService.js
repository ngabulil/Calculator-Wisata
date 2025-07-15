import { apiDelete, apiGet, apiPost, apiPut } from "./api";

import Cookies from "js-cookie";

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
  const token = Cookies.get("token");
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
  const token = Cookies.get("token");
  try {
    const response = await apiGet(`/admin/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const apiPostAdmin = async (data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPost(`/admin`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutAdmin = async (id, data) => {
  const token = Cookies.get("token");
  try {
    const response = await apiPut(`/admin/${id}`, data, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteAdmin = async (id) => {
  const token = Cookies.get("token");
  try {
    const response = await apiDelete(`/admin/${id}`, token);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
