import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
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
	UserGroupIcon,
	BanknotesIcon,
	DocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { Approval, Home, Notifications, Profile, Tables } from "./pages/dashboard";
import { SignIn, SignUp } from "./pages/auth";
import Roles from "./pages/dashboard/roles";
import { IoInformationCircleOutline } from "react-icons/io5";
import StudentTable from "./pages/dashboard/student-table";

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

const menu = {
	className: "w-7 h-7 transition-all duration-200 hover:h-10 hover:w-10",
};

const subMenu = {
	className: "w-5 h-5 transition-all duration-200 hover:h-7 hover:w-7",
}

export const routes = [
	{
		layout: "dashboard",
		pages: [
			{
				icon: <HomeIcon {...menu} />,
				name: "dashboard",
				path: "/home",
				element: <Home />,
				roles: ["1", "8"]
			},
			{
				icon: <DocumentCheckIcon {...menu} />,
				name: "approval",
				path: "/approval",
				element: <Approval />,
				roles: ["1"]
			},
			{
				icon: <UserCircleIcon {...menu} />,
				name: "roles",
				path: "/roles",
				element: <Roles />,
				roles: ["1"]
			},
			// {
			// 	icon: <TableCellsIcon {...menu} />,
			// 	name: "tables",
			// 	path: "/tables",
			// 	roles: ["1"],
			// 	// element: <Tables />,
			// 	subpath: [
			// 		{
			// 			icon: <UserGroupIcon {...subMenu} />,
			// 			name: "student",
			// 			path: "/tables/student",
			// 			element: <StudentTable />,
			// 		},
			// 		{
			// 			icon: <BanknotesIcon {...subMenu} />,
			// 			name: "tuition",
			// 			path: "/tables/tuition",
			// 			element: <Tables />,
			// 		}
			// 	]
			// },
			{
				icon: <UserGroupIcon {...menu} />,
				name: "student",
				path: "/student",
				element: <StudentTable />,
				roles: ["1"]
			},
			{
				icon: <BanknotesIcon {...menu} />,
				name: "tuition",
				path: "/tuition",
				element: <Tables />,
				roles: ["1"]
			},
			{
				icon: <InformationCircleIcon {...menu} />,
				name: "notifications",
				path: "/notifications",
				element: <Notifications />,
				roles: ["1"]
			},
			{
				icon: <UserGroupIcon {...menu} />,
				name: "profiles",
				path: "/profiles",
				element: <Profile />,
				roles: ["1"]
			}
		],
	},
	{
		// title: "auth pages",
		layout: "auth",
		pages: [
			{
				icon: <ServerStackIcon {...menu} />,
				name: "sign in",
				path: "/sign-in",
				element: <SignIn />,
				roles: ["1", "8"]
			},
			{
				icon: <RectangleStackIcon {...menu} />,
				name: "sign up",
				path: "/sign-up",
				element: <SignUp />,
				roles: ["1"]
			},
		],
	},
];


// export const currentRoute = 

export default routes;