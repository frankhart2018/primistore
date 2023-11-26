import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../../parts/NavBar/NavBar";

const MainMenu = () => {
  return (
    <div>
      <NavBar />
      <ul>
        <li>
          <Link to={{ pathname: "/password" }}>Create Password</Link>
        </li>
        <li>
          <Link to={{ pathname: "/passwords" }}>List Passwords</Link>
        </li>
        <li>
          <Link to={{ pathname: "/generate-password" }}>
            Generate Safe Password
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MainMenu;
