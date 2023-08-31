import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";

import styles from "../styles/card.css";

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import Cookies from "js-cookie";

import jwt_decode from "jwt-decode"

export default function Card({ book }) {
  const dataURL = `data:image/jpeg;base64,${book.cover.toString("base64")}`;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [warning, setWarning] = useState();
  const [status, setStatus] = useState();

  const navigate = useNavigate();

  const checkAuth = async (clickedButton) => {
    const token = Cookies.get("token");

    // Send a request to your server to verify authentication
    if (token) {

      fetch("https://bliss-express-server.vercel.app/api/product/verify-auth", {
        method: "GET",
        headers: {
          Authorization: `${token}`, // Include the token in the request headers with "Bearer" prefix
        },
      })
        .then(async (response) => {

          if (response.ok) {

            if(clickedButton === "buy"){
              navigate("/book/" + book._id);
            }

            // console.log("halo")

            const data = await response.json();
            const decodedToken = data.user;
            const userId = decodedToken.id;

            const dataRequest = {
              clickedButton: clickedButton,
              userId: userId,
              bookId: book._id
            }

            try {
              const cardInteractResponse = await fetch(
                "https://bliss-express-server.vercel.app/api/product/cardinteract",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(dataRequest) 
                }
              );

              if (cardInteractResponse.ok) {
                const data = await cardInteractResponse.json();
                console.log("message = " + data.message);
                setWarning(data.message);
                setTimeout(() => {
                  setWarning("");
                }, 3000);
                setStatus(true);
              } else {
                console.log("error");
                const data = await cardInteractResponse.json();
                setWarning(data.message);
                setTimeout(() => {
                  setWarning("");
                }, 3000);
                setStatus(false);
              }
            } catch (error) {
              console.error();
            }
          } else {
            console.log("user not logged in");
            navigate("/login");
          }

        })
        .catch((error) => {
          console.error("Error:", error);
          setIsAuthenticated(false); // An error occurred, treat as unauthenticated
        });
    } else {
      navigate("/login");
      setIsAuthenticated(false); // No token found, treat as unauthenticated
    }
  };

  return (
    <>
      <div className="card-container p-3 flex flex-col items-left gap-2 w-52 cursor-pointer ">
        <div className="image-container flex justify-center text-center mb-2">
          <img src={dataURL} className="h-40"></img>
        </div>

        <div className="card-info flex flex-col">
          <div className="card-title hover:text-teal-400 transition duration-300">
            {book.title}
          </div>
          <div className="card-author hover:text-teal-400 transition duration-300">
            {book.author}
          </div>
          <div className="card-price">${book.price}</div>
        </div>

        <div className="card-interact flex items-center gap-5">
          <button onClick={() => checkAuth("buy")}>
            <div className="card-buynow-text cursor-pointer hover:text-teal-300 transition duration-300">
              Buy Now
            </div>
          </button>
          <button onClick={() => checkAuth("cart")}>
            <BsFillCartFill className="text-2xl text-gray-800 hover:text-gray-500 cursor-pointer transition duration-300"></BsFillCartFill>
          </button>
          <button onClick={() => checkAuth("favourite")}>
            <AiFillHeart className="text-red-500 hover:text-red-800 transition duration-300 cursor-pointer text-2xl"></AiFillHeart>
          </button>
        </div>
        <div className={`warning-text ${
                status ? "text-green-600" : "text-red-600"
              }`}>{warning}</div>
      </div>
      
    </>
  );
}
