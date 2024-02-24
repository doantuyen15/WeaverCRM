import React, { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Switch,
  Typography,
} from "@material-tailwind/react";
import {
  useController,
  setOpenConfigurator,
  setCollapsedSidenav,
  setSidenavColor,
  setSidenavType,
  setFixedNavbar,
} from "./../../context";
import useStorage from "../../utils/localStorageHook";
const ipcRenderer = window.ipcRenderer;
export function Configurator() {
  const [controller, dispatch] = useController();
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar, collapsedSidenav } =
    controller;
  const [appVersion, setAppVersion] = React.useState('1.0.0');

  const sidenavColors = {
    white: "from-gray-100 to-gray-100 border-gray-200",
    dark: "from-black to-black border-gray-200",
    green: "from-green-400 to-green-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    pink: "from-pink-400 to-pink-600",
  };

  useEffect(() => {
    const config = {
      collapsedSidenav,
      sidenavColor,
      sidenavType,
      fixedNavbar
    }
    useStorage('set', 'config', JSON.stringify(config))
  }, [sidenavColor, sidenavType, fixedNavbar, collapsedSidenav])
  

  React.useEffect(() => {
    ipcRenderer?.send("app_version");
  
    ipcRenderer?.on("app_version", (event, arg) => {
      ipcRenderer?.removeAllListeners("app_version");
      setAppVersion(arg.version)
    });
  }, []);

  const ref = useRef(null);

  const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenConfigurator(dispatch, false);
      }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white px-2.5 shadow-lg transition-transform duration-300 ${openConfigurator ? "translate-x-0" : "translate-x-96"
        }`}
      ref={ref}
    >
      <div className="flex items-start justify-between px-6 pt-8 pb-6">
        <div>
          <Typography variant="h5" color="blue-gray">
            Dashboard Configurator
          </Typography>
          <Typography className="font-normal text-blue-gray-600">
            See our dashboard options.
          </Typography>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setOpenConfigurator(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="py-4 px-6">
        <div className="mb-12">
          <Typography variant="h6" color="blue-gray">
            Sidenav Colors
          </Typography>
          <div className="mt-3 flex items-center gap-2">
            {Object.keys(sidenavColors).map((color) => (
              <span
                key={color}
                className={`h-6 w-6 cursor-pointer rounded-full border bg-gradient-to-br transition-transform hover:scale-105 ${sidenavColors[color]
                  } ${sidenavColor === color ? "border-black" : "border-transparent"
                  }`}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </div>
        </div>
        <div className="mb-12">
          <Typography variant="h6" color="blue-gray">
            Sidenav Types
          </Typography>
          <Typography variant="small" color="gray">
            Choose between 2 different sidenav types.
          </Typography>
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant={sidenavType === "dark" ? "gradient" : "outlined"}
              onClick={() => setSidenavType(dispatch, "dark")}
            >
              Dark
            </Button>
            <Button
              variant={sidenavType === "white" ? "gradient" : "outlined"}
              onClick={() => setSidenavType(dispatch, "white")}
            >
              White
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <Typography variant="h3" color="gray">
              Hide Sidenav
            </Typography>
            <Switch
              id="hide-sidenav"
              checked={collapsedSidenav}
              onChange={() => setCollapsedSidenav(dispatch, !collapsedSidenav)}
            />
          </div>
        </div>
        <div className="mb-12">
          <hr />
          <div className="flex items-center justify-between mt-3">
            <Typography variant="small" color="blue-gray">
              Navbar Fixed
            </Typography>
            <Switch
              id="navbar-fixed"
              value={fixedNavbar}
              onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
            />
          </div>
        </div>
        <div className="mb-12">
          <hr />
          <div className="flex items-center justify-between py-5">
            <Typography variant="h6" color="blue-gray">
              App Version
            </Typography>
            <Typography variant="h6" color="blue-gray">
              {appVersion}
            </Typography>
          </div>
        </div>
      </div>
    </aside>
  );
}

Configurator.displayName = "/src/widgets/layout/configurator.jsx";

export default Configurator;
