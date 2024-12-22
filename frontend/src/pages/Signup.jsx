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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const navigate = useNavigate();

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  const validateInputs = () => {
    if (!firstName || !lastName || !username || !password) {
      setErrorMessage("All fields are required.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(username)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }

    setErrorMessage(""); // Clear error if all validations pass
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true); // Start loading
    try {
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
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false); // Stop loading once done
    }
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
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            <div className="pt-4">
              <Button
                onClick={handleSignup}
                label={loading ? "Signing up..." : "Sign up"}
                disabled={loading} // Disable button while loading
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