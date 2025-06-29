import axios from "axios"

// const BASE_URL = "http://localhost:3000/api"
const BASE_URL = "http://ec2-35-88-18-176.us-west-2.compute.amazonaws.com:3000/api"

const apiGet = async (url, params) => {
    try {
        const response = await axios.get(`${BASE_URL}${url}`, { params })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

const apiPost = async (url, data) => {
    try {
        const response = await axios.post(`${BASE_URL}${url}`, data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

const apiPut = async (url, data) => {
    try {
        const response = await axios.put(`${BASE_URL}${url}`, data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

const apiDelete = async (url) => {
    try {
        const response = await axios.delete(`${BASE_URL}${url}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export { apiGet, apiPost, apiPut, apiDelete }