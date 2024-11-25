import React, { useState, useEffect } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ForgetPassword from "./ForgetPassword";
import CarouselComponent from "../CarouselComponent";
import { getUserToken } from "../../api/service";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const navigate = useNavigate();

    const imageSrcList = [
        'https://via.placeholder.com/1920x1080.png?text=Slide+1',
        'https://via.placeholder.com/1920x1080.png?text=Slide+2',
        'https://via.placeholder.com/1920x1080.png?text=Slide+3',
        'https://via.placeholder.com/1920x1080.png?text=Slide+4',
    ];

    const [currentForm, setCurrentForm] = useState("signIn"); // Default form
    const [isLoading, setIsLoading] = useState(true); // Loading state for session check

    // Navigate based on user type
    const handleUserNavigation = async () => {
        try {
            const user = await getUserToken();
            if (user.user_type === "Admin") {
                navigate("/Admin/User");
            } else if (user.user_type === "Ground Manager") {
                navigate("/home");
            }
        } catch (error) {
            console.error("Failed to retrieve user token:", error);
        }
    };

    // Check for user session on initial load
    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                await handleUserNavigation();
            }
            setIsLoading(false); // Stop loading after session check
        };
        checkUserSession();
    }, []);

    // Render appropriate form based on `currentForm`
    const renderForm = () => {
        switch (currentForm) {
            case "signIn":
                return (
                    <SignIn
                        setCurrentForm={setCurrentForm}
                        onLoginSuccess={handleUserNavigation}
                    />
                );
            case "signUp":
                return <SignUp setCurrentForm={setCurrentForm} />;
            case "forgetPassword":
                return <ForgetPassword setCurrentForm={setCurrentForm} />;
            default:
                return (
                    <SignIn
                        setCurrentForm={setCurrentForm}
                        onLoginSuccess={handleUserNavigation}
                    />
                );
        }
    };

    // Show a loading spinner while checking session
    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="container mx-auto p-4 md:p-10">
                <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden">
                    {/* Form section */}
                    <div className="w-full md:w-1/3 p-6 flex items-center justify-center">
                        {renderForm()}
                    </div>

                    {/* Carousel section */}
                    <div className="hidden md:block w-full md:w-2/3 bg-gray-100 flex justify-center items-center p-2">
                        <CarouselComponent images={imageSrcList} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
