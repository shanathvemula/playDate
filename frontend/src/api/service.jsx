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
        // 'Authorization': 'Bearer ' + Cookies.get('token'),
    }
})

// Add request interceptor
apiClient.interceptors.request.use(
    async (config) => {
    //   const accessToken = Cookies.get('token');
    const accessToken = localStorage.getItem('token')
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
        // const refreshToken = Cookies.get('refresh');
        const refreshToken = localStorage.getItem('refresh')
  
        if (refreshToken) {
          return apiClient
            .post('Auth/token/refresh_token/', { refresh: refreshToken })
            .then((response) => {
            //   Cookies.set('token',response.data.access, {expires:1/1440, sameSite:'strict'})
              localStorage.setItem('token',response.data.access)
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

// const multipartAPIClient = axios.create({
//     // For Multimedia Files
//     baseURL: '/api/',
//     headers: {
//         'Content-Type': 'multipart/form-data',
//         // 'Authorization': 'Bearer ' + localStorage.getItem('token'), // Replace with your actual token or use a dynamic approach
//         // 'Authorization': 'Bearer ' + Cookies.get('token'),
//     }
// })

// // Add request interceptor
// multipartAPIClient.interceptors.request.use(
//     async (config) => {
//       const accessToken = Cookies.get('token');
//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

// // Add response interceptor
// multipartAPIClient.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
  
//       if (error.response.status === 401 && originalRequest.url === 'Auth/token/refresh_token/') {
//         window.location.href = '/'; // Redirect to login if refresh fails
//         return Promise.reject(error);
//       }
  
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         const refreshToken = Cookies.get('refresh');
  
//         if (refreshToken) {
//           return apiClient
//             .post('Auth/token/refresh_token/', { refresh: refreshToken })
//             .then((response) => {
//               Cookies.set('token',response.data.access, {expires:1/1440, sameSite:'strict'})
//               apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
//               originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
//               return apiClient(originalRequest);
//             })
//             .catch((err) => {
//               console.log('Refresh token failed:', err);
//               window.location.href = '';
//               return Promise.reject(err);
//             });
//         } else {
//           window.location.href = '/';
//         }
//       }
  
//       return Promise.reject(error);
//     }
//   );


  
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
        // console.log("success", response)
        // toast.success("Login Successful")
        openNotificationWithIcon('success', 'Login Successful', 'You have successfully logged in!');
        // Cookies.set("token", response.data.access, {expires: 1/24, secure: true})
        // Cookies.set("refresh", response.data.refresh, {expires: 7, secure: true})
        localStorage.setItem("token", response.data.access)
        localStorage.setItem("refresh", response.data.refresh)
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
        const response = await apiClient.patch('/User/signup/',{
                token,
                password,
                confirm_password
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
        let response=''
        if (id!=='') {
            response = await apiClient.get(`/User/user/?id=${id}`)
        }
        else {
            response = await apiClient.get(`/User/user/?username=${username}`)
        }
        // console.log("response", response)
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
        // console.log("id", id)
        const response = await apiClient.delete(`/User/user/?id=${id}`)
        // console.log('response', response)
        openNotificationWithIcon('success', 'User', 'User Deleted successfully')
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const getUserToken = async () => {
    try {
        // console.log("id", id)
        const response = await apiClient.get("/User/signup/")
        // console.log('response', response)
        // openNotificationWithIcon('success', 'User', 'User Deleted successfully')
        return response.data
    } catch (error) {
        console.log('Error fetching data:', error.response.data.Error);
        // openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const GroundSidebarCreate = async (data) => {
    try {
        const response = await apiClient.post('/Grounds/ground/', data)
        openNotificationWithIcon('success', 'Ground', 'Ground Create successfully');
        return response
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const GroundSidebarUpdate = async (data) => {
    try {
        const response = await apiClient.put('/Grounds/ground/', data)
        openNotificationWithIcon('success', 'Ground', 'Ground Updated successfully');
        return response
    } catch (error) {
        // console.log('Error fetching data:', error.response.data.Error);
        openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }
}

export const GroundDelete = async (id) =>{
    try{
        const response = await apiClient.delete(`/Grounds/ground/?id=${id}`)
        // console.log('response', response)
        openNotificationWithIcon('success', 'Ground', 'Ground Deleted successfully')
    } catch (error){
         // console.log('Error fetching data:', error.response.data.Error);
         openNotificationWithIcon('error', 'Error', error.response.data.Error);
    }

}

export const ClientInfo = async () => {
    const response = await apiClient.get('/User/SiteManagement/')
    return response.data
}

export const ClientInfoPost = async (formData) => {
    try {
      const response = await apiClient.post('/User/SiteManagement/', formData);
      console.log(response.data);
      return { open: true, message: 'Form submitted successfully!', severity: 'success' };
    } catch (error) {
      console.error(error);
      return { open: true, message: 'Failed to submit the form.', severity: 'error' };
    }
  };