import React from "react";
import { NavLink } from "react-router-dom";
import NavBar from "../../parts/NavBar/NavBar";

const MainMenu = () => {
  return (
    <div>
      <NavBar />
      <ul className="flex flex-col justify-center items-center">
        <li className="my-2 text-lg font-medium underline underline-offset-4 hover:text-blue-900 hover:scale-110 transition-all duration-300">
          <NavLink to={{ pathname: "/password" }}>Create Password</NavLink>
        </li>
        <li className="my-2 text-lg font-medium underline underline-offset-4 hover:text-blue-900 hover:scale-110 transition-all duration-300">
          <NavLink to={{ pathname: "/passwords" }}>List Passwords</NavLink>
        </li>
        <li className="my-2 text-lg font-medium underline underline-offset-4 hover:text-blue-900 hover:scale-110 transition-all duration-300">
          <NavLink to={{ pathname: "/generate-password" }}>
            Generate Password
          </NavLink>
        </li>
        {process.env.REACT_APP_PI === "true" ? (
          <li className="my-2 text-lg font-medium underline underline-offset-4 hover:text-blue-900 hover:scale-110 transition-all duration-300">
            <NavLink to={{ pathname: "/device-info" }}>Device Admin</NavLink>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};

export default MainMenu;
