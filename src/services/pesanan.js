import { apiGet, apiPost } from "./api";
import Cookies from 'js-cookie';


export const apiPostPesanan = async (formData) => {
    const token = Cookies.get('token');
    try {
        const response = await apiPost('/pesanan', formData, token);
        return response;
    } catch (error) {
        console.error("Error creating pesanan:", error);
        throw error;
    }
};

export const apiGetPesanan = async () => {
    try {
        const token = Cookies.get('token');
        const response = await apiGet('/pesanan', "", token);
        return response;
    } catch (error) {
        console.error("Error fetching pesanan:", error);
        throw error;
    }
}