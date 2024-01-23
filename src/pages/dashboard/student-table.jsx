import React, { useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Select,
    Option,
    List,
    ListItem
} from "@material-tailwind/react";
import { ModalAddStudent } from "../../widgets/modal/add-student";
import orderBy from 'lodash/orderBy'
import StudentInfo from "../../data/entities/studentInfo";
import { ModalEditStudent } from "../../widgets/modal/edit-student";


const TABS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Monitored",
        value: "monitored",
    },
    {
        label: "Unmonitored",
        value: "unmonitored",
    },
];

const TABLE_HEAD = [
    "Tình trạng đăng ký", 
    "Số điện thoại", 
    "Họ", 
    "Tên", 
    "Ngày sinh", 
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Người phụ trách tư vấn/hướng dẫn học sinh",
    ""
];

const TABLE_ROWS = [
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "atesst.com",
        job: "Manager",
        org: "Organization",
        online: 0,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "test1.com",
        job: "Manager",
        org: "Organization",
        online: 1,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "atest2.com",
        job: "Manager",
        org: "Organization",
        online: 2,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "test1.com",
        job: "Manager",
        org: "Organization",
        online: 1,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "atest2.com",
        job: "Manager",
        org: "Organization",
        online: 2,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "test1.com",
        job: "Manager",
        org: "Organization",
        online: 1,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "atest2.com",
        job: "Manager",
        org: "Organization",
        online: 2,
        date: "23/04/18",
    }
    ,    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "test1.com",
        job: "Manager",
        org: "Organization",
        online: 1,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "atest2.com",
        job: "Manager",
        org: "Organization",
        online: 2,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "test1.com",
        job: "Manager",
        org: "Organization",
        online: 1,
        date: "23/04/18",
    },
    {
        firstname: "Nguyễn Văn",
        lastname: "Test1",
        email: "atest2.com",
        job: "Manager",
        org: "Organization",
        online: 2,
        date: "23/04/18",
    }
];

const ListStatus = [
    {
        type: 0,
        status: 'Đã đăng ký',
        color: 'green'
    },
    {
        type: 1,
        status: 'Chưa đăng ký',
        color: 'red'
    },
    {
        type: 2,
        status: 'Đã nghỉ',
        color: ''
    }
]

export default function StudentTable() {
    const [openModalAdd, setOpenModalAdd] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const handleOpenAddStudent = () => setOpenModalAdd((cur) => !cur);
    const handleOpenEditStudent = () => setOpenModalEdit((cur) => !cur);
    const [table, setTable] = useState(TABLE_ROWS)
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [objectEdit, setObjectEdit] = useState([])

    const handleSearch = (searchValue) => {
        const sorted = TABLE_ROWS.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
        setTable([...sorted])
    }

    const handleSort = (key) => {
        let sorted
        if (key === 'Member') {
            sorted = orderBy(TABLE_ROWS, ['name'], [isAsc ? 'asc' : 'desc'])
        } else return
        setTable([...sorted])
        setKeySort(key)
        setIsAsc(prev => !prev)
    }

    const handleConfirmEdit = () => {
        console.log();

    }

    const handleUpdateInfo = ({ field, index, value }) => {
        const update = table[index] || new StudentInfo()
        update[field] = value
        const tableRef = [...table]
        tableRef[index] = update
        setObjectEdit(prev => [...prev, update])
        setTable(tableRef)
    }

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none pb-6">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Students list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all students
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button className="flex items-center gap-3" size="sm" onClick={handleOpenEditStudent} disabled={!objectEdit.length}>
                            <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Confirm & Save
                        </Button>
                        <Button className="flex items-center gap-3" size="sm" onClick={handleOpenAddStudent}>
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value="all" className="w-full md:w-max">
                        <TabsHeader>
                            {TABS.map(({ label, value }) => (
                                <Tab key={value} value={value}>
                                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0 px-0 overflow-auto max-h-[60vh]">
                <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th
                                    onClick={() => handleSort(head)}
                                    key={head}
                                    className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {head}{" "}
                                        {index !== TABLE_HEAD.length - 1 && (
                                            keySort !== head ? (
                                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                            ) : keySort === head && isAsc ? (
                                                <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                                            ) : (
                                                <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                                            )
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.map(
                            ({ firstname,
                                lastname,
                                email,
                                job,
                                org,
                                online,
                                date }, index) => {
                                const isLast = index === table.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={index} className="even:bg-blue-gray-50/50">
                                        <td className={classes}>
                                            <div className="w-max">
                                                <Menu placement="bottom-start">
                                                    <MenuHandler>
                                                        <div className="flex">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={
                                                                    <div className="flex items-center justify-between">
                                                                        {ListStatus[online].status}
                                                                        <ChevronDownIcon strokeWidth={2} className="w-2.5 h-2.5" />
                                                                    </div>
                                                                }
                                                                className="min-w-32"
                                                                color={ListStatus[online].color}
                                                            />
                                                        </div>
                                                    </MenuHandler>
                                                    <MenuList className="min-w-0 p-1">
                                                        {ListStatus.map(({ type, status, color }) => (
                                                            <MenuItem className="p-1" onClick={() => type !== online && handleUpdateInfo({ field: 'online', index: index, value: type })}>
                                                                <Chip
                                                                    className="w-full text-center"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    value={status}
                                                                    color={color}
                                                                />
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </Menu>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {job}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70"
                                                >
                                                    {org}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Menu placement="left-start">
                                                <MenuHandler>
                                                    <IconButton variant="text">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </MenuHandler>
                                                <MenuList>
                                                    <MenuItem>Edit</MenuItem>
                                                    <MenuItem>Remove</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
            {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page 1 of 10
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                </div>
            </CardFooter> */}
            <ModalAddStudent open={openModalAdd} handleOpen={handleOpenAddStudent} />
            <ModalEditStudent open={openModalEdit} handleOpen={handleOpenEditStudent} objectEdit={objectEdit} />
        </Card>
    );
}