import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { backgroundVideo } from "../assets/video";
import { BottomWarning } from "../components/BottomWarning";

export const Signin = () => {
    return (
        <div className="bg-slate-300 h-screen flex justify-center relative">
            <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="flex flex-col justify-center relative z-10 mt-4">
                <div className="rounded-lg bg-white bg-opacity-70 backdrop-blur-none w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} color={"black"}/>
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox placeholder="johndoe@gmail.com" label={"Email"} />
                    <InputBox placeholder="123456" label={"Password"} />
                    <div className="pt-4">
                        <Button label={"Sign in"} />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
};