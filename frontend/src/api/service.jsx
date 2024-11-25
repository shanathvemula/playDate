import axios from "axios";
import Cookies from "js-cookie";
import { notification } from 'antd';
import { toast } from 'react-toastify';
import { PiAppWindow } from "react-icons/pi";
import Password from "antd/es/input/Password";

// Define base URL
const baseURL = 'http://localhost:8000';  //157.173.195.249
// const baseURL = '/api'

// Create axios instance
const apiClient = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
});

// Centralized error handler
const handleError = (error, defaultMsg) => {
    const message = error.response?.data?.Error || defaultMsg;
    console.log("message", message)
    notification.error({ message: 'Error', description: message, placement: 'topRight' });
    return Promise.reject(error);
};

// Notification utility function
const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
        placement: 'topRight',
    });
};

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest.url === 'Auth/token/refresh_token/') {
            window.location.href = '/';
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');
            if (refreshToken) {
                try {
                    const { data } = await apiClient.post('Auth/token/refresh_token/', { refresh: refreshToken });
                    localStorage.setItem('token', data.access);
                    apiClient.defaults.headers['Authorization'] = `Bearer ${data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.log('Refresh token failed:', err);
                    window.location.href = '/';
                    return Promise.reject(err);
                }
            } else {
                window.location.href = '/';
            }
        }

        return handleError(error, 'An unexpected error occurred');
    }
);

// Authentication functions
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/Auth/token/', { username, password });
        openNotificationWithIcon('success', 'Login Successful', 'You have successfully logged in!');
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        return response.data;
    } catch (error) {
        return handleError(error, 'Login Failed. Please try again.');
    }
};

export const signup = async (username, password, first_name, setCurrentForm) => {
    try {
        const response = await apiClient.post('/User/signup/', { username, password, first_name });
        openNotificationWithIcon('success', 'Signup Successful', 'Your account has been created successfully!');
        setCurrentForm('signIn');
        return response.data;
    } catch (error) {
        return handleError(error, 'Signup Failed. Please try again.');
    }
};

export const forgetPassword = async (username) => {
    try {
        const response = await apiClient.put('/User/signup/', { username });
        openNotificationWithIcon('success', 'Reset mail sent', 'Reset mail sent successfully!');
        return response.data;
    } catch (error) {
        return handleError(error, 'Failed to send reset mail');
    }
};

export const resetPassword = async (token, password, confirm_password) => {
    try {
        const response = await apiClient.patch('/User/signup/', { token, password, confirm_password });
        openNotificationWithIcon('success', 'Password updated', 'Password updated successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to update password');
    }
};

// User management functions
export const UserSidebarCreate = async (data) => {
    try {
        const response = await apiClient.post('/User/user/', data);
        openNotificationWithIcon('success', 'User Created', 'User created successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to create user');
    }
};

export const getUserId = async (id, username) => {
    try {
        const endpoint = id ? `/User/user/?id=${id}` : `/User/user/?username=${username}`;
        const response = await apiClient.get(endpoint);
        return response;
    } catch (error) {
        return handleError(error, 'Failed to fetch user');
    }
};

export const updateUser = async (data) => {
    try {
        const response = await apiClient.put('/User/user/', data);
        openNotificationWithIcon('success', 'User Updated', 'User updated successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to update user');
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await apiClient.delete(`/User/user/?id=${id}`);
        openNotificationWithIcon('success', 'User Deleted', 'User deleted successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to delete user');
    }
};

export const getUserToken = async () => {
    try {
        const response = await apiClient.get(baseURL+"/User/signup/");
        // console.log("response", response.data)
        return response.data;
    } catch (error) {
        // console.log("error", error)
        return handleError(error, 'Failed to fetch user token');
    }
};

// Ground management functions
export const GroundSidebarCreate = async (data) => {
    try {
        const response = await apiClient.post('/Grounds/ground/', data);
        openNotificationWithIcon('success', 'Ground Created', 'Ground created successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to create ground');
    }
};

export const GroundSidebarUpdate = async (data) => {
    try {
        const response = await apiClient.put('/Grounds/ground/', data);
        openNotificationWithIcon('success', 'Ground Updated', 'Ground updated successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to update ground');
    }
};

export const GroundDelete = async (id) => {
    try {
        const response = await apiClient.delete(`/Grounds/ground/?id=${id}`);
        openNotificationWithIcon('success', 'Ground Deleted', 'Ground deleted successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to delete ground');
    }
};

// Client management functions
export const ClientInfo = async () => {
    try {
        const response = await apiClient.get('/User/SiteManagement/');
        return response.data;
    } catch (error) {
        return handleError(error, 'Failed to fetch client info');
    }
};

export const ClientInfoPost = async (formData) => {
    try {
        const response = await apiClient.post('/User/SiteManagement/', formData);
        openNotificationWithIcon('success', 'Form Submitted', 'Form submitted successfully!');
        return { open: true, message: 'Form submitted successfully!', severity: 'success' };
    } catch (error) {
        console.error(error);
        return { open: true, message: 'Failed to submit the form.', severity: 'error' };
    }
};

export const GroundNewGET = async () => {
    try {
        const response = await apiClient.get('/Grounds/ground_new/');
        return response.data;
    } catch (error) {
        console.error("Error fetching ground data:", error);
        return []; // Or return an empty array `[]` if your UI expects an array
    }
}

export const GroundNewPOST = async (formData) =>{
    try {
        const response = await apiClient.post('/Grounds/ground_new/', formData);
        openNotificationWithIcon('success', 'Ground Created', 'Ground created successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to create ground');
    }
}

export const GroundNewUpdate = async (data) => {
    try {
        const response = await apiClient.put('/Grounds/ground_new/', data);
        openNotificationWithIcon('success', 'Ground Updated', 'Ground updated successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to update ground');
    }
};


export const GroundNewDelete = async (id) => {
    try {
        const response = await apiClient.delete(`/Grounds/ground_new/?id=${id}`);
        openNotificationWithIcon('success', 'Ground Deleted', 'Ground deleted successfully');
        return response;
    } catch (error) {
        return handleError(error, 'Failed to delete ground');
    }
};

// Optional multipart API setup for multimedia files
const multipartAPIClient = axios.create({
    baseURL: '/api/',
    headers: { 'Content-Type': 'multipart/form-data' },
});

// Add request interceptor for multipart API
multipartAPIClient.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for multipart API
multipartAPIClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get('refresh');
            if (refreshToken) {
                try {
                    const { data } = await apiClient.post('Auth/token/refresh_token/', { refresh: refreshToken });
                    Cookies.set('token', data.access, { expires: 1 / 1440, sameSite: 'strict' });
                    originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.log('Refresh token failed:', err);
                    window.location.href = '/';
                    return Promise.reject(err);
                }
            } else {
                window.location.href = '/';
            }
        }

        return handleError(error, 'An unexpected error occurred');
    }
);
