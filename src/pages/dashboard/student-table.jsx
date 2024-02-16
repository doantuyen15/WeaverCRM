import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon, ArrowUturnDownIcon, ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
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
    AccordionHeader,
    Accordion,
    AccordionBody,
    Popover,
    PopoverContent,
    PopoverHandler
} from "@material-tailwind/react";
import { ModalConfirmUpdate } from "../../widgets/modal/confirm-update-student";
import { orderBy } from 'lodash'
import StudentInfo from "../../data/entities/studentInfo";
import { ModalEditStudent } from "../../widgets/modal/edit-student";
import { useFetch, useFirebase } from "../../utils/api/request";
import { useController } from "../../context";
import moment from "moment";
import formatPhone from "../../utils/formatNumber/formatPhone";
import DayPickerInput from "../../widgets/daypicker/daypicker-input";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import { toast } from "react-toastify";
import formatDate from "../../utils/formatNumber/formatDate";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputMask from 'react-input-mask';

const TABLE_HEAD = [
    "Tình trạng đăng ký",
    "ID",
    "Họ",
    "Tên",
    "Ngày đăng ký",
    "Điểm",
    "Số điện thoại",
    "Ngày sinh",
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Advisor"
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
        color: 'gray'
    }
]

const Header = [
    'status_res',
    'id',
    "first_name",
    "last_name",
    'register_date',
    'has_score',
    'phone',
    'dob',
    'parent_phone',
    'address',
    'email',
    'referrer',
    'advisor',
    'writing',
    'reading',
    'speaking',
    'listening',
    'test_input_score'
]

const HeaderScore = [
    // 'Chương trình học',
    'Listening',
    'Speaking',
    'Reading',
    'Writing',
    'Score',
]

export default function StudentTable() {
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [studentList, setStudentList] = useState([])
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
    const [openScore, setOpenScore] = useState(-1)
    const [openPayment, setOpenPayment] = useState(false)
    const [controller] = useController();
    const { userInfo } = controller;
    const currentEditKey = useRef({})    

    useEffect(() => {
        getStudentList()
    }, [])

    const getStudentList = () => {
        setLoading(true)
        useFirebase('get_student')
            .then(data => {
                console.log('getStudentList', data);
                tableRef.current = data
                setStudentList(data)
                useStorage('set', 'studentInfo', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleAddStudent = () => {
        setOnAdd(true)
        const list = [...objectNew]
        const newStudent = new StudentInfo()
        list.push(newStudent)
        // list.push({
        //     status_res: '1',
        //     dob: '',
        //     first_name: '',
        //     last_name: '',
        //     phone: '',
        //     parent_phone: '',
        //     address: '',
        //     email: '',
        //     referrer: '',
        //     advisor: '',
        //     register_date: moment(Date.now()).format('DD/MM/YYYY'),
        //     listening: '',
        //     speaking: '',
        //     reading: '',
        //     writing: '',
        //     grammar: '',
        //     vocabulary: '',
        //     test_input_score: '',
        //     id_class_temp: '',
        //     note: '',
        //     has_score: false
        // })
        setObjectNew(list)
    }

    const handleCancelAdd = (removeIndex) => {
        setObjectNew(objectNew.filter((item, index) => index !== removeIndex))
    }

    const handleSearch = (searchValue) => {
        try {
            var search = tableRef.current.filter(item => item.full_name.toLowerCase().includes(searchValue.toLowerCase()));
            setStudentList(search)
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, [Header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setStudentList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const updateObjectEdit = (key, value, index) => {
        console.log('currentEditKey.current', currentEditKey.current);
        try {
            const editIndex = currentEditKey.current[index]
            objectEdit[editIndex][key] = value
            setObjectEdit([...objectEdit])
        } catch (error) {
            console.log(error);
        }
    }

    const updateObjectNew = (index, key, value) => {
        try {
            // objectNew[index][key] = value
            objectNew[index].updateInfo(key, value)
            setObjectNew([...objectNew]) 
        } catch (error) {
            console.log(error);
        }
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
        currentEditKey.current = {
            ...currentEditKey.current,
            [index]: objectEdit?.length - 1
        }
        setObjectEdit([...objectEdit])
        editKey.push(index)
        setEditKey([...editKey])
        setEditMode(true)
    }

    const handleCancelEdit = (removeIndex) => {
        console.log('currentEditKey.current', currentEditKey.current);

        const editIndex = currentEditKey.current[removeIndex]
        let temp = [...editKey].filter(item => item !== removeIndex)
        setEditKey(temp)
        setObjectEdit([...objectEdit.filter((item, i) => i !== editIndex)])
        delete currentEditKey.current[removeIndex]
        forceUpdate()
        setEditMode(false)
    }
    console.log('objectEdit', objectEdit);

    const sendRequestAddStudent = () => {
        setLoading(true)
        useFirebase('add_student', objectNew)
            .then(() => {
                toast.success("Thêm sinh viên thành công! Yêu cầu đang chờ duyệt")
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Thêm sinh viên không thành công! Lỗi: ${err}`)
            })
            .finally(() => {
                setObjectEdit([])
                setObjectNew([])
                setLoading(false)
                setOpenModalConfirm(false)
            })
    }

    const handleRemove = () => {
        console.log('handleRemove');
        // setAlertModal(true)
    }

    // const handleMakePayment = (ok, listPayment = []) => {
    //     console.log('handleMakePayment', ok, listPayment);
    //     setLoading(true)

    //     if (ok) {
    //         listPayment.forEach(item => {
    //             setTimeout(() => {
    //                 const requestInfo = {
    //                     body: [
    //                         item.id_student,
    //                         item.id_class,
    //                         item.id_class_type,
    //                         item.date,
    //                         item.tuition,
    //                         item.note
    //                     ],
    //                     headers: {
    //                         "authorization": `${userInfo.token}`,
    //                     },
    //                     method: 'post',
    //                     service: 'createTuition',
    //                     callback: (data) => {
    //                         setLoading(false)
    //                         // setStudentList(data)
    //                         // tableRef.current = data
    //                     },
    //                     handleError: (error) => {
    //                         // console.log('error', error)
    //                         setLoading(false)
    //                     },
    //                     showToast: true
    //                 }
    //                 useFetch(requestInfo)
    //             }, 300);
    //         })
    //     }
    //     setOpenPayment(false)
    // }

    return (
        <>
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
                            <Button className="flex items-center gap-3" size="sm" onClick={handleConfirm} disabled={objectNew?.length < 1 && objectEdit.length < 1}>
                                <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Confirm & Request
                            </Button>
                            <Button className="flex items-center gap-3" size="sm" onClick={handleAddStudent}>
                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add student
                            </Button>
                            {/* <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenPayment(true)}>
                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Make a tuition payment
                            </Button> */}
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
                        <div className="w-full flex items-center justify-between">
                            <div className="w-full md:w-72">
                                <Input
                                    className=""
                                    label="Search"
                                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                className="flex items-center gap-3"
                                size="sm"
                                onClick={() => getStudentList()}
                            >
                                <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                            </Button>
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
                                            {(index === 0 || index === 1 || index === 3) && (
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
                            {studentList?.map(
                                (item, index) => {
                                    const isLast = index === studentList.length - 1;
                                    const classes = isLast
                                        ? "py-2 px-4"
                                        : "py-2 px-4 border-b border-blue-gray-50";
                                    return (
                                        editKey.includes(index) ? (
                                            <>
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
                                                                        <MenuItem className="p-1" onClick={() => updateObjectEdit(Header[0], type, index)} >
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
                                                            readOnly
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
                                                            value={item[Header[1]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[1], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            autoFocus
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
                                                            value={item[Header[2]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[2], e.target.value, index)
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
                                                            value={item[Header[3]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[3], e.target.value, index)
                                                            }}
                                                        />
                                                        {/* <DayPickerInput selected={''} onChange={(date) => updateObjectEdit(header[3], date)} /> */}
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            readOnly
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
                                                            value={formatDate(item[Header[4]])}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[4], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Button disabled={item.has_score} className="flex items-center gap-3" size="sm"
                                                            onClick={() => updateObjectEdit(Header[5], !item.has_score, index)}
                                                        >
                                                            Nhập Điểm
                                                        </Button>
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="text"
                                                            size="sm"
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[6]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[6], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="date"
                                                            size="sm"
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[7]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[7], e.target.value, index)
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
                                                            value={item[Header[8]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[8], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="text"
                                                            size="sm"
                                                            placeholder={TABLE_HEAD[9]}
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[9]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[9], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="text"
                                                            size="sm"
                                                            placeholder={TABLE_HEAD[10]}
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[10]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[10], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="text"
                                                            size="sm"
                                                            placeholder={TABLE_HEAD[11]}
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[11]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[11], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="text"
                                                            size="sm"
                                                            placeholder={TABLE_HEAD[12]}
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[12]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[12], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes} onClick={() => handleCancelEdit(index)}>
                                                        <IconButton variant="text">
                                                            <ArrowUturnLeftIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                                {item.has_score ? (
                                                    <tr key={'score' + index} className="even:bg-blue-gray-50/50">
                                                        <td colSpan={2}></td>
                                                        <td colSpan={15}>
                                                            <div className="flex items-center gap-4 p-2">
                                                                <div className="flex items-center">
                                                                    <Typography color="gray" className="mr-2 font-normal">
                                                                        Writing
                                                                    </Typography>
                                                                    <Input
                                                                        autoFocus
                                                                        maxLength={5}
                                                                        type="tel"
                                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                        containerProps={{
                                                                            className: "min-w-[72px] max-w-[72px]"
                                                                        }}
                                                                        labelProps={{
                                                                            className: "before:content-none after:content-none",
                                                                        }}
                                                                        value={item[Header[13]]}
                                                                        onChange={(e) => {
                                                                            updateObjectNew(index, Header[13], e.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Typography color="gray" className="mr-2 font-normal">
                                                                        Reading
                                                                    </Typography>
                                                                    <Input
                                                                        maxLength={5}
                                                                        type="tel"
                                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                        containerProps={{
                                                                            className: "min-w-[72px] max-w-[72px]"
                                                                        }}
                                                                        labelProps={{
                                                                            className: "before:content-none after:content-none",
                                                                        }}
                                                                        value={item[Header[14]]}
                                                                        onChange={(e) => {
                                                                            updateObjectNew(index, Header[14], e.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Typography color="gray" className="mr-2 font-normal">
                                                                        Speaking
                                                                    </Typography>
                                                                    <Input
                                                                        maxLength={5}
                                                                        type="tel"
                                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                        containerProps={{
                                                                            className: "min-w-[72px] max-w-[72px]"
                                                                        }}
                                                                        labelProps={{
                                                                            className: "before:content-none after:content-none",
                                                                        }}
                                                                        value={item[Header[15]]}
                                                                        onChange={(e) => {
                                                                            updateObjectNew(index, Header[15], e.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Typography color="gray" className="mr-2 font-normal">
                                                                        Listening
                                                                    </Typography>
                                                                    <Input
                                                                        maxLength={5}
                                                                        type="tel"
                                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                        containerProps={{
                                                                            className: "min-w-[72px] max-w-[72px]"
                                                                        }}
                                                                        labelProps={{
                                                                            className: "before:content-none after:content-none",
                                                                        }}
                                                                        value={item[Header[16]]}
                                                                        onChange={(e) => {
                                                                            updateObjectNew(index, Header[16], e.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </>
                                        ) : (
                                            <StudentRow
                                                classes={classes}
                                                item={item}
                                                index={index}
                                                handleEdit={handleEdit}
                                                handleRemove={handleRemove}
                                            />
                                        )
                                    );
                                },
                            )}
                            {objectNew?.length > 0 && objectNew.map(
                                (item, index) => {
                                    const isLast = index === objectNew.length - 1;
                                    const classes = "py-2 px-4" + (isLast ? " border-b border-blue-gray-50" : "");
                                    return (
                                        <>
                                            <tr key={'new' + index} className="even:bg-blue-gray-50/50">
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
                                                                                {ListStatus[Number(item.status_res)]?.status}
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
                                                                    <MenuItem className="p-1" onClick={() => updateObjectNew(index, Header[0], type)}>
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
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        autoFocus
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
                                                        value={item[Header[2]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[2], e.target.value)
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
                                                        value={item[Header[3]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[3], e.target.value)
                                                        }}
                                                    />
                                                    {/* <DayPickerInput selected={''} onChange={(date) => updateObjectEdit(header[3], date)} /> */}
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        readOnly
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
                                                        value={item[Header[4]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[4], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Button className="flex items-center gap-3" size="sm" 
                                                    onClick={() => updateObjectNew(index, Header[5], !item?.has_score)}
                                                    >
                                                        Nhập Điểm
                                                    </Button>
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[6]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[6], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="date"
                                                        size="sm"
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={moment(item[Header[7]], 'DD/MM/YYYY').format('YYYY-MM-DD')}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[7], moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))
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
                                                        value={item[Header[8]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[8], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        placeholder={TABLE_HEAD[9]}
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[9]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[9], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        placeholder={TABLE_HEAD[10]}
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[10]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[10], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        placeholder={TABLE_HEAD[11]}
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[11]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[11], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        placeholder={TABLE_HEAD[12]}
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[12]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[12], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes} onClick={() => handleCancelAdd(index)}>
                                                    <IconButton variant="text">
                                                        <ArrowUturnLeftIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                            {item.has_score ? (
                                                <tr key={'score' + index} className="even:bg-blue-gray-50/50">
                                                    <td colSpan={2}></td>
                                                    <td colSpan={15}>
                                                        <div className="flex items-center gap-4 p-2">
                                                            <div className="flex items-center">
                                                                <Typography color="gray" className="mr-2 font-normal">
                                                                    Wrting
                                                                </Typography>
                                                                <Input
                                                                    autoFocus
                                                                    maxLength={5}
                                                                    type="tel"
                                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                    containerProps={{
                                                                        className: "min-w-[72px] max-w-[72px]"
                                                                    }}
                                                                    labelProps={{
                                                                        className: "before:content-none after:content-none",
                                                                    }}
                                                                    value={item[Header[13]]}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, Header[13], e.target.value)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Typography color="gray" className="mr-2 font-normal">
                                                                    Reading
                                                                </Typography>
                                                                <Input
                                                                    maxLength={5}
                                                                    type="tel"
                                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                    containerProps={{
                                                                        className: "min-w-[72px] max-w-[72px]"
                                                                    }}
                                                                    labelProps={{
                                                                        className: "before:content-none after:content-none",
                                                                    }}
                                                                    value={item[Header[14]]}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, Header[14], e.target.value)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Typography color="gray" className="mr-2 font-normal">
                                                                    Speaking
                                                                </Typography>
                                                                <Input
                                                                    maxLength={5}
                                                                    type="tel"
                                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                    containerProps={{
                                                                        className: "min-w-[72px] max-w-[72px]"
                                                                    }}
                                                                    labelProps={{
                                                                        className: "before:content-none after:content-none",
                                                                    }}
                                                                    value={item[Header[15]]}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, Header[15], e.target.value)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Typography color="gray" className="mr-2 font-normal">
                                                                    Listening
                                                                </Typography>
                                                                <Input
                                                                    maxLength={5}
                                                                    type="tel"
                                                                    className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                                                                    containerProps={{
                                                                        className: "min-w-[72px] max-w-[72px]"
                                                                    }}
                                                                    labelProps={{
                                                                        className: "before:content-none after:content-none",
                                                                    }}
                                                                    value={item[Header[16]]}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, Header[16], e.target.value)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : null}
                                        </>
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
                    loading={loading}
                    StudentRow={StudentRow}
                />
                {/* <ModalEditStudent open={openModalEdit} handleOpen={handleOpenEditStudent} objectEdit={objectEdit} /> */}
            </Card>
            {/* <PaymentPopup studentList={studentList} open={openPayment} handleCallback={handleMakePayment} /> */}
        </>
    );
}

export const StudentRow = ({ classes, index, item, handleEdit = () => { }, handleRemove = () => { }, isConfirm = false }) => {
    const [controller] = useController();
    const { userInfo } = controller;
    const [openPopover, setOpenPopover] = React.useState(false);
 
    const triggers = {
      onMouseEnter: () => {
        console.log('onMouseEnter');
        setOpenPopover(true)
      },
      onMouseLeave: () => setOpenPopover(false),
    };

    return (
        <tr key={index} className="even:bg-blue-gray-50/50">
            <td className={classes}>
                <div className="w-max">
                    <Menu placement="bottom-start" open={false}>
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
                        {item.id}
                    </Typography>
                </div>
            </td>
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {item.first_name}
                </Typography>
            </td>
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {item.last_name}
                </Typography>
            </td>
            <td className={classes}>
                <div className="flex flex-col">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                    >
                        {formatDate(item.register_date)}
                    </Typography>
                </div>
            </td>
            {item.has_score ? (
                <td className={classes}>
                    <Popover placement="top-start" open={openPopover} handler={setOpenPopover}>
                        <PopoverHandler {...triggers}>
                            <MagnifyingGlassIcon strokeWidth={2} className="w-3.5 h-3.5" />
                        </PopoverHandler>
                        <PopoverContent {...triggers} className="z-[999999]">
                            <table className="text-left">
                                <thead>
                                    <tr>
                                        {HeaderScore.map((head) => (
                                            <th
                                                key={head}
                                                className="border-b p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={'scorebody' + index}>
                                        <td className='p-4'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.listening}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item.speaking}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-medium"
                                            >
                                                {item.reading}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-medium"
                                            >
                                                {item.writing}
                                            </Typography>
                                        </td>
                                        <td className='p-4'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-medium"
                                            >
                                                {item.vocabulary}
                                            </Typography>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </PopoverContent>
                    </Popover>
                </td>
            ) : <td/>}
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
            {!isConfirm ? (
                <td className={classes}>
                    <Menu placement="left-start">
                        <MenuHandler>
                            <IconButton variant="text">
                                <PencilIcon className="h-4 w-4" />
                            </IconButton>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem onClick={() => handleEdit(item, index)}>Edit</MenuItem>
                            {userInfo.role === '1' && <MenuItem onClick={() => handleRemove(item, index)}>Remove</MenuItem>}
                        </MenuList>
                    </Menu>
                </td>
            ) : null}
        </tr>
    )
}