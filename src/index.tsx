import React from "react";
import ReactDOM from "react-dom/client";
import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/css/index.css";
import "./styles/css/tailwind.css";
import "./styles/css/titlebar.css";

import { Router } from "./router";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "./context";
import customTheme from "./styles/css/customTheme";
import { BackgroundService } from "./service/background-service";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

console.warn = function() {
	// Suppress warning logs in development mode
}

root.render(
	<React.Fragment>
		<ThemeProvider value={customTheme}>
			<MaterialTailwindControllerProvider>
				<BackgroundService />
				<Router />
				<ToastContainer position="top-right" transition={Slide} hideProgressBar closeOnClick pauseOnHover draggable />
			</MaterialTailwindControllerProvider>
		</ThemeProvider>
	</React.Fragment>,
);
