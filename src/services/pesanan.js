import { apiGet, apiPost } from "./api";

export const apiPostPesanan = async (formData) => {
    try {
        const response = await apiPost('/pesanan', formData);
        return response;
    } catch (error) {
        console.error("Error creating pesanan:", error);
        throw error;
    }
};

export const apiGetPesanan = async() =>{
    try {
        const response = await apiGet('/pesanan');
        return response;
    } catch (error) {
        console.error("Error fetching pesanan:", error);
        throw error;
    }
}