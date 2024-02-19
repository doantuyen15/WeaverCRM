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
import { useFirebase } from "../../utils/api/request";
import { toast } from "react-toastify";
import { AddStudentToClass } from "./add-student-class";

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

const HEADER_SCORE = [
    "Listening",
    "Reading",
    "Writing",
    "Speaking",
    "Tổng điểm",
];

const SCORE_FIELD = [
    "listening",
    "reading",
    "writing",
    "speaking",
    "total"
]


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
const currentMonth = moment().format('M')

export function ModalClassInfo({ open, data, handleOpen, classList }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [loading, setLoading] = useState(false)
    const [newStaff, setNewStaff] = useState({})
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [openAttendance, setOpenAttendance] = useState(false)
    const [openAddStudent, setOpenAddStudent] = useState(false)
    const [openInputScore, setOpenInputScore] = useState(false)
    const [mode, setMode] = useState('normal')
    const [calendar, setCalendar] = useState([])

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
        if (mode === "addStudent") {
            setOpenAddStudent(true)
            setMode('addStudent')
        }
        if (mode === "attendance") {
            setOpenAttendance(true)
            setMode('attendance')
        }
        if (mode === 'normal') {
            setOpenAttendance(false)
            setOpenAddStudent(false)
            setOpenInputScore(false)
            setMode('normal')
        }
        if (mode === 'score') {
            setOpenInputScore(true)
            setMode('score')
        }
    }

    const handleUpdateAttendance = () => {
        useFirebase('update_attendance', {
            id: data.id,
            month: currentMonth,
            data: calendar
        })
            .then(() => {
                toast.success(`Điểm danh lớp ${data.id} thành công!`)
            })
    }

    const handleAddStudent = (ok, studentList) => {
        if (!ok) {
            changeMode('normal')
            setOpenAddStudent(false)
        } else {
            setLoading(true)
            useFirebase('add_student_classes', studentList)
                .then(() => {
                    setLoading(false)
                    changeMode('normal')
                    toast.success("Add Success!")
                })
                .catch((error) => toast.error(error))
        }
    }

    return (
        <div>
            <Dialog
                size="lg"
                open={open}
                handler={() => {
                    // handleCallback(false)
                    if (mode === 'normal') handleOpen()
                }}
                className={"bg-transparent shadow-none min-w-[80vw]"}
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
                        ) : openAttendance ? (
                            <Attendance
                                open={openAttendance}
                                handleCallback={handleAttendance}
                                studentList={studentList}
                                classInfo={data}
                                calendar={calendar}
                                setCalendar={setCalendar}
                            />
                        ) : openInputScore ? (
                            <ScoreTable setStudentList={setStudentList} studentList={studentList} data={data} />
                        ) : (
                            <TableStudent setStudentList={setStudentList} studentList={studentList} />
                        )}
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
                                onClick={() => {mode === 'addStudent' ? handleUpdateAttendance() : changeMode('addStudent')}}
                            >
                                {mode !== 'addStudent' ? 'Thêm học sinh' : 'Xác nhận thêm học sinh'}
                            </Button>
                            <Button
                                disabled={(newStaff.department_id === '' || newStaff.roles_id?.length === 0)}
                                variant="text"
                                size="sm"
                                onClick={() => {
                                    mode === 'score' ? () => {} : changeMode('score')
                                }}
                            >
                                Nhập điểm
                            </Button>
                            <Button variant="gradient" size="sm"
                                onClick={() => {
                                    mode === 'attendance' ? handleUpdateAttendance() : changeMode('attendance')
                                }}
                            >
                                {mode !== 'attendance' ? 'Điểm danh' : 'Xác nhận điểm danh'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
            <AddStudentToClass loading={loading} classList={classList} open={openAddStudent} handleCallback={handleAddStudent}/>
            {/* <Attendance open={openAttendance} handleCallback={handleAttendance}/> */}
        </div>
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

const Attendance = ({open, handleCallback, studentList, classInfo, calendar, setCalendar}) => {
    const calendarRef = useRef({})

    useEffect(() => {
        if (classInfo.attendance[currentMonth]?.length > 0) {
            setCalendar(classInfo.attendance[currentMonth])
            calendarRef.current = classInfo.attendance[currentMonth]
        }
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
             days.forEach(day => (day.day() === 1 || day.day() === 3) && schooldays.push({[moment(day).valueOf()]: new Object()}));
        } else if (classInfo.class_schedule_id === 1) {
             days.forEach(day => (day.day() === 2 || day.day() === 4) && schooldays.push({[moment(day).valueOf()]: new Object()}));
        } else if (classInfo.class_schedule_id === 2) {
             days.forEach(day => (day.day() === 6 || day.day() === 7) && schooldays.push({[moment(day).valueOf()]: new Object()}));
        } else if (classInfo.class_schedule_id === 3) {
             days.forEach(day => day.day() === 5 && schooldays.push({[moment(day).valueOf()]: new Object()}));
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
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center pb-1 gap-2 leading-none " + ((moment(Number(Object.keys(day)[0])).format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {moment(Number(Object.keys(day)[0])).format('dddd')}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center gap-2 leading-none " + ((moment(Number(Object.keys(day)[0])).format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {moment(Number(Object.keys(day)[0])).format('DD/MM/YYYY')}
                            </Typography>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {studentList?.map(
                    (student, index) => {
                        const isLast = index === studentList.length - 1;
                        const classes = isLast
                            ? "py-2 px-4 odd:bg-blue-gray-50/50"
                            : "py-2 px-4 odd:bg-blue-gray-50/50 border-b border-blue-gray-50";
                        return (
                            <tr>
                                <td className={classes} style={{}}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {student.full_name}
                                    </Typography>
                                </td>
                                {calendar.map((info, key) => {
                                    const dayAttendance = Object.values(info)[0]
                                    const handleAttendance = (option) => {
                                        dayAttendance[student.id] = option
                                        setCalendar([...calendar]);
                                    } 
                                    return (
                                        <td className={classes + ' text-center'}>
                                            {dayAttendance[student.id] === 1 ? (
                                                <CheckBoxIcon onClick={() => handleAttendance(2)} />
                                            ) : dayAttendance[student.id] === 2 ? (
                                                <IndeterminateCheckBoxIcon onClick={() => handleAttendance(0)} />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon onClick={() => handleAttendance(1)} />
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    }
                )}
            </tbody>
        </table>
    )
}

const ScoreTable = ({ studentList, setStudentList, classInfo }) => {
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
                    <th className=" min-w-max z-10 sticky top-0 border-t border-r border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors" />
                    <th
                        colSpan={HEADER_SCORE.length}
                        className="z-10 max-w-min sticky top-0 border-y border-r border-blue-100 bg-orange-500 p-4 transition-colors hover:bg-blue-200"
                    >
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="text-center font-bold leading-none"
                        >
                            {'Giữa kỳ'}
                        </Typography>
                    </th>
                    <th
                        colSpan={HEADER_SCORE.length}
                        className="z-10 sticky top-0 border-y border-blue-100 bg-orange-500 p-4 transition-colors hover:bg-blue-200"
                    >
                        <Typography
                            variant="h6"
                            className="text-center font-bold leading-none"
                            color="blue-gray"
                        >
                            {"Cuối kỳ"}
                        </Typography>
                    </th>
                </tr>
                <tr>
                    <th className=" min-w-max z-10 sticky top-0 border-r border-b bg-blue-gray-50 border-blue-gray-100 transition-colors" />
                    {HEADER_SCORE.map((head, index) => (
                        <th
                            // onClick={() => handleSort(index)}
                            key={head}
                            className="z-10 sticky top-0 border-y border-r border-blue-100 bg-blue-50 p-4 transition-colors hover:bg-blue-200"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center gap-2 leading-none opacity-70" + ((HEADER_SCORE.length - 1) === index ? ' font-bold' : ' font-normal')}
                            >
                                {head}
                            </Typography>
                        </th>
                    ))}
                    {HEADER_SCORE.map((head, index) => (
                        <th
                            // onClick={() => handleSort(index)}
                            key={head}
                            className="z-10 sticky top-0 border-y border-r border-blue-100 bg-blue-50 p-4 transition-colors hover:bg-blue-200"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center gap-2 leading-none opacity-70" + ((HEADER_SCORE.length - 1) === index ? ' font-bold' : ' font-normal')}
                            >
                                {head}
                            </Typography>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {studentList?.map(
                    (student, studentIndex) => {
                        const isLast = studentIndex === studentList.length - 1;
                        const classes = isLast
                            ? "px-4 odd:bg-blue-gray-50 text-center hover:bg-blue-50"
                            : "px-4 odd:bg-blue-gray-50 text-center border-b border-blue-gray-50 hover:bg-blue-50";
                        return (
                            <tr>
                                <td className={classes + ' min-w-max py-2 bg-blue-50 sticky left-0 border-r z-20'}>{student.full_name}</td>
                                {SCORE_FIELD.map((field, index) => (
                                    <td
                                        // onClick={() => handleSort(index)}
                                        key={field}
                                        className={classes}
                                    >
                                        <Typography
                                            contentEditable={true}
                                            onInput={(e) => console.log('====', e.currentTarget.innerText)}
                                            className={"focus:outline-none" + ((HEADER_SCORE.length - 1) === index && ' font-bold')}
                                            color="blue-gray"
                                        >
                                            {/* {student.score_table[classInfo.id][field]} */}
                                        </Typography>
                                    </td>
                                ))}
                                {SCORE_FIELD.map((field, index) => (
                                    <td
                                        // onClick={() => handleSort(index)}
                                        key={field}
                                        className={classes}
                                    >
                                        <Typography
                                            contentEditable={true}
                                            // contentEditable={HEADER_SCORE.length - 1 !== index}
                                            onInput={(e) => console.log('====', e.currentTarget.innerText)}
                                            className={"focus:outline-none" + ((HEADER_SCORE.length - 1) === index && ' font-bold')}
                                            color="blue-gray"
                                        >
                                            {"--"}
                                        </Typography>
                                    </td>
                                ))}
                                {/* <th
                                        className="z-10 sticky top-0 cursor-pointer border-y border-blue-100 bg-blue-50 p-4 transition-colors hover:bg-blue-gray-200"
                                    /> */}
                            </tr>
                        )
                    }
                )}
            </tbody>
        </table>
    )
}