// components/GoogleLoginButton.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = (codeResponse) => {
    const authorizationCode = codeResponse.code;
    fetch('http://127.0.0.1:8000/login-with-google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: authorizationCode,
      }),
    })
      .then((response) =>
        response.json().then((data) => {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('username', data.username);
          message.success('Login Success');
          navigate('/home'); // Use navigate instead of window.location.href
          // window.location.href = '/home';
        })
      )
      .catch((error) => {
        message.error('Login failed');
        console.error('Google login failed', error);
      });
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    flow: 'auth-code',
  });

  return (
    <GoogleButton onClick={login} label="Sign in with Google" />
  );
};

export default GoogleLoginButton;
