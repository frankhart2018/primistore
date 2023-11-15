import React from "react";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <div>
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
