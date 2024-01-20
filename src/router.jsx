import { FC } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { PopupPage } from "./pages/popup";
import Dashboard from "./layouts/dashboard";
import Auth from "./layouts/auth";
import {
	HomeIcon,
	UserCircleIcon,
	TableCellsIcon,
	InformationCircleIcon,
	ServerStackIcon,
	RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Notifications, Profile, Tables } from "./pages/dashboard";
import { SignIn, SignUp } from "./pages/auth";

export const Router = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/dashboard/*" element={<Dashboard />} />
				<Route path="/auth/*" element={<Auth />} />
				<Route path="*" element={<Navigate to="/dashboard/home" replace />} />
				<Route path="popup" element={<PopupPage />} />
			</Routes>
		</HashRouter>
	);
};

const icon = {
	className: "w-7 h-7 transition-all duration-200 hover:h-10 hover:w-10",
};

export const routes = [
	{
		layout: "dashboard",
		pages: [
			{
				icon: <HomeIcon {...icon} />,
				name: "dashboard",
				path: "/home",
				element: <Home />,
			},
			{
				icon: <UserCircleIcon {...icon} />,
				name: "profile",
				path: "/profile",
				element: <Profile />,
			},
			{
				icon: <TableCellsIcon {...icon} />,
				name: "tables",
				path: "/tables",
				element: <Tables />,
			},
			{
				icon: <InformationCircleIcon {...icon} />,
				name: "notifications",
				path: "/notifications",
				element: <Notifications />,
			},
		],
	},
	{
		title: "auth pages",
		layout: "auth",
		pages: [
			{
				icon: <ServerStackIcon {...icon} />,
				name: "sign in",
				path: "/sign-in",
				element: <SignIn />,
			},
			{
				icon: <RectangleStackIcon {...icon} />,
				name: "sign up",
				path: "/sign-up",
				element: <SignUp />,
			},
		],
	},
];

export default routes;