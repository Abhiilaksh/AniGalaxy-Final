import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { anime } from "../assets/photo";
import { BottomWarning } from "../components/BottomWarning";
import { Loader } from "../components/Spinner";

export const Signin = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageLoaded = () => {
        setImageLoaded(true);
    };

    const handleSignIn = async () => {
        setLoading(true);
        setError("");
        if (!email || !password) {
            setError("Both email and password are required.");
            setLoading(false);
            return;
        }

        try {
            // Replace this with your actual API call
            const response = await fetch("https://api.anigalaxy.xyz/api/v1/user/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }), // change email to username
            });
            
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            console.log("Sign in successful", data);
            localStorage.setItem("token", data.token); // Use the 'data' object received from the API


            // Navigate to the dashboard or home page after successful sign in
            navigate("/");
            window.location.reload();

        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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
                <div className="flex flex-col justify-center relative z-10 mt-[-70px] ">
                    <div className="rounded-lg bg-white bg-opacity-70 backdrop-blur-md w-80 text-center p-2 h-max px-4">
                        <Heading label={"Sign in"} color={"black"} size={"2xl"} />
                        <SubHeading label={"Enter your credentials to access your account"} />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <InputBox
                            placeholder="johndoe@gmail.com"
                            label={"Email"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type={"email"}
                        />
                        <InputBox
                            placeholder="123456"
                            label={"Password"}
                            type={"password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="pt-4">
                            <Button
                                label={loading ? "Signing in..." : "Sign in"}
                                onClick={handleSignIn}
                                disabled={loading}
                            />
                        </div>
                        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                    </div>
                </div>
            )}
        </div>
    );
};
