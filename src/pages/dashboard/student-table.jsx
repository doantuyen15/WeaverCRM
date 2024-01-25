import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
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
import {orderBy} from 'lodash'
import StudentInfo from "../../data/entities/studentInfo";
import { ModalEditStudent } from "../../widgets/modal/edit-student";
import useFetch from "../../utils/api/request";
import { useMaterialTailwindController } from "../../context";

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
    "Họ & tên", 
    "Ngày sinh", 
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Người phụ trách tư vấn/hướng dẫn học sinh"
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

const header = [
    'status_res',
    'phone',
    'full_name',
    'dob',
    'parent_phone',
    'address',
    'email',
    'referrer',
    'advisor'
]

export default function StudentTable() {
    const [controller] = useMaterialTailwindController();
    const {userInfo} = controller;
    const [openModalAdd, setOpenModalAdd] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    // const handleOpenAddStudent = () => setOpenModalAdd((cur) => !cur);
    const handleOpenEditStudent = () => setOpenModalEdit((cur) => !cur);
    const [table, setTable] = useState([])
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [objectEdit, setObjectEdit] = useState([])
    const [loading, setLoading] = useState(false)
    const [onAdd, setOnAdd] = useState(false)
    const focusRef = useRef(null)
    const tableRef = useRef([])

    useEffect(() => {
        getStudentList()
    }, [])

    const getStudentList = () => {
        setLoading(true)
        const requestInfo = {
            headers: {
                "authorization": `Bearer ${userInfo.token}`,
            },
            method: 'get',
            service: 'students',
            callback: (data) => {
                setLoading(false)
                setTable(JSON.parse(data))
                tableRef.current = JSON.parse(data)
            },
            handleError: (error) => {
                console.log('error', error)
                setLoading(false)
            }
        }
        useFetch(requestInfo)
    }
    
    const handleAddStudent = () => {
        setOnAdd(true)
        tableRef.current = [...tableRef.current, {id: tableRef.current.length}]
        setTable(tableRef.current)
        setTimeout(() => {
            focusRef.current?.focus()
        }, 100);
    }

    const handleCancelAdd = (removeIndex) => {
        console.log('removeIndex', removeIndex, tableRef.current);
        tableRef.current = tableRef.current.filter(item => item.id !== removeIndex)
        console.log('removeIndex', removeIndex, tableRef.current);
        setTable(tableRef.current)
    }

    const handleSearch = (searchValue) => {
        var search = tableRef.current.filter(item => item.full_name.toLowerCase().includes(searchValue.toLowerCase()));
        setTable(search)
    }

    const handleSort = (indexCol) => {
        let sorted
        // if (key === 'Member') {
        //     sorted = orderBy(TABLE_ROWS, ['name'], [isAsc ? 'asc' : 'desc'])
        // } else return
        sorted = orderBy(tableRef.current, [header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setTable([...sorted])
        setKeySort(indexCol)
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
                        <Button className="flex items-center gap-3" size="sm" onClick={handleAddStudent}>
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
                                    onClick={() => handleSort(index)}
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
                                            keySort !== index ? (
                                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                            ) : keySort === index && isAsc ? (
                                                <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                                            ) : (
                                                <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                                            )
                                        )}
                                    </Typography>
                                </th>
                            ))}
                            <th
                                className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {table?.map(
                            (item, index) => {
                                const isLast = index === table.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                if (!item.id_student) return (
                                    <tr key={index} className="even:bg-blue-gray-50/50">
                                        {TABLE_HEAD.map((item, key) => (
                                            <td className={classes}>
                                                <Input
                                                    key={`${index}_${key}`}
                                                    variant="static"
                                                    inputRef={key === 0 ? focusRef : null}
                                                    type="text"
                                                    size="sm"
                                                    placeholder={item}
                                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                />
                                            </td>
                                        ))}
                                        <td className={classes}>
                                            <IconButton variant="text" onClick={() => handleCancelAdd(index)} >
                                                <ArrowUturnLeftIcon className="h-4 w-4" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                )

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
                                                                    <div className="flex items-center justify-center">
                                                                        {ListStatus[Number(item.status_res)].status}
                                                                        {/* <ChevronDownIcon strokeWidth={2} className="w-2.5 h-2.5" /> */}
                                                                    </div>
                                                                }
                                                                className="min-w-32"
                                                                color={ListStatus[Number(item.status_res)].color}
                                                            />
                                                        </div>
                                                    </MenuHandler>
                                                    <MenuList className="min-w-0 p-1">
                                                        {ListStatus.map(({ type, status, color }) => (
                                                            <MenuItem className="p-1" onClick={() => type !== Number(item.status_res) && handleUpdateInfo({ field: 'online', index: index, value: type })}>
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
                                                    {item.phone}
                                                </Typography>
                                                {/* <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70"
                                                >
                                                    {item.full_name}
                                                </Typography> */}
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.full_name}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.dob}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.parent_phone}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.address}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.email}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.referrer}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.advisor}
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
            <ModalAddStudent open={openModalAdd} handleOpen={handleAddStudent} />
            <ModalEditStudent open={openModalEdit} handleOpen={handleOpenEditStudent} objectEdit={objectEdit} />
        </Card>
    );
}