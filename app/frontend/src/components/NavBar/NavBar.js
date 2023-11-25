import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
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
