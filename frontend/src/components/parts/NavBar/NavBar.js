import React from "react";
import { NavLink } from "react-router-dom";
import { VERSION } from "../../../utils/version";

const NavBar = () => {
  
  const activeClassName =
    "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-md px-5 py-2.5 me-2 mb-2";
  const nonActiveClassName =
    "border border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-md px-5 py-2.5 me-2 mb-2";

  return (
    <nav className="mb-10">
      <div className="w-11/12 flex items-center justify-between mx-auto pt-10">
        <NavLink to={{ pathname: "/" }} className="text-4xl font-semibold">
          PrimiStore v{VERSION}
        </NavLink>
        <div className="w-5/12">
          <ul className="font-medium rounded-lg flex flex-row justify-between items-center space-x-4">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
                to={{ pathname: "/" }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
                to={{ pathname: "/password" }}
              >
                Create Password
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
                to={{ pathname: "/passwords" }}
              >
                List Passwords
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
                to={{ pathname: "/generate-password" }}
              >
                Generate Safe Password
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
