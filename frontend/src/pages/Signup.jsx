import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { anime } from "../assets/photo"; // Import your image here
import { Loader } from "../components/Spinner";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <div className="relative w-full h-screen flex justify-center">
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
        <div className="flex flex-col justify-center z-10 mt-8">
          <div className="rounded-lg bg-white bg-opacity-70 backdrop-blur-md w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign up"} color={"black"} size={"2xl"} />
            <SubHeading label={"Enter your information to create an account"} />
            <InputBox
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              placeholder="John"
              label={"First Name"}
            />
            <InputBox
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              placeholder="Doe"
              label={"Last Name"}
            />
            <InputBox
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="johndoe@gmail.com"
              label={"Email"}
              type={"email"}
            />
            <InputBox
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="123456"
              label={"Password"}
              type={"password"}
            />
            <div className="pt-4">
              <Button
                onClick={async () => {
                  const response = await axios.post(
                    "https://anigalaxy-final-1.onrender.com/api/v1/user/signup",
                    {
                      username,
                      firstName,
                      lastName,
                      password,
                    }
                  );
                  localStorage.setItem("token", response.data.token);
                  navigate("/");
                  window.location.reload();
                }}
                label={"Sign up"}
              />
            </div>
            <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
