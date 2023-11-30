import React from "react";
import { Link } from "react-router-dom";
import { VERSION } from "../../../utils/version";

const NavBar = () => {
  return (
    <div>
      <h1>PrimiStore v{VERSION}</h1>
      <Link to={{ pathname: "/" }}>
        <button type="button">Home</button>
      </Link>
      <Link to={{ pathname: "/password" }}>
        <button type="button">Create Password</button>
      </Link>
      <Link to={{ pathname: "/passwords" }}>
        <button type="button">List Passwords</button>
      </Link>
      <Link to={{ pathname: "/generate-password" }}>
        <button type="button">Generate Safe Password</button>
      </Link>
    </div>
  );
};

export default NavBar;
