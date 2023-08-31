import styles from "../styles/login.css";
import { useState } from "react";

import { MdEmail } from "react-icons/md";
import { BsShieldLockFill } from "react-icons/bs";

import Cookies from "js-cookie";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";

import jwt_decode from "jwt-decode";

export default function Login() {
  const [warning, setWarning] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  async function handleGoogleLogin(token) {
    var email = token.email;
    var sub = token.sub;
    var name = token.given_name;

    console.log(token);

    var userGoogleData = {
      email: email,
      googleId: sub,
      name: name
    };

    try {
      const response = await fetch("https://bliss-express-server.vercel.app/api/product/login/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userGoogleData),
      });

      if (response.ok) {
        const data = await response.json();
        const tokenGet = data.token;

        Cookies.set("token", tokenGet, 1);

        const tokenCheck = Cookies.get("token");

        if (tokenCheck) {
          console.log("Token is set:", tokenCheck);
        } else {
          console.log("Token is not set");
        }

        console.log("Google Login Complete");
        navigate("/");
      } else {
        console.log("Google Login Failed");
      }
    } catch (error) {
      console.error("Error : " + error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const isRemember = e.target["remember"].checked;

    const formData = {
      email: email,
      password: password,
      isRemember: isRemember,
    };

    console.log(formData);

    try {
      const response = await fetch("https://bliss-express-server.vercel.app/api/product/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        

        Cookies.set("token", token, { expires: isRemember ? 30 : 1 });

        const tokenCheck = Cookies.get("token");

        if (tokenCheck) {
          // The token cookie is set
          console.log("Token is set:", tokenCheck);
        } else {
          // The token cookie is not set
          console.log("Token is not set");
        }

        setLoginStatus(true);
        setWarning("Login Succesful");
        navigate("/");
      } else {
        setLoginStatus(false);
        const data = await response.json();
        setWarning(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <GoogleOAuthProvider clientId="827469737229-nui8kvq410thtg9560792c2v6cepbm20.apps.googleusercontent.com">
      <div className="m-auto flex items-center justify-center min-h-screen">
        <div className="container flex bg-teal-100 max-w-3xl shadow-xl">
          <div className="img-container">
            <img
              src={
                process.env.PUBLIC_URL + "/images/login-asset/login-photo.jpg"
              }
              className="custom-image"
              alt="Login Photo"
            />
          </div>

          <div className="form-container p-12 ">
            <div className="form-title font-bold text-2xl pb-6">Log in</div>

            <form
              className="flex flex-col gap-8"
              method="post"
              onSubmit={handleSubmit}
              id="submitForm"
            >
              <div className="email-container flex items-center border-b-2 border-black">
                <MdEmail className="text-xl" />
                <input
                  name="email"
                  placeholder="Your Email"
                  type="email"
                  className="pl-3 outline-0 w-60 bg-transparent"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="password-container flex items-center border-b-2 border-black">
                <BsShieldLockFill className="text-xl" />
                <input
                  name="password"
                  placeholder="Your Password"
                  type="password"
                  className="pl-3 outline-0 w-60 bg-transparent"
                  required
                />
              </div>

              <div className="remember-me-container flex items-center ">
                <input type="checkbox" name="remember" />
                <div className="pl-3">Remember Me</div>
              </div>

              <div className="submit-button-container flex items-center ">
                <input
                  type="submit"
                  value="Log In"
                  className="font-bold p-4 bg-teal-400 rounded-md cursor-pointer w-32"
                />
              </div>
            </form>

            <div
              className={`warning-text mt-6 ${
                loginStatus ? "text-green-600" : "text-red-600"
              }`}
            >
              {warning}
            </div>

            <div className="mt-4 login-option flex flex-col items-left gap-2">
              <div>Or login with</div>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  var decoded = jwt_decode(credentialResponse.credential);
                  handleGoogleLogin(decoded);
                  // console.log(decoded);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              ></GoogleLogin>
            </div>

            <div className="mt-3">Create a new account <a className="underline text-blue-500" href="/register">here</a></div>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
