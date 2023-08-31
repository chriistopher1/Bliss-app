import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { AiFillHeart } from "react-icons/ai"
import { BsFillCartFill, BsFillPersonFill } from "react-icons/bs"

export default function Button() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has a valid token cookie
    const token = Cookies.get("token");

    // Send a request to your server to verify authentication
    if (token) {
      fetch("https://bliss-express-server.vercel.app/api/product/verify-auth", {
        method: "GET",
        headers: {
          Authorization: `${token}`, // Include the token in the request headers with "Bearer" prefix
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true); // User is authenticated
          } else {
            setIsAuthenticated(false); // User is not authenticated
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsAuthenticated(false); // An error occurred, treat as unauthenticated
        });
    } else {
      setIsAuthenticated(false); // No token found, treat as unauthenticated
    }
  }, []);



  return (
    <>
      {isAuthenticated ? (
        <div className="flex gap-4">
          <a href="/account/favourite"> <AiFillHeart className="text-red-500 hover:text-red-800 transition duration-300 cursor-pointer text-2xl"></AiFillHeart></a>
          <a href="/account/cart"><BsFillCartFill className="text-2xl text-black hover:text-gray-500 cursor-pointer transition duration-300"></BsFillCartFill></a>
          
          <a href="/account/profile"> <BsFillPersonFill className="text-2xl text-black hover:text-gray-500 cursor-pointer transition duration-300"></BsFillPersonFill></a>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate("/login")} className="hover:text-red-500">Sign In</button>
        </div>
      )}
    </>
  );
}
