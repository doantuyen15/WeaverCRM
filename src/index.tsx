import React from "react";
import ReactDOM from "react-dom/client";
import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/css/index.css";
import "./styles/css/tailwind.css";
import "./styles/css/titlebar.css";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { Router } from "./router";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "./context";
import customTheme from "./styles/css/customTheme";
import { BackgroundService } from "./service/background-service";
import { BrowserRouter } from 'react-router-dom';
import theme from "./styles/css/theme";

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
				<MUIThemeProvider theme={theme}>
					<CssBaseline />
					<BackgroundService />
					<Router />
					<ToastContainer position="top-right" transition={Slide} autoClose={1500} hideProgressBar closeOnClick pauseOnHover draggable />
				</MUIThemeProvider>
			</MaterialTailwindControllerProvider>
		</ThemeProvider>
	</React.Fragment>,
);
