import React from "react";
import { NavLink } from "react-router-dom";
import { VERSION } from "../../../utils/version";

const NavBar = () => {
  return (
    <nav className="mb-10">
      <div className="w-11/12 flex items-center justify-between mx-auto pt-10">
        <NavLink
          to={{ pathname: "/" }}
          className="md:text-2xl lg:text-4xl font-semibold"
        >
          PrimiStore v{VERSION}
        </NavLink>
        <div className="lg:w-9/12 xl:w-8/12 2xl:w-6/12">
          <ul className="font-medium rounded-lg flex flex-row justify-between items-center lg:space-x-1">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeNavLink" : "defaultNavLink"
                }
                to={{ pathname: "/" }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeNavLink" : "defaultNavLink"
                }
                to={{ pathname: "/password" }}
              >
                Create Password
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeNavLink" : "defaultNavLink"
                }
                to={{ pathname: "/passwords" }}
              >
                List Passwords
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeNavLink" : "defaultNavLink"
                }
                to={{ pathname: "/generate-password" }}
              >
                Generate Password
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "activeNavLink" : "defaultNavLink"
                }
                to={{ pathname: "/device-info" }}
              >
                Device Info
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
