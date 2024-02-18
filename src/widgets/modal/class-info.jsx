import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
    Select,
    Option,
    IconButton,
} from "@material-tailwind/react";
import { useController } from "../../context";
import useStorage from "../../utils/localStorageHook";
import StaffInfo from "../../data/entities/staffInfo";
import { orderBy } from 'lodash'
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DefaultSkeleton, { TableSkeleton } from "../skeleton";
import { doc, getDoc } from "firebase/firestore";
import { StudentRow } from "../../pages/dashboard";
import { glb_sv } from "../../service";
import moment from "moment";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const TABLE_HEAD = [
    // "Tình trạng đăng ký",
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

const Header = [
    // 'status_res',
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

export function ModalClassInfo({ open, data, handleOpen }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [loading, setLoading] = useState(false)
    const [newStaff, setNewStaff] = useState({})
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [openAttendance, setOpenAttendance] = useState(false)
    const [mode, setMode] = useState('normal')

    useEffect(() => {
        getStudent()
    }, [])

    const getStudent = () => {
        setLoading(true)
        data.getStudentList()
            .then((res) => {
                setStudentList(res)
                setLoading(false)
            })
    }

    const updateStaffList = (key, value) => {
        if (key === 'roles' || key === 'roles_id') {
            if (newStaff[key]?.includes(value)) {
                const newRoles = newStaff[key]?.filter(item => item !== value)
                newStaff.updateInfo(key, newRoles)
            } else {
                newStaff.updateInfo(key, [...newStaff[key], value])
            }
        } else {
            newStaff.updateInfo(key, value)
            setNewStaff(newStaff)
        }
        forceUpdate()
    }

    const handleAttendance = () => {
        console.log('handleAttendance');
    }

    const changeMode = (mode) => {
        if (mode === "attendance") {
            setOpenAttendance(true)
            setMode('attendance')
        }
        if (mode === 'normal') {
            setOpenAttendance(false)
            setMode('normal')
        }
    }

    return (
        <>
            <Dialog
                size="lg"
                open={open}
                handler={() => {
                    // handleCallback(false)
                    handleOpen()
                }}
                className="bg-transparent shadow-none min-w-[80vw]"
            >
                <Card className="mx-auto w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none pb-6 relative">
                        <div className="flex justify-center">
                            <Typography variant="h4" color="black">
                                Danh sách lớp {data.id}
                            </Typography>
                        </div>
                        <div className="absolute right-0 top-0">
                            <IconButton
                                color="blue-gray"
                                size="sm"
                                variant="text"
                                onClick={() => handleOpen()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </IconButton>
                        </div>
                    </CardHeader>
                    <CardBody className="flex flex-col p-0 px-0 overflow-auto max-h-[70vh]">
                        {loading ? (
                            <div className="p-4">
                                <TableSkeleton />
                            </div>
                        ) :
                            openAttendance ? (
                                <Attendance open={openAttendance} handleCallback={handleAttendance} studentList={studentList} classInfo={data}/>
                            ) : (
                                <TableStudent setStudentList={setStudentList} studentList={studentList} />
                            )
                        }
                    </CardBody>
                    <CardFooter className="pt-0 flex justify-end">
                        <div className="flex pt-4 gap-2">
                            {mode !== 'normal' ? (
                                <Button variant="text" size="sm"
                                    onClick={() => changeMode('normal')}
                                >
                                    Trở lại
                                </Button>
                            ) : null}
                            <Button variant="text" size="sm"
                            // onClick={() => handleCallback(false)}
                            >
                                Thêm học sinh
                            </Button>
                            <Button
                                disabled={(newStaff.department_id === '' || newStaff.roles_id?.length === 0)}
                                variant="text"
                                size="sm"
                                // onClick={() => handleCallback(true, newStaff)}
                            >
                                Nhập điểm
                            </Button>
                            <Button variant="gradient" size="sm"
                                onClick={() => changeMode('attendance')}
                            >
                                {mode !== 'attendance' ? 'Điểm danh' : 'Xác nhận điểm danh'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
            {/* <Attendance open={openAttendance} handleCallback={handleAttendance}/> */}
        </>
    );
}

const TableStudent = ({ studentList, setStudentList }) => {
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const tableRef = useRef(studentList)
    const [attendanceList, setAttendanceList] = useState([{}])

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, [Header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setStudentList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }
    return (
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
                            <StudentRow
                                classes={classes}
                                item={item}
                                index={index}
                                hideColumn={true}
                            // handleEdit={handleEdit}
                            // handleRemove={handleRemove}
                            />
                        )
                    }
                )}
            </tbody>
        </table>
    )
}

const Attendance = ({open, handleCallback, studentList, classInfo}) => {
    const [calendar, setCalendar] = useState([])
    const calendarRef = useRef({})

    useEffect(() => {
        const currentMonth = moment().format('M')
        console.log((moment(1707066000000) === moment()));
        if (classInfo.attendance?.currentMonth?.length > 0) setCalendar(classInfo.attendance[currentMonth])
        else generateCalendar()
    }, [])

    const updateAttendanceList = () => {
        console.log('classInfo', classInfo);
    }

    const generateCalendar = () => {
        const startDate = moment().startOf('month');
        const endDate = moment().endOf('month');
        // Lấy mảng các ngày trong tháng
        const days = [];
        for (let i = 0; i < endDate.diff(startDate, 'days'); i++) {
            days.push(startDate.clone().add(i, 'days'));
        }
        const schooldays = []

        if (classInfo.class_schedule_id === 0) {
             days.forEach(day => (day.day() === 1 || day.day() === 3) && schooldays.push({[moment(day).valueOf()]: []}));
        } else if (classInfo.class_schedule_id === 1) {
             days.forEach(day => (day.day() === 2 || day.day() === 4) && schooldays.push({[moment(day).valueOf()]: []}));
        } else if (classInfo.class_schedule_id === 2) {
             days.forEach(day => (day.day() === 6 || day.day() === 7) && schooldays.push({[moment(day).valueOf()]: []}));
        } else if (classInfo.class_schedule_id === 3) {
             days.forEach(day => day.day() === 5 && schooldays.push({[moment(day).valueOf()]: []}));
        }
        calendarRef.current = [{[moment().format('M')]: schooldays}]
        setCalendar(schooldays)
    }
    
    return (
        <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                <tr>
                    <th className="bg-blue-gray-50/50 z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 p-4 transition-colors" />
                    {calendar.map((day, index) => (
                        <th
                            // onClick={() => handleSort(index)}
                            key={index}
                            className="odd:bg-blue-gray-50/50 z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 p-4 transition-colors"
                        >
                            {console.log(moment(Number(Object.keys(day)[0])).format('DDMMYYYY') == moment().format('DDMMYYYY'))}
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"flex items-center justify-between gap-2 leading-none " + ((moment(Number(Object.keys(day)[0])).format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {moment(Number(Object.keys(day)[0])).format('dddd')}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"flex items-center justify-between gap-2 leading-none " + ((moment(Number(Object.keys(day)[0])).format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {moment(Number(Object.keys(day)[0])).format('DD/MM/YYYY')}
                            </Typography>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {studentList?.map(
                    (item, index) => {
                        const isLast = index === studentList.length - 1;
                        const classes = isLast
                            ? "py-2 px-4 odd:bg-blue-gray-50/50"
                            : "py-2 px-4 odd:bg-blue-gray-50/50 border-b border-blue-gray-50";
                        return (
                            <tr>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {item.full_name}
                                    </Typography>
                                </td>
                                {calendar.map((day, key) => (
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {/* {moment(day)} */}
                                            {}
                                            <CheckBoxOutlineBlankIcon />
                                            <CheckBoxIcon />
                                            <IndeterminateCheckBoxIcon />
                                        </Typography>
                                    </td>
                                ))}
                            </tr>
                        )
                    }
                )}
            </tbody>
        </table>
    )
}