import React, { useState } from "react";
import Navbar from "./navbar";

import { useParams } from "react-router-dom";

import Account from "./account";

export default function AccountLayout() {
  const { info } = useParams();

  return (
    <div>
      <Navbar></Navbar>
      <Account info={info}></Account>
    </div>
  );
}
