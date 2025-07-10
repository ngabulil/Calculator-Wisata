import { apiGet } from "../api"

export const apiGetAllActivity = async () => {
    try {
        const response = await apiGet("/activity/vendors/full")
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const apiGetAllRestaurant = async () => {
    try {
        const response = await apiGet("/restaurant/full")
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const apiGetAllTiketMasuk = async () => {
    try {
        const response = await apiGet("/tiket-masuk")
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}