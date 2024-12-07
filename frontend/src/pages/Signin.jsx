import { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { anime } from "../assets/photo";
import { BottomWarning } from "../components/BottomWarning";
import { Loader } from "../components/Spinner";

export const Signin = () => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoaded = () => {
        setImageLoaded(true);
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center relative">
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Loader />
                </div>
            )}
            <img
                src={anime}
                alt="Background"
                className={`absolute inset-0 w-full h-full object-cover ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 blur-md`}
                onLoad={handleImageLoaded}
            />
            {imageLoaded && (
                <div className="flex flex-col justify-center relative z-10 mt-4">
                    <div className="rounded-lg bg-white bg-opacity-70 backdrop-blur-md w-80 text-center p-2 h-max px-4">
                        <Heading label={"Sign in"} color={"black"} size={"2xl"} />
                        <SubHeading label={"Enter your credentials to access your account"} />
                        <InputBox placeholder="johndoe@gmail.com" label={"Email"} />
                        <InputBox placeholder="123456" label={"Password"} />
                        <div className="pt-4">
                            <Button label={"Sign in"} />
                        </div>
                        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                    </div>
                </div>
            )}
        </div>
    );
};
