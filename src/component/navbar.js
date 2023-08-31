import { useState } from "react";

import {  BsSearch } from "react-icons/bs"

import Button from "./checkAuthButton";

import { useNavigate } from "react-router-dom";

export default function Navbar(  ) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("searched", searchQuery);

      if(searchQuery.length > 0){

        navigate("/search/" + searchQuery);
       
      }

    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="navbar bg-green-500 p-5 flex items-center justify-between shadow-md">
        <div className="logo title text-xl mt-5">Bliss</div>

        <div className="nav-search flex items-center gap-3 border-2 border-white p-2 w-auto rounded-lg ">
          <BsSearch className="text-xl"></BsSearch>
          <input
            type="text"
            className="bg-transparent text-black w-52 outline-0 sm:w-96 placeholder:text-gray-600"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Search Book"
          />
        </div>

        <div className="nav-right flex items-center gap-5">
          
          <Button ></Button>
        </div>
      </div>
    </>
  );
}
