import axios from "axios";
import Cookies from "js-cookie";
import { notification } from 'antd';
import { toast } from 'react-toastify';
import { PiAppWindow } from "react-icons/pi";
import Password from "antd/es/input/Password";

// Create axios instance with dynamic base URL
const apiClient = axios.create({
    // baseURL: baseURL,
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token'), // Replace with your actual token or use a dynamic approach
        'Authorization': 'Bearer ' + Cookies.get('token'),
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
        const response = await apiClient.post('/Auth/token/',{
            username,
            password,
        });
        openNotificationWithIcon('success', 'Login Successful', 'You have successfully logged in!');
        // console.log("success", response)
        // toast.success("Login Successful")
        return response.data;
    } catch (error){
        console.log("error", error)
        if (error.response.status === 401) {
            // Show specific error message if available
            openNotificationWithIcon('error', 'Login Failed', 'Invalid credentials');
        } else {
            // Network or unexpected error
            openNotificationWithIcon('error', 'Network Error', 'Please try again later.');
        }
    }
}

export const signup = async (username, password, first_name, setCurrentForm) => {
    try {
        const response = await apiClient.post('/User/signup/', {
            username,
            password,
            first_name
        });
        openNotificationWithIcon('success', 'Signup Successful', 'Your account has been created successfully!');
        setCurrentForm('signIn')
        return response.data
    } catch (error){
        console.log("error", error.response.data)
        if (error.response && error.response.data) {
            // Show specific error message if available
            openNotificationWithIcon('error', 'Signup Failed', error.response.data.detail || 'Unknown error');
            // return false
        } else {
            // Network or unexpected error
            openNotificationWithIcon('error', 'Network Error', 'Please try again later.');
        }
    }
}

export const forgetPassword = async (username) => {
    try {
        const response = await apiClient.put('/User/signup/', {
            username
        });
        openNotificationWithIcon('success', 'Reset mail sent', 'Reset mail sent successfully!');
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
            // Show specific error message if available
            openNotificationWithIcon('error', 'Mail sent Failed', error.response.data.detail || 'Unknown error');
            // return false
        } else {
            // Network or unexpected error
            openNotificationWithIcon('error', 'Error', 'Please try again later.');
        }
    }
}

export const resetPassword = async (token, password, confirm_password) => {
    try {
        const response = await apiClient.get('/User/signup/',{
            params: {
                token,
                password,
                confirm_password
            }
        });
        openNotificationWithIcon('success', 'Password update', 'Password updated successfully');
        return response
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
        }
    }

export const UserSidebarCreate = async (data) => {
    try{
        console.log("data", data)
        const response = await apiClient.post('/User/user/', data)
        console.log("response", response)
        openNotificationWithIcon('success', 'User', 'User Create successfully');
        return response
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const getUserId = async (id, username) => {
    try {
        // console.log("username", username)
        const response = await apiClient.get(`/User/user/?id=${id}`)
        console.log("response", response)
        return response
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const updateUser = async (data) => {
    try {
        // console.log("data", data)
        const response = await apiClient.put('User/user/', data)
        // console.log("response", response)
        openNotificationWithIcon('success', 'User', 'User Updated successfully')
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const deleteUser = async (id) => {
    try {
        console.log("id", id)
        const response = await apiClient.delete('User/user/', {
            id,
        })
        console.log('response', response)
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}
export const ClientInfo = async () => {
    const response = await apiClient.get('/Auth/site_management/')
    return response.data
}