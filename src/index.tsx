import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/css/index.css";
import "./styles/css/tailwind.css";
import "./styles/css/titlebar.css";

import { Router } from "./router";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "./context";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<React.StrictMode>
		<ThemeProvider>
			<MaterialTailwindControllerProvider>
				<ToastContainer position="bottom-right" autoClose={2500} />
				<Router />
			</MaterialTailwindControllerProvider>
		</ThemeProvider>
	</React.StrictMode>,
);
