import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const MainMenu = () => {
  return (
    <div>
      <NavBar />
      <ul>
        <li>
          <Link to={{ pathname: "/password" }}>Generate Password</Link>
        </li>
        <li>
          <Link to={{ pathname: "/passwords" }}>List Passwords</Link>
        </li>
      </ul>
    </div>
  );
};

export default MainMenu;
