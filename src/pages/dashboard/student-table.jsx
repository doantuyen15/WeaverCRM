import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon, ArrowUturnDownIcon } from "@heroicons/react/24/solid";
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
    ListItem,
    Textarea
} from "@material-tailwind/react";
import { ModalConfirmUpdate } from "../../widgets/modal/confirm-update";
import { orderBy } from 'lodash'
import StudentInfo from "../../data/entities/studentInfo";
import { ModalEditStudent } from "../../widgets/modal/edit-student";
import useFetch from "../../utils/api/request";
import { useController } from "../../context";
import moment from "moment";
import formatDate from "../../utils/formatNumber/formatDate";
import formatPhone from "../../utils/formatNumber/formatPhone";
import DayPickerInput from "../../widgets/daypicker/daypicker-input";

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
    , {
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
    const [controller] = useController();
    const { userInfo } = controller;
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [table, setTable] = useState([])
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [objectNew, setObjectNew] = useState([])
    const [objectEdit, setObjectEdit] = useState([])
    const [loading, setLoading] = useState(false)
    const [onAdd, setOnAdd] = useState(false)
    const focusRef = useRef(null)
    const tableRef = useRef([])
    const [editMode, setEditMode] = useState(false)
    const [editKey, setEditKey] = useState([])

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
        setObjectNew(prev => [...prev, {
            status_res: 0,
            phone: '',
            full_name: '',
            dob: '',
            parent_phone: '',
            address: '',
            email: '',
            referrer: '',
            advisor: ''
        }])
    }

    const handleCancelAdd = (removeIndex) => {
        setObjectNew(objectNew.filter((item, index) => index !== removeIndex))
    }

    const handleSearch = (searchValue) => {
        var search = tableRef.current.filter(item => item.full_name.toLowerCase().includes(searchValue.toLowerCase()));
        setTable(search)
    }

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, [header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setTable([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const updateObjectEdit = (key, value) => {
        objectEdit.at(-1)[key] = value
        setObjectEdit([...objectEdit])
    }

    const updateObjectNew = (index, key, value) => {
        objectNew[index][key] = value
        setObjectNew([...objectNew])
    }

    const handleConfirm = () => {
        setOpenModalConfirm(true)
    }

    const handleConfirmCallback = (ok) => {
        if (ok) {
            sendRequestAddStudent()
        } else {
            setOpenModalConfirm(false)
        }
    }

    const handleEdit = (item, index) => {
        objectEdit.push(item)
        setObjectEdit([...objectEdit])
        editKey.push(index)
        setEditKey([...editKey])
        setEditMode(true)
    }

    const handleCancelEdit = (index) => {
        setEditKey(editKey.filter(item => item !== index))
        forceUpdate()
        setEditMode(false)
    }

    const sendRequestAddStudent = () => {
        const requestInfo = {

        }
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
                        <Button className="flex items-center gap-3" size="sm" onClick={handleConfirm} disabled={objectNew.length < 1 && objectEdit.length < 1}>
                            <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Confirm & Request
                        </Button>
                        <Button className="flex items-center gap-3" size="sm" onClick={handleAddStudent}>
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add student
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* <Tabs value="all" className="w-full md:w-max whitespace-nowrap">
                        <TabsHeader>
                            {ListStatus.map(({ status, type }) => (
                                <Tab key={type} value={type}>
                                    {status}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs> */}
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
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
                                    ? "p-2"
                                    : "p-2 border-b border-blue-gray-50";
                                return (
                                    editKey.includes(index) ? (
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
                                                                            <ChevronDownIcon strokeWidth={2} className="w-2.5 h-2.5 ml-2" />
                                                                        </div>
                                                                    }
                                                                    className="min-w-32"
                                                                    color={ListStatus[Number(item.status_res)].color}
                                                                />
                                                            </div>
                                                        </MenuHandler>
                                                        <MenuList className="min-w-0 p-1">
                                                            {ListStatus.map(({ type, status, color }) => (
                                                                <MenuItem className="p-1" onClick={() => updateObjectEdit(header[0], type)} >
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
                                                <Input
                                                    autoFocus
                                                    variant="static"
                                                    type="text"
                                                    placeholder={TABLE_HEAD[1]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[1]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[1], e.target.value)
                                                    }}
                                                    error={item[header[1]].length !== 10}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[2]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[2]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[2], e.target.value)
                                                    }}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[3]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[3]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[3], e.target.value)
                                                    }}
                                                />
                                                {/* <DayPickerInput selected={''} onChange={(date) => updateObjectEdit(header[3], date)} /> */}
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[4]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[4]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[4], e.target.value)
                                                    }}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[5]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[5]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[5], e.target.value)
                                                    }}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[6]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[6]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[6], e.target.value)
                                                    }}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[7]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[7]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[7], e.target.value)
                                                    }}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Input
                                                    variant="static"
                                                    type="text"
                                                    size="sm"
                                                    placeholder={TABLE_HEAD[8]}
                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    containerProps={{
                                                        className: 'min-w-[1px]'
                                                    }}
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    value={item[header[8]]}
                                                    onChange={(e) => {
                                                        updateObjectEdit(header[8], e.target.value)
                                                    }}
                                                />
                                            </td>
                                            <td className={classes} onClick={() => handleCancelEdit(index)}>
                                                <IconButton variant="text">
                                                    <ArrowUturnLeftIcon className="h-4 w-4" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ) : (
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
                                                                <MenuItem className="p-1" >
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
                                                        {formatPhone(item.phone)}
                                                    </Typography>
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
                                                    {formatDate(item.dob)}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {formatPhone(item.parent_phone)}
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
                                                        <MenuItem onClick={() => handleEdit(item, index)}>Edit</MenuItem>
                                                        <MenuItem>Remove</MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </td>
                                        </tr>
                                    )
                                );
                            },
                        )}
                        {objectNew?.length > 0 && objectNew.map(
                            (item, index) => {
                                const isLast = index === objectNew.length - 1;
                                const classes = "p-2" + (isLast ? " border-b border-blue-gray-50" : "");
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
                                                                        <ChevronDownIcon strokeWidth={2} className="w-2.5 h-2.5 ml-2" />
                                                                    </div>
                                                                }
                                                                className="min-w-32"
                                                                color={ListStatus[Number(item.status_res)].color}
                                                            />
                                                        </div>
                                                    </MenuHandler>
                                                    <MenuList className="min-w-0 p-1">
                                                        {ListStatus.map(({ type, status, color }) => (
                                                            <MenuItem className="p-1" onClick={() => updateObjectNew(index, header[0], type)}>
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
                                            <Input
                                                autoFocus
                                                variant="static"
                                                type="text"
                                                placeholder={TABLE_HEAD[1]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[1]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[1], e.target.value)
                                                }}
                                                error={item[header[1]].length !== 10}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[2]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[2]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[2], e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[3]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[3]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[3], e.target.value)
                                                }}
                                            />
                                            {/* <DayPickerInput selected={''} onChange={(date) => updateObjectEdit(header[3], date)} /> */}
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[4]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[4]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[4], e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[5]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[5]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[5], e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[6]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[6]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[6], e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[7]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[7]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[7], e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Input
                                                variant="static"
                                                type="text"
                                                size="sm"
                                                placeholder={TABLE_HEAD[8]}
                                                className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                containerProps={{
                                                    className: 'min-w-[1px]'
                                                }}
                                                labelProps={{
                                                    className: "before:content-none after:content-none",
                                                }}
                                                value={item[header[8]]}
                                                onChange={(e) => {
                                                    updateObjectNew(index, header[8], e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td className={classes} onClick={() => handleCancelAdd(index)}>
                                            <IconButton variant="text">
                                                <ArrowUturnLeftIcon className="h-4 w-4" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                {/* <Typography variant="small" color="blue-gray" className="font-normal">
                    Page 1 of 10
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                </div> */}
            </CardFooter>
            <ModalConfirmUpdate 
                open={openModalConfirm} 
                handleOpen={setOpenModalConfirm} 
                objectNew={objectNew}
                objectEdit={objectEdit} 
                handleConfirmCallback={handleConfirmCallback}
            />
            {/* <ModalEditStudent open={openModalEdit} handleOpen={handleOpenEditStudent} objectEdit={objectEdit} /> */}
        </Card>
    );
}