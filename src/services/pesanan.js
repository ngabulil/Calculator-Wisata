import { apiPost } from "./api";

export const apiPostPesanan = async (formData) => {
    try {
        const response = await apiPost('/pesanan', formData);
        return response;
    } catch (error) {
        console.error("Error creating pesanan:", error);
        throw error;
    }
};