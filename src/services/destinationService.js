import { apiDelete, apiGet, apiPost, apiPut } from "./api";

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
  try {
    const response = await apiPost("/tiket-masuk/", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiPutDestination = async (id, data) => {
  try {
    const response = await apiPut(`/tiket-masuk/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const apiDeleteDestination = async (id) => {
  try {
    const response = await apiDelete(`/tiket-masuk/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
