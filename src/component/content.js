import React, { useEffect, useState } from "react";

import { AiOutlineDown } from "react-icons/ai";

import style from "../styles/content.css";

import Card from "./card";

export default function Content({ category, sortby, time, searchBook }) {
  // console.log(category);

  const [data, setData] = useState();
  const [title, setTitle] = useState("Home");
  const [flyText, setFlyText] = useState();

  const query = {
    category: category,
    sortby: sortby,
    time: time,
    searchBook: searchBook
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://bliss-express-server.vercel.app/api/product/get/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        });

        if (response.ok) {
          console.log("get books ok");
          const data = await response.json();
          setData(data.books);
        } else {
          console.log("Fetch request failed");
        }
      } catch (error) {
        console.log("error");
        console.error("Error:", error);
      }
    };

    fetchData();
    if (category != null) {
      setTitle(category.charAt(0).toUpperCase() + category.slice(1));
    }
    if (sortby != null) {
      setTitle("Most " + sortby.charAt(0).toUpperCase() + sortby.slice(1));
    }
    if (time != null) {
      setTitle(time.charAt(0).toUpperCase() + time.slice(1));
    }
    if (searchBook != null) {
      setTitle("Searched : " + searchBook);
    }
  }, [searchBook]);

  const renderBooks = () => {
    // Check if data is undefined or empty before mapping over it
    if (!data || data.length === 0) {
      return <div>No books available</div>;
    }

    return data.map((book, index) => (
      <Card key={index} book={book}  />
    ));
  };

  const handleDropdown = () => {
    const dropdownButton = document.querySelector(".dropdown-button");
    const dropdownChild = document.querySelector(".dropdown-child");

    dropdownChild.classList.toggle("active");
  };

  return (
    <>
      {" "}
      <div className="content-container flex pl-5 pr-5 pt-10 max-md:flex-col">
        <div className="category-container border-r-2 border-gray-200 flex flex-col pr-4 border-b-2 pb-5 mb-4 md:max-md:w-full">
          <div className="category-header flex items-center justify-between border-b-2 border-gray-400 pb-2">
            <div className="category-title font-medium">Category</div>
            <button className="dropdown" onClick={handleDropdown}>
              <AiOutlineDown className="dropdown-button font-bold text-xl md:hidden"></AiOutlineDown>
            </button>
          </div>
          <div className="dropdown-child md:flex">
            <div className="categories flex flex-col gap-3 mt-4 pl-5 pb-5">
              <a
                className="hover:text-teal-400 cursor-pointer transition duration-300"
                href="/category/art"
              >
                Art
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/category/biography"
              >
                {" "}
                Biography 
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/category/children"
              >
                Children's Books
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/category/design"
              >
                {" "}
                Design
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/category/health"
              >
                Health, Fitness
              </a>
            </div>
            <div className="best-seller-title font-medium  border-b-2 border-gray-400 pb-2">
              Best Seller
            </div>
            <div className="best-seller flex flex-col gap-3 mt-4 pl-5">
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/view/wished"
              >
                {" "}
                Most Wished
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/view/viewed"
              >
                Most Viewed
              </a>
            </div>
            <div className="best-seller-title font-medium  border-b-2 border-gray-400 pb-2 mt-5">
              New Release
            </div>
            <div className="new-release flex flex-col gap-3 mt-4 pl-5">
              <a
                className="hover:text-teal-400 cursor-pointer transition duration-300"
                href="/publish/new"
              >
                Last 60 Days
              </a>
              <a
                className="hover:text-teal-400 cursor-pointer"
                href="/publish/soon"
              >
                {" "}
                Coming Soon
              </a>
            </div>
          </div>
        </div>
        <div className="books-container pl-5">
          <div className="books-title font-bold text-2xl">{title}</div>
          <div className="navigation flex gap-5 mt-8">
            <a className="p-2 bg-green-300 rounded cursor-pointer hover:bg-green-500 transition duration-300 hover:text-white" href="/publish/soon">
              Coming Soon
            </a>
            <a className="p-2 bg-green-300 rounded cursor-pointer hover:bg-green-500 transition duration-300 hover:text-white" href="/publish/new">
              New Release
            </a>
            <a className="p-2 bg-green-300 rounded cursor-pointer hover:bg-green-500 transition duration-300 hover:text-white" href="/view/viewed">
              Most Viewed
            </a>
          </div>

          <div className="card-layout flex flex-wrap gap-5 mt-5">
            {renderBooks()}
          </div>
        </div>
      </div>
    </>
  );
}
