import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon, ArrowUturnDownIcon, ArrowPathIcon, PlusIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
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
import { orderBy, deburr } from 'lodash'
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
import DefaultSkeleton from './../../widgets/skeleton/index'
import { glb_sv } from "../../service";
import { CreateStudent } from "../../widgets/modal/modal-student";

const TABLE_HEAD = [
    "Tình trạng đăng ký",
    "ID",
    "Họ",
    "Tên",
    "Ngày đăng ký",
    "Chương trình học/lớp",
    "Điểm",
    "Số điện thoại",
    "Ngày sinh",
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Advisor",
    "Note"
];

const ListStatus = glb_sv.ListStatus

const Header = [
    'status_res', //0
    'id', //1
    "first_name",
    "last_name",
    'register_date',
    'class_id',
    'has_score',
    'phone',
    'dob',
    'parent_phone',
    'address',
    'email', //11
    'referrer',
    'advisor',
    'note'//14
        // 'writing',
    // 'reading',
    // 'speaking',
    // 'listening',
    // 'grammar',
    // 'total',
]

const HeaderScore = [
    '',
    'Semester',
    'Grammar',
    'Listening',
    'Speaking',
    'Reading',
    'Writing',
    'Total',
    'Time'
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
    const [openModal, setOpenModal] = useState(false)
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
                // useStorage('set', 'studentInfo', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleStudentCallback = (ok, studentInfo, isUpdate) => {
        console.log('handleAddStudent', studentInfo);
        if (!ok) {
            setOpenModal(false)
        } else {
            //
        }
        // setOnAdd(true)
        // const list = [...objectNew]
        // const newStudent = new StudentInfo()
        // list.push(newStudent)
        // setObjectNew(list)
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
        sorted = orderBy(tableRef.current, (item) => { return deburr(item[Header[indexCol]]) }, [isAsc ? 'asc' : 'desc'])
        setStudentList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const updateObjectEdit = (key, value, index) => {
        try {
            const editIndex = currentEditKey.current[index]
            if (['listening', 'speaking', 'reading', 'writing', 'grammar'].includes(key)) {
                objectEdit[editIndex].updateScore({key: key, score: value, classId: 'test', type: ''})
                setObjectEdit(objectEdit)
            } else {
                objectEdit[editIndex].updateInfo(key, value)
                setObjectEdit(objectEdit)
            }
            forceUpdate()
        } catch (error) {
            console.log(error);
        }
    }

    const updateObjectNew = (index, key, value) => {
        try {
            // objectNew[index][key] = value
            if (['listening', 'speaking', 'reading', 'writing', 'grammar'].includes(key)) {
                objectNew[index].updateScore({key: key, score: value, classId: 'test', type: ''})
            } else {
                objectNew[index].updateInfo(key, value)
            }
            console.log('updateObjectNew', objectNew);
            setObjectNew(objectNew)
            forceUpdate()
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
        setObjectEdit(objectEdit)
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

    const sendRequestAddStudent = () => {
        setLoading(true)
        if (objectNew.length > 0) {
            useFirebase('add_student', objectNew)
                .then(() => {
                    toast.success("Thêm học viên thành công! Yêu cầu đang chờ duyệt")
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Thêm học viên không thành công! Lỗi: ${err}`)
                })
                .finally(() => {
                    setObjectNew([])
                    setLoading(false)
                    setOpenModalConfirm(false)
                })
        }
        if (objectEdit.length > 0) {
            console.log('objectEdit', objectEdit);
            useFirebase('update_student', objectEdit)
                .then(() => {
                    toast.success("Sửa thông tin học viên thành công! Yêu cầu đang chờ duyệt")
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Sửa thông tin học viên không thành công! Lỗi: ${err}`)
                })
                .finally(() => {
                    setObjectEdit([])
                    setLoading(false)
                    setOpenModalConfirm(false)
                })
        }
    }

    const handleRemove = (item) => {
        setLoading(true)
        useFirebase('delete_student', item)
        .then(() => {
            toast.success("Xoá học viên thành công!")
            getStudentList()
        })
        .catch((err) => {
            console.log(err);
            toast.error(`Xoá học viên không thành công! Lỗi: ${err}`)
        })
        .finally(() => {
            setLoading(false)
            setOpenModalConfirm(false)
        })
    }

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
                            {/* <Button disabled={
                                (objectNew?.length > 0 && objectNew.findIndex(item => !item.last_name || !item.first_name) > -1) || 
                                (objectEdit?.length > 0 && objectEdit.findIndex(item => !item.last_name || !item.first_name) > -1 ) ||
                                (objectNew?.length < 1 && objectEdit?.length < 1)
                            } 
                                className="flex items-center gap-3" size="sm" onClick={handleConfirm}>
                                <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Confirm & Request
                            </Button> */}
                            <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenModal(true)}>
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
                                    placeholder="Student name"
                                    label="Search student"
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
                                    const testScore = item.score_table.find(item => item.class_id === 'test') || {}
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
                                                        <Input
                                                            readOnly
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
                                                            value={item[Header[5]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[5], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Button disabled={item.has_score} className="flex items-center gap-3" size="sm"
                                                            onClick={() => updateObjectEdit(Header[6], !item.has_score, index)}
                                                        >
                                                            Nhập Điểm
                                                        </Button>
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
                                                            value={item[Header[7]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[7], e.target.value, index)
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
                                                    <td className={classes}>
                                                        <Input
                                                            variant="static"
                                                            type="text"
                                                            size="sm"
                                                            placeholder={TABLE_HEAD[13]}
                                                            className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                            containerProps={{
                                                                className: 'min-w-[1px]'
                                                            }}
                                                            labelProps={{
                                                                className: "before:content-none after:content-none",
                                                            }}
                                                            value={item[Header[13]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[13], e.target.value, index)
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Input //note
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
                                                            value={item[Header[14]]}
                                                            onChange={(e) => {
                                                                updateObjectEdit(Header[14], e.target.value, index)
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
                                                                        value={testScore?.writing}
                                                                        onChange={(e) => {
                                                                            updateObjectEdit('writing', e.target.value, index)
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
                                                                        value={testScore?.reading}
                                                                        onChange={(e) => {
                                                                            updateObjectEdit('reading', e.target.value, index)
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
                                                                        value={testScore?.speaking}
                                                                        onChange={(e) => {
                                                                            updateObjectEdit('speaking', e.target.value, index)
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
                                                                        value={testScore?.listening}
                                                                        onChange={(e) => {
                                                                            updateObjectEdit('listening', e.target.value, index)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Typography color="gray" className="mr-2 font-normal">
                                                                        Grammar
                                                                        Vocabulary
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
                                                                        value={testScore.grammar}
                                                                        onChange={(e) => {
                                                                            updateObjectEdit('grammar', e.target.value, index)
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
                                                                    <MenuItem className="p-1" onClick={() => {
                                                                        updateObjectNew(index, Header[0], type)
                                                                        forceUpdate()
                                                                    }}>
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
                                                    <Input
                                                        variant="static"
                                                        readOnly
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
                                                        value={item[Header[5]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[5], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Button className="flex items-center gap-3" size="sm" 
                                                    onClick={() => updateObjectNew(index, Header[6], !item?.has_score)}
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
                                                        value={item[Header[7]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[7], e.target.value)
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
                                                        value={moment(item[Header[8]], 'DD/MM/YYYY').format('YYYY-MM-DD')}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[8], moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))
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
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        placeholder={TABLE_HEAD[13]}
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[13]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[13], e.target.value)
                                                        }}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Input
                                                        variant="static"
                                                        type="text"
                                                        size="sm"
                                                        placeholder={TABLE_HEAD[14]}
                                                        className=" pt-2 !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        containerProps={{
                                                            className: 'min-w-[1px]'
                                                        }}
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                        value={item[Header[14]]}
                                                        onChange={(e) => {
                                                            updateObjectNew(index, Header[14], e.target.value)
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
                                                                    value={item.score_table[0]?.writing}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, 'writing', e.target.value)
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
                                                                    value={item.score_table[0]?.reading}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, 'reading', e.target.value)
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
                                                                    value={item.score_table[0]?.speaking}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, 'speaking', e.target.value)
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
                                                                    value={item.score_table[0]?.listening}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, 'listening', e.target.value)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Typography color="gray" className="mr-2 font-normal">
                                                                    Grammar Vocabulary
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
                                                                    value={item.score_table[0]?.grammar}
                                                                    onChange={(e) => {
                                                                        updateObjectNew(index, 'grammar', e.target.value)
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

                {/* <ModalConfirmUpdate
                    open={openModalConfirm}
                    handleOpen={setOpenModalConfirm}
                    objectNew={objectNew}
                    objectEdit={objectEdit}
                    handleConfirmCallback={handleConfirmCallback}
                    loading={loading}
                    StudentRow={StudentRow}
                /> */}
                {/* <ModalEditStudent open={openModalEdit} handleOpen={handleOpenEditStudent} objectEdit={objectEdit} /> */}
            </Card>

            <CreateStudent open={openModal} handleOpen={setOpenModal} handleCallback={handleStudentCallback} />
            {/* <PaymentPopup studentList={studentList} open={openPayment} handleCallback={handleMakePayment} /> */}
        </>
    );
}

export const StudentRow = ({ hideColumn = false, classes, index, item, handleEdit = () => { }, handleRemove = () => { }, isConfirm = false }) => {
    const [controller] = useController();
    const { userInfo } = controller;
    const [openPopover, setOpenPopover] = React.useState(false);
    const [scoreTable, setScoreTable] = useState([])
    const [loading, setLoading] = useState(false)

    const TableScore = ({scoreTable = []}) => {
        return (
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
                    {scoreTable.map((score, index) => {
                        return (
                            <tr key={'scorebody'}>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.class_id?.toUpperCase() || 'Test'}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {glb_sv.semester.MAP[score.term]}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.grammar}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.listening}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.speaking}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {score.reading}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {score.writing}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {score.total}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {formatDate(score.update_time, 'DD/MM/YYYY')}
                                    </Typography>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <tr key={index} className="even:bg-blue-gray-50/50">
            <td className={classes} style={{ display: !hideColumn ? 'table-cell' : 'none'}}>
                <div className="w-max">
                    <Menu placement="bottom-start" open={false}>
                        <MenuHandler>
                            <div className="flex">
                                <Chip
                                    variant="ghost"
                                    size="sm"
                                    value={
                                        <div className="flex items-center justify-center">
                                            {ListStatus[Number(item.status_res)]?.status}
                                            {/* <ChevronDownIcon strokeWidth={2} className="w-2.5 h-2.5" /> */}
                                        </div>
                                    }
                                    className="min-w-32"
                                    color={ListStatus[Number(item.status_res)]?.color}
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
            <td className={classes}>
                <div className="flex flex-row">
                    {item.class_id.map((id, indexClassID) => {
                        const isLast = indexClassID === item.class_id?.length - 1;
                        return (
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {id}{!isLast && ', '}
                            </Typography>
                        )
                    })}

                </div>
            </td>
            {item.score_table?.length > 1 || item.has_score ? (
                <td className={classes}>
                    <Popover placement="top-start" open={openPopover} handler={() => {
                        // getStudentScore(item.id);
                        setOpenPopover(prev => !prev);
                    }}>
                        <PopoverHandler>
                            <MagnifyingGlassIcon strokeWidth={2} className="w-3.5 h-3.5 cursor-pointer" />
                        </PopoverHandler>
                        <PopoverContent className="z-[999999]">
                            {loading ? (
                                <DefaultSkeleton />
                            ) : (
                                <TableScore scoreTable={item.score_table}/>
                            )}
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
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {item.note}
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
                            {userInfo.roles == 1 && <MenuItem onClick={() => handleRemove(item, index)}>Remove</MenuItem>}
                        </MenuList>
                    </Menu>
                </td>
            ) : null}
        </tr>
    )
}