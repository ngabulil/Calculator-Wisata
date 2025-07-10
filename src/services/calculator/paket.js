import { apiGet } from "../api"

export const apiGetAllPaket = async () => {
    try {
        const response = await apiGet("/paket/full")
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}