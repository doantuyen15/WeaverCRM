import React from "react";
import PropTypes from "prop-types";
import useStorage from "../utils/localStorageHook";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, collapsedSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "SHOW_SIDENAV": {
      return { ...state, showSidenav: action.value };
    }
    case "USER_ROLE": {
      return { ...state, userInfo: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const config = useStorage('get', 'config', {
    collapsedSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    fixedNavbar: false,
  })

  const userInfo = useStorage('get', 'userInfo', {
    displayName: '',
    roles: '8'
  })

  const initialState = {
    collapsedSidenav: config.collapsedSidenav,
    sidenavColor: config.sidenavColor,
    sidenavType: config.sidenavType,
    fixedNavbar: config.fixedNavbar,
    openConfigurator: false,
    showSidenav: false,
    userInfo: userInfo,
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setCollapsedSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setShowSidenav = (dispatch, value) =>
  dispatch({ type: "SHOW_SIDENAV", value });
export const setUserInfo = (dispatch, value) =>
  dispatch({ type: "USER_ROLE", value });