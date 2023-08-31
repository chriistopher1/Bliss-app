
import React, { useState } from "react";
import Navbar from "./navbar"
import Content from "./content"

import { useParams } from "react-router-dom";

export default function Layout() {

  const { category }  = useParams();
  const { sortby } = useParams();
  const { time } = useParams();
  const { searchBook } = useParams();

  return (
    <div >
      <Navbar ></Navbar>
      <Content category={category} sortby={sortby} time={time} searchBook={searchBook}></Content>
      
    </div>
  );
}
