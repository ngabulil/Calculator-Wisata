import { apiDelete, apiGet, apiPost } from "./api"

export const apiGetAllHotel = async () => {
    try {
        const response = await apiGet('/hotels/full')
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const apiGetAllVilla = async () => {
    try {
        const response = await apiGet('/villas/full')
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const apiGetAdditionalAkomodasi = async () => {
    try {
        const response = await apiGet('/akomodasi/additional')
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const apiPostAdditionalAkomodasi = async (data) => {
    try {
        const response = await apiPost('/akomodasi/additional', data)
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const apiDeleteAdditionalAkomodasi = async (id) => {
    try {
        const response = await apiDelete(`/akomodasi/additional/${id}`)
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}