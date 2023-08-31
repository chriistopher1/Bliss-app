import React, { useEffect, useState } from "react";

import style from "../styles/content.css";

import { AiOutlineDown, AiOutlineArrowLeft } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Profile from "../pages/account-pages/profile";
import ChangePassword from "../pages/account-pages/change-password";
import Order from "../pages/account-pages/order-history";
import Favourite from "../pages/account-pages/view-favourite";
import Cart from "../pages/account-pages/view-cart";

export default function Account({ info }) {
  const [title, setTitle] = useState();
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [userInfo, setUserInfo] = useState();

  const section = info.charAt(0).toUpperCase() + info.slice(1);

  const handleDropdown = () => {
    const dropdownButton = document.querySelector(".dropdown-button");
    const dropdownChild = document.querySelector(".dropdown-child");

    dropdownChild.classList.toggle("active");
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          // Verify the user's authentication token
          const checkToken = await fetch("https://bliss-express-server.vercel.app/api/product/verify-auth", {
            method: "GET",
            headers: {
              Authorization: `${token}`,
            },
          });

          if (checkToken.ok) {

            const data = await checkToken.json();

            setUserId(data.user.id);

            const userIdObject = {
              userId: data.user.id,
            };
            const response = await fetch("http://localhost:3001/api/product/get/userinfo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userIdObject),
            });

            if(response.ok){
              const data = await response.json();
              const userInfo = data.userData;
              setUserInfo(userInfo);
            }

          } else {
            console.log("Authentication failed");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        navigate("/login");
      }
    };

    // Call the fetchUserData function
    fetchUserData();

    setTitle(section);
  }, [info]);

  const sectionComponentMap = {
    profile: <Profile />,
    changePassword: <ChangePassword userId={userId} />,
    order: <Order userInfo={userInfo} />,
    favourite: <Favourite userInfo={userInfo} />,
    cart: <Cart userInfo={userInfo}/>,
  };

  const sectionComponent = sectionComponentMap[info];

  return (
    <>
      <div className="content-container flex pl-5 pr-5 pt-10 max-md:flex-col">
        <div className="category-container border-r-2 border-gray-200 w-55 flex flex-col pr-4 border-b-2 pb-5 mb-4">
          <div className="flex gap-2 items-center mb-4 text-green-500">
            <AiOutlineArrowLeft></AiOutlineArrowLeft>
            <a href="/" >Back to home</a>
          </div>
         
          <div className="category-header flex items-center justify-between border-b-2 border-gray-400 pb-2">
            <div className="category-title font-medium">Order</div>
            <button className="dropdown" onClick={handleDropdown}>
              <AiOutlineDown className="dropdown-button font-bold text-xl md:hidden"></AiOutlineDown>
            </button>
          </div>
          <div className="dropdown-child md:flex">
            <div className="order flex flex-col gap-3 mt-4 pl-5 pb-5">
              <a
                className="hover:text-teal-400 cursor-pointer transition duration-300"
                href="/account/order"
              >
                Order History
              </a>
            </div>
            <div className="account-setting-title font-medium  border-b-2 border-gray-400 pb-2">
              Account Setting
            </div>
            <div className="account-setting flex flex-col gap-3 mt-4 pl-5">
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/account/profile"
              >
                {" "}
                Profile
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/account/changePassword"
              >
                Change Password
              </a>

              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/login"
                onClick={handleSignOut}
              >
                Log out
              </a>
            </div>
            <div className="view-title font-medium  mt-4 border-b-2 border-gray-400 pb-2">
              View
            </div>
            <div className="view flex flex-col gap-3 mt-4 pl-5">
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/account/cart"
              >
                {" "}
                View Cart
              </a>

              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/account/favourite"
              >
                View Favourite Books
              </a>
            </div>
          </div>
        </div>
        <div className="info-container pl-5 flex flex-col gap-3  w-full">
          <div className="books-title font-bold text-2xl">{title}</div>

          <div className="">{sectionComponent}</div>
        </div>
      </div>
    </>
  );
}
