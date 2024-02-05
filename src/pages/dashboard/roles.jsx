import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    TabPanel,
    Tab,
    Switch,
    Tooltip,
    Button,
    Chip,
    List,
    ListItem,
    ListItemPrefix
} from "@material-tailwind/react";
import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
    PencilIcon,
    TableCellsIcon,
    RectangleGroupIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "./../../widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "./../../data";
import { authorsTableData, projectsTableData } from "./../../data";
import React, { useState } from 'react'

const Header = ["Tên", "Mật khẩu", "Số điện thoại", ""]

export function Roles() {
    const [mod, setMod] = useState('table')

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('../../assets/background-image.png')] bg-cover	bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-32 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-4">
                    <div className="flex items-center">
                        <div className="gird-cols-1 grid gap-12 px-4 w-full">
                            <Tabs value={mod}>
                                <TabsHeader className="w-96 mx-auto">
                                    <Tab value={"table"}>
                                        <TableCellsIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                        Table
                                    </Tab>
                                    <Tab value="treemap">
                                        <RectangleGroupIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                        Tree map
                                    </Tab>
                                </TabsHeader>
                                <TabsBody>
                                    <TabPanel key={'table'} value={'table'}>
                                        <table className="w-full min-w-[640px] table-auto">
                                            <thead>
                                                <tr>
                                                    {Header.map((el) => (
                                                        <th
                                                            key={el}
                                                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                                        >
                                                            <Typography
                                                                
                                                                variant="small"
                                                                className="text-[11px] font-bold uppercase text-blue-gray-400"
                                                            >
                                                                {el}
                                                            </Typography>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {authorsTableData.map(
                                                    ({ img, name, email, job, online, date }, key) => {
                                                        const className = `py-3 px-5 ${key === authorsTableData.length - 1
                                                            ? ""
                                                            : "border-b border-blue-gray-50"
                                                            }`;

                                                        return (
                                                            <tr key={name}>
                                                                <td className={className}>
                                                                    <div className="flex items-center gap-4">
                                                                        <div>
                                                                            <Typography
                                                                                variant="small"
                                                                                color="blue-gray"
                                                                                className="font-semibold"
                                                                            >
                                                                                {name}
                                                                            </Typography>
                                                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                                                {email}
                                                                            </Typography>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                        {job[0]}
                                                                    </Typography>
                                                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                                                        {job[1]}
                                                                    </Typography>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                        {'0909.111.222'}
                                                                    </Typography>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography
                                                                        as="a"
                                                                        // href="#"
                                                                        className="text-xs font-semibold text-blue-gray-600"
                                                                    >
                                                                        Edit
                                                                    </Typography>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </TabPanel>
                                    <TabPanel key={'treemap'} value={'treemap'}>
                                        <Card className="w-96 relative mx-auto">
                                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 absolute top-0 left-0 right-0 p-3">
                                                <Typography variant="h3" color="white" className="font-bold text-center">
                                                    Giám đốc
                                                </Typography>
                                            </div>
                                            <List className="mt-16 overflow-auto max-h-40">
                                                <ListItem>
                                                    <ListItemPrefix>
                                                        <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" />
                                                    </ListItemPrefix>
                                                    <div>
                                                        <Typography variant="h6" color="blue-gray">
                                                            Tania Andrew
                                                        </Typography>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            Software Engineer @ Material Tailwind
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemPrefix>
                                                        <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" />
                                                    </ListItemPrefix>
                                                    <div>
                                                        <Typography variant="h6" color="blue-gray">
                                                            Alexander
                                                        </Typography>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            Backend Developer @ Material Tailwind
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemPrefix>
                                                        <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" />
                                                    </ListItemPrefix>
                                                    <div>
                                                        <Typography variant="h6" color="blue-gray">
                                                            Emma Willever
                                                        </Typography>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            UI/UX Designer @ Material Tailwind
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                            </List>
                                        </Card>
                                        <div className="flex mt-4">
                                            <Card className="w-96 relative mx-auto">
                                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 absolute top-0 left-0 right-0 p-3">
                                                    <Typography variant="h3" color="white" className="font-bold text-center">
                                                        Học Vụ
                                                    </Typography>
                                                </div>
                                                <List className="mt-16 overflow-auto max-h-40">
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Tania Andrew
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Software Engineer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Alexander
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Backend Developer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Emma Willever
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                UI/UX Designer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                </List>
                                            </Card>
                                            <Card className="w-96 relative mx-auto">
                                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 absolute top-0 left-0 right-0 p-3">
                                                    <Typography variant="h3" color="white" className="font-bold text-center">
                                                        Kế Toán
                                                    </Typography>
                                                </div>
                                                <List className="mt-16 overflow-auto max-h-40">
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Tania Andrew
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Software Engineer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Alexander
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Backend Developer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Emma Willever
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                UI/UX Designer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                </List>
                                            </Card>
                                        </div>
                                    </TabPanel>
                                </TabsBody>
                            </Tabs>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

export default Roles;
