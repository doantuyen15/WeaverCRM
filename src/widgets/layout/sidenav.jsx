import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setCollapsedSidenav, setShowSidenav } from "./../../context";
import LogoDark from "../../assets/logo/we_logo_dark.png"
import LogoLight from "../../assets/logo/we_logo_light.png"

export function Sidenav({ brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, collapsedSidenav, showSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
  };
  const [currentKey, setCurrentKey] = useState('')
  console.log(currentKey);
  return (
    <aside
      className={`${sidenavTypes[sidenavType]} 
      ${showSidenav ? "translate-x-0" : collapsedSidenav ? "-translate-x-80 lg:-translate-x-20" : "-translate-x-80 lg:-translate-x-0"}
      ${collapsedSidenav ? "max-h-[60vh] w-20" : "ml-4 w-72 max-h-[calc(100vh-32px)]"} 
      fixed inset-0 z-50 my-auto rounded-xl transition-all duration-500 border border-blue-gray-100`}
      onMouseLeave={() => collapsedSidenav && setShowSidenav(dispatch, false)}
    >
      <div
        className={`relative`}
      >
        <div className="py-6 px-8 text-center">
          <div className="flex items-center justify-center">
            <img
              className={`object-cover transition-all duration-200 ${collapsedSidenav ? 'opacity-0 h-1' : 'h-20 pr-4'}`}
              src={sidenavType === "dark" ? LogoLight : LogoDark}
            />
          </div>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setCollapsedSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className={collapsedSidenav ? 'm-1' : 'm-4'}>
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                {collapsedSidenav ? (
                  <div className='border-t-2' />
                ) : (
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                )}
              </li>
            )}
            {pages.map(({ icon, name, path, subpath }) => (
              <li key={name} onMouseEnter={() => setCurrentKey(name)}>
                {subpath?.length >= 1 ? (
                  
                  <Button
                    variant={"text"}
                    color={
                      currentKey === name
                        ? sidenavColor
                        : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                    }
                    className={`flex relative ${collapsedSidenav ? 'justify-center px-0' : ''} items-center`}
                    fullWidth
                  >
                    {icon}
                    <Typography
                      color="inherit"
                      className={`font-medium capitalize ${collapsedSidenav ? "opacity-0 hidden" : "opacity-75 ml-2"}`}
                    >
                      {name}
                    </Typography>
                    <Menu
                      placement="right-start"
                      open={currentKey === name}
                      // handler={currentKey}
                    // offset={15}
                    >
                      <MenuHandler className="flex absolute right-0">
                        <MenuItem style={{ backgroundColor: 'transparent' }}>
                          <ChevronUpIcon
                            strokeWidth={2.5}
                            className={`h-3.5 w-3.5 transition-transform ${currentKey === name ? "rotate-90" : ""
                              }`}
                          />
                        </MenuItem>
                      </MenuHandler>
                      <MenuList className='mb-4 flex flex-col gap-1'>
                        {subpath?.map(({ icon, name, path }) => (
                          <MenuItem>
                            <NavLink to={`/${layout}${path}`}>
                              {({ isActive }) => (
                                <Button
                                  variant={isActive ? "gradient" : "text"}
                                  color={
                                    isActive
                                      ? sidenavColor
                                      : sidenavType === "dark"
                                        ? "white"
                                        : "blue-gray"
                                  }
                                  className={`flex ${collapsedSidenav ? 'justify-center px-0' : ''} items-center`}
                                  fullWidth
                                >
                                  {icon}
                                  <Typography
                                    color="inherit"
                                    className={`font-medium capitalize ${collapsedSidenav ? "opacity-0 hidden" : "opacity-75 ml-2"}`}
                                  >
                                    {name}
                                  </Typography>
                                </Button>
                              )}
                            </NavLink>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Button>
                ) : (
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                        }
                        className={`flex ${collapsedSidenav ? 'justify-center px-0' : ''} items-center`}
                        fullWidth
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className={`font-medium capitalize ${collapsedSidenav ? "opacity-0 hidden" : "opacity-75 ml-2"}`}
                        >
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside >
  );
}

Sidenav.defaultProps = {
  brandImg: "/assets/logo-ct.png",
  brandName: "Weaver",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
