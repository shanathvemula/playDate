import axios from "axios";
import { notification } from 'antd';

// Create axios instance with dynamic base URL
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api/',
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest.url === 'Auth/token/refresh_token/') {
            window.location.href = '/'; // Redirect to login if refresh fails
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                return apiClient
                    .post('Auth/token/refresh_token/', { refresh: refreshToken })
                    .then((response) => {
                        localStorage.setItem('token', response.data.access);
                        apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        console.log('Refresh token failed:', err);
                        window.location.href = '';
                        return Promise.reject(err);
                    });
            } else {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

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
        const response = await apiClient.post('/Auth/token/', {
            username,
            password,
        });
        openNotificationWithIcon('success', 'Login Successful', 'You have successfully logged in!');
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        return response.data;
    } catch (error) {
        console.log("error", error);
        if (error.response.status === 401) {
            openNotificationWithIcon('error', 'Login Failed', 'Invalid credentials');
        } else {
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
        setCurrentForm('signIn');
        return response.data;
    } catch (error) {
        console.log("error", error.response.data);
        if (error.response && error.response.data) {
            openNotificationWithIcon('error', 'Signup Failed', error.response.data.detail || 'Unknown error');
        } else {
            openNotificationWithIcon('error', 'Network Error', 'Please try again later.');
        }
    }
}

export const forgetPassword = async (username) => {
    try {
        const response = await apiClient.put('/User/signup/', { username });
        openNotificationWithIcon('success', 'Reset mail sent', 'Reset mail sent successfully!');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            openNotificationWithIcon('error', 'Mail sent Failed', error.response.data.detail || 'Unknown error');
        } else {
            openNotificationWithIcon('error', 'Error', 'Please try again later.');
        }
    }
}

export const resetPassword = async (token, password, confirm_password) => {
    try {
        const response = await apiClient.patch('/User/signup/', {
            token,
            password,
            confirm_password
        });
        openNotificationWithIcon('success', 'Password update', 'Password updated successfully');
        return response;
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const UserSidebarCreate = async (data) => {
    try {
        const response = await apiClient.post('/User/user/', data);
        openNotificationWithIcon('success', 'User', 'User Create successfully');
        return response;
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const getUserId = async (id, username) => {
    try {
        let response = '';
        if (id !== '') {
            response = await apiClient.get(`/User/user/?id=${id}`);
        } else {
            response = await apiClient.get(`/User/user/?username=${username}`);
        }
        return response;
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const updateUser = async (data) => {
    try {
        const response = await apiClient.put('User/user/', data);
        openNotificationWithIcon('success', 'User', 'User Updated successfully');
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await apiClient.delete(`/User/user/?id=${id}`);
        openNotificationWithIcon('success', 'User', 'User Deleted successfully');
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const getUserToken = async () => {
    try {
        const response = await apiClient.get("/User/signup/");
        return response.data;
    } catch (error) {
        console.log('Error fetching data:', error.response.data.Error);
    }
}

export const GroundSidebarCreate = async (data) => {
    try {
        const response = await apiClient.post('/Grounds/ground/', data);
        openNotificationWithIcon('success', 'Ground', 'Ground Create successfully');
        return response;
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const GroundSidebarUpdate = async (data) => {
    try {
        const response = await apiClient.put('/Grounds/ground/', data);
        openNotificationWithIcon('success', 'Ground', 'Ground Updated successfully');
        return response;
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const GroundDelete = async (id) => {
    try {
        const response = await apiClient.delete(`/Grounds/ground/?id=${id}`);
        openNotificationWithIcon('success', 'Ground', 'Ground Deleted successfully');
    } catch (error) {
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const ClientInfo = async () => {
    const response = await apiClient.get('/User/SiteManagement/');
    return response.data;
}

export const ClientInfoPost = async (formData) => {
    try {
        const response = await apiClient.post('/User/SiteManagement/', formData);
        return { open: true, message: 'Form submitted successfully!', severity: 'success' };
    } catch (error) {
        return { open: true, message: 'Failed to submit the form.', severity: 'error' };
    }
};
