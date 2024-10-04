import React, {useState} from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import RightSide from "./RightSide";
import ForgetPassword from "./ForgetPassword";
import CarouselComponent from "../CarouselComponent";

const AuthPage = () => {
      // List of image sources
    const imageSrcList = [
        'https://via.placeholder.com/1920x1080.png?text=Slide+1',
        'https://via.placeholder.com/1920x1080.png?text=Slide+2',
        'https://via.placeholder.com/1920x1080.png?text=Slide+3',
        'https://via.placeholder.com/1920x1080.png?text=Slide+4',
    ];

    // State to manage the current form to display
    const [currentForm, setCurrentForm] = useState('signIn'); // Default to 'signIn'

    // Handler to switch between forms
    const handleFormSwitch = (form) => {
        setCurrentForm(form);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="container mx-auto p-10">
                <div className="flex bg-white">
                    {currentForm === 'signIn' && (
                        <SignIn setCurrentForm={setCurrentForm} onSwitchForm={handleFormSwitch} />
                    )}
                    {currentForm === 'signUp' && (
                        <SignUp setCurrentForm={setCurrentForm} onSwitchForm={handleFormSwitch} />
                    )}
                    {currentForm === 'forgetPassword' && (
                        <ForgetPassword setCurrentForm={setCurrentForm} onSwitchForm={handleFormSwitch} />
                    )}
                    <div className="hidden md:block w-2/3 bg-gray-100 flex justify-center items-center p-2">
                        <CarouselComponent images={imageSrcList} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage;