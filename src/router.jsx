import { HashRouter, Navigate, Route, Routes, useLocation, Redirect } from "react-router-dom";
import Dashboard from "./layouts/dashboard";
import SplashScreen from "./layouts/splash";
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
	DocumentMagnifyingGlassIcon,
	BriefcaseIcon,
	SwatchIcon,
} from "@heroicons/react/24/solid";
import { Approval, Home, Notifications, Profile, Tuition, Class, Programs, StaffList } from "./pages/dashboard";
import { SignIn, SignUp } from "./pages/auth";
import Roles from "./pages/dashboard/account";
import StudentTable from "./pages/dashboard/student-table";
import ReportScore from "./pages/dashboard/reports";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Finance from "./pages/dashboard/finance";

export const Router = () => {
	console.log('Router', typeof localStorage.getItem("userInfo"));
	return (
		<HashRouter>
			<Routes>
				<Route path="/dashboard/*" element={<Dashboard />} />
				<Route path="/auth/*" element={<Auth />} />
				<Route path="splash" element={<SplashScreen />} />
				<Route path="*" element={localStorage.getItem("userInfo") ? 
					<Navigate to="/dashboard/home" replace /> : 
					<Navigate to="/auth/sign-in" replace />} 
				/>
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
				name: "Home",
				path: "/home",
				element: <Home />,
				roles: "All"
			},
			{
				icon: <DocumentCheckIcon {...menu} />,
				name: "Duyệt",
				path: "/approval",
				element: <Approval />,
				roles: ["1"]
			},
			{
				icon: <UserCircleIcon {...menu} />,
				name: "Tài khoản nhân viên",
				path: "/roles",
				element: <Roles />,
				roles: ["1"]
			},
			{
				icon: <BriefcaseIcon {...menu} />,
				name: "Danh sách nhân viên",
				path: "/staff",
				element: <StaffList />,
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
				name: "Danh sách học viên",
				path: "/student",
				element: <StudentTable />,
				roles: ["1", "4", "6"]
			},
			{
				icon: <DocumentMagnifyingGlassIcon {...menu} />,
				name: "Report",
				path: "/report",
				element: <ReportScore />,
				roles: ["1", "4"]
			},
			{
				icon: <BanknotesIcon {...menu} />,
				name: "Học phí",
				path: "/tuition",
				element: <Tuition />,
				roles: ["1"]
			},
			{
				icon: <TableCellsIcon {...menu} />,
				name: "Danh sách Lớp",
				path: "/class",
				element: <Class />,
				roles: ["1", "4", "6"]
			},
			{
				icon: <SwatchIcon {...menu} />,
				name: "Khoá học",
				path: "/programs",
				element: <Programs />,
				roles: ["1", "4"]
			},
			{
				icon: <AttachMoneyIcon {...menu} />,
				name: "Tài chính",
				path: "/finance",
				element: <Finance />,
				roles: ["1"]
			},
			// {
			// 	icon: <InformationCircleIcon {...menu} />,
			// 	name: "notifications",
			// 	path: "/notifications",
			// 	element: <Notifications />,
			// 	roles: ["1"]
			// },
			// {
			// 	icon: <UserGroupIcon {...menu} />,
			// 	name: "profiles",
			// 	path: "/profiles",
			// 	element: <Profile />,
			// 	roles: ["1"]
			// }
		],
	},
	{
		title: "",
		layout: "auth",
		pages: [
			{
				icon: <ServerStackIcon {...menu} />,
				name: "sign in",
				path: "/sign-in",
				element: <SignIn />,
				roles: ["1", "8"]
			},
			// {
			// 	icon: <RectangleStackIcon {...menu} />,
			// 	name: "sign up",
			// 	path: "/sign-up",
			// 	element: <SignUp />,
			// 	roles: ["1"]
			// },
		],
	},
];


// export const currentRoute = 

export default routes;