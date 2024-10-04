import axios from "axios";
import Cookies from "js-cookie";

let baseURL = 'http://localhost:8010';

// Create axios instance with dynamic base URL
const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Authentication function
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/Auth/token/',{
            username,
            password,
        });
        console.log("data", response.data)
        return response.data;
    } catch (error){
        console.log("error", error)
        // throw error.response ? error.response.data : new Error('Network Error');
    }
}