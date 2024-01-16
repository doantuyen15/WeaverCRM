import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";
import "./styles/tailwind.css";
import "./styles/titlebar.css";

import { Router } from "./router";
import { ThemeProvider } from "@material-tailwind/react";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<React.StrictMode>
		<ThemeProvider>
			<ToastContainer position="bottom-right" autoClose={2500} />
			<Router />
		</ThemeProvider>
	</React.StrictMode>,
);
