import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon, ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "./../widgets/layout";
import { routes } from "../router";
import { useMaterialTailwindController, setOpenConfigurator, setCollapsedSidenav, setShowSidenav } from "./../context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, collapsedSidenav, showSidenav, userInfo } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
      />
      {collapsedSidenav ? (
        <IconButton
          size="lg"
          color="white"
          className="fixed my-auto -left-4 top-1/2 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onMouseEnter={() => setShowSidenav(dispatch, true)}
        >
          <ChevronRightIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      ) : null}
      <div className={`p-4 transition-all duration-500 ${collapsedSidenav ? 'xl:mx-8' : 'xl:ml-80'}`}>
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-1 right-1 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element, subpath, roles }) => (
                roles.includes(userInfo['user_info']['role']) &&
                (subpath?.length > 0 ?
                  subpath.map(({ path, element }) => (
                    <Route exact path={path} element={element} />
                  )) : (
                    <Route exact path={path} element={element} />
                  ))
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
