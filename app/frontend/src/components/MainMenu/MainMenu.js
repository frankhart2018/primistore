import React from "react";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <div>
      <Link to={{ pathname: "/password" }}>Generate Password</Link>
    </div>
  );
};

export default MainMenu;
