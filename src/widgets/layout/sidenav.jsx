import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
  Alert,
  Input,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useController, setCollapsedSidenav, setShowSidenav } from "./../../context";
import LogoDark from "../../assets/logo/we_logo_dark.png"
import LogoLight from "../../assets/logo/we_logo_light.png"
import { NavLink, useLocation } from 'react-router-dom';
import { glb_sv } from '../../service';
export function Sidenav({ brandName, routes }) {
  const [controller, dispatch] = useController();
  const { sidenavColor, sidenavType, collapsedSidenav, showSidenav } = controller;
  const userInfo = glb_sv.userInfo;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
  };
  const [open, setOpen] = React.useState('');
  const location = useLocation()
  const handleOpen = (value) => {
    setOpen(open === value ? '/' : value);
  };

  useEffect(() => {
    setOpen(location?.pathname)
  }, [])

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
              <div className="mx-3.5 mt-4 mb-2">
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
              </div>
            )}
            {pages.map(({ icon, name, path, subpath, roles }, key) => (
              roles?.includes(userInfo.roles || '8') && (
                <li key={name}>
                  {subpath?.length >= 1 ? (
                    <Accordion open={open?.includes(name)}>
                      <ListItem className="p-0" selected={open === `/${layout}${path}`}>
                        <Button
                          onClick={() => handleOpen(`/${layout}${path}`)}
                          variant={"text"}
                          color={
                            sidenavType === "dark"
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
                          {!collapsedSidenav &&
                            <ChevronRightIcon
                              strokeWidth={2.5}
                              className={`absolute right-4 h-4 w-4 transition-transform ${open?.includes(path) ? "rotate-90" : ""}`}
                            />
                          }
                        </Button>
                      </ListItem>
                      <AccordionBody className="py-1">
                        <List className="p-0 min-w-0">
                          {subpath?.map(({ icon, name, path }) => (
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
                                  <div className={collapsedSidenav ? 'mx-auto' : 'ml-3'}>
                                    {icon}
                                  </div>
                                  <Typography
                                    color="inherit"
                                    className={`font-medium capitalize ${collapsedSidenav ? "opacity-0 hidden" : "opacity-75 ml-2"}`}
                                  >
                                    {name}
                                  </Typography>
                                </Button>
                              )}
                            </NavLink>
                          ))}
                        </List>
                      </AccordionBody>
                    </Accordion>
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
              )
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
