import axios from "axios";
import Cookies from "js-cookie";
import { notification } from 'antd';


let baseURL = 'http://69.197.176.103:8000';

// Create axios instance with dynamic base URL
const apiClient = axios.create({
    // baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Notification utility function
const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
        placement: 'topRight',
    });
}

// Authentication function
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/api/Auth/token/',{
            username,
            password,
        });
        openNotificationWithIcon('success', 'Login Successful', 'You have successfully logged in!');
        return response.data;
    } catch (error){
        // console.log("error", error.response.data.detail )
        if (error.response.status === 404) {
            // Show specific error message if available
            openNotificationWithIcon('error', 'Login Failed', 'Invalid credentials');
        } else {
            // Network or unexpected error
            openNotificationWithIcon('error', 'Network Error', 'Please try again later.');
        }
    }
}

export const signup = async (username, password, first_name) => {
    try {
        const response = await apiClient.post('/api/User/signup/', {
            username,
            password,
            first_name
        });
        openNotificationWithIcon('success', 'Signup Successful', 'Your account has been created successfully!');
        return response.data
    } catch (error){
        console.log("error", error.response)
        if (error.response && error.response.data) {
            // Show specific error message if available
            openNotificationWithIcon('error', 'Signup Failed', error.response.data.detail || 'Unknown error');
        } else {
            // Network or unexpected error
            openNotificationWithIcon('error', 'Network Error', 'Please try again later.');
        }
    }
}
