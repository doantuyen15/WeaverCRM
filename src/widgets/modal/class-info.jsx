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
    Textarea,
} from "@material-tailwind/react";
import { useController } from "../../context";
import useStorage from "../../utils/localStorageHook";
import { orderBy, deburr } from 'lodash'
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import DefaultSkeleton, { TableSkeleton } from "../skeleton";
import { StudentRow } from "../../pages/dashboard";
import { glb_sv } from "../../service";
import moment from "moment";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { useFirebase } from "../../utils/api/request";
import { toast } from "react-toastify";
import { AddStudentToClass } from "./add-student-class";
import formatDate from "../../utils/formatNumber/formatDate";

const HEADER_STUDENT = [
    // "Tình trạng đăng ký",
    "ID",
    "Họ",
    "Tên",
    "Ngày đăng ký",
    "Chương trình học/Lớp",
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

const semester = glb_sv.semester

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

const HEADER_DIARY = [
    'SESSION',
    'DATE',
    'TEACHER',
    'UNIT',
    'Unit lesson',
    'CONTENT',
    'HOMEWORK',
    'DAILY PERFOMANCE',
    `ADMIN'S RESPONSE`,
    `ADMIN'S NOTE`,
]

const currentMonth = moment().format('M')

export function ModalClassInfo({ open, data, handleOpen, classList, getClassList }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [loading, setLoading] = useState(false)
    const [newStaff, setNewStaff] = useState({})
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [openAttendance, setOpenAttendance] = useState(false)
    const [openAddStudent, setOpenAddStudent] = useState(false)
    const [openInputScore, setOpenInputScore] = useState(false)
    const [mode, setMode] = useState('normal')
    const [calendar, setCalendar] = useState([])
    const [zoom, setZoom] = useState(false)
    const [openDiary, setOpenDiary] = useState(false)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    
    useEffect(() => {
        getStudent()
    }, [classList])

    const getStudent = () => {
        setLoading(true)
        data.getStudentList()
            .then((res) => {
                setStudentList(res)
                setLoading(false)
                forceUpdate()
            })
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
        useFirebase('update_student_attendance', {
            id: data.id,
            month: currentMonth,
            data: calendar
        })
            .then(() => {
                toast.success(`Điểm danh lớp ${data.id} thành công!`)
            })
            .catch(() => {
                toast.error(`Điểm danh lớp ${data.id} thất bại!`)
            })
    }

    const handleAddStudent = (ok, studentList) => {
        if (!ok) {
            changeMode('normal')
        } else {
            setLoading(true)
            useFirebase('add_student_classes', studentList)
                .then(() => {
                    setLoading(false)
                    changeMode('normal')
                    toast.success("Add Success!")
                    getClassList()
                })
                .catch((error) => toast.error(error))
        }
    }

    const handleDiaryCallback = (ok, classData) => {
        if (!ok) {
            setOpenDiary(false)
        } else {
            setLoading(true)
            useFirebase('update_lessondiary', classData)
                .then(() => {
                    setLoading(false)
                    toast.success("Update Lesson diary successed!")
                    getClassList()
                })
                .catch((error) => toast.error(error))
        }
        // } else {
        //     setLoading(true)
        //     useFirebase('add_student_classes', studentList)
        //         .then(() => {
        //             setLoading(false)
        //             changeMode('normal')
        //             toast.success("Add Success!")
        //         })
        //         .catch((error) => toast.error(error))
        // }
    }

    const handleUpdateScore = () => {
        setLoading(true)
        useFirebase('update_student_score', studentList)
            .then(() => {
                setLoading(false)
                // changeMode('normal')
                toast.success("Success!")
            })
            .catch((error) => toast.error(error))
    }

    const handleConfirm = () => {
        mode === 'attendance' ? handleUpdateAttendance()
        : mode === 'score' ? handleUpdateScore()
        : mode === 'normal' && changeMode('attendance')
        // : mode === 'addStudent' ? handleAddStudent(ok, studentList)
    }

    return (
        <div>
            <Dialog
                size={zoom ? 'xl' : 'lg'}
                open={open}
                handler={() => {
                    // handleCallback(false)
                    if (mode === 'normal' && !openDiary) handleOpen()
                }}
                className={"bg-transparent shadow-none"}
            >
                <Card className="mx-auto h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none pb-6">
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
                                onClick={() => setZoom(!zoom)}
                            >
                                {zoom ?
                                    <ArrowsPointingInIcon className="h-5 w-5" /> :
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                }
                            </IconButton>
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
                                studentList={studentList}
                                classInfo={data}
                                calendar={(data.timetable || []).sort(({day:a}, {day:b}) => b-a)}
                                setCalendar={setCalendar}
                            />
                        ) : openInputScore ? (
                            <ScoreTable setStudentList={setStudentList} studentList={studentList} data={data} classId={data.id} />
                        ) : (
                            <TableStudent setStudentList={setStudentList} studentList={studentList} />
                        )}
                    </CardBody>
                    <CardFooter className="pt-4 flex justify-between">
                        <Button variant="gradient" color="deep-orange" size="sm"
                            onClick={() => setOpenDiary(prev => !prev)}
                        >
                            LESSON DIARY
                        </Button>
                        <div className="flex gap-2">
                            {mode !== 'normal' ? (
                                <Button variant="text" size="sm"
                                    onClick={() => changeMode('normal')}
                                >
                                    Trở lại
                                </Button>
                            ) : null}
                            {mode === 'normal' && (
                                <>
                                    <Button variant="text" size="sm"
                                        onClick={() => { mode === 'addStudent' ? handleUpdateAttendance() : changeMode('addStudent') }}
                                    >
                                        {mode !== 'addStudent' ? 'Thêm học sinh' : 'Xác nhận thêm học sinh'}
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="sm"
                                        onClick={() => {
                                            mode === 'score' ? () => { } : changeMode('score')
                                        }}
                                    >
                                        {mode !== 'score' ? 'Nhập điểm' : 'Xác nhận'}
                                    </Button>
                                </>
                            )}

                            <Button variant="gradient" size="sm"
                                loading={loading}
                                onClick={() => handleConfirm()}
                            >
                                {mode === 'attendance' ? 'Xác nhận điểm danh'
                                    : mode === 'score' ? 'Xác nhận nhập điểm'
                                        : mode === 'addStudent' ? 'Xác nhận thêm học sinh'
                                            : 'Điểm danh'
                                }
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
            <AddStudentToClass loading={loading} classList={classList} open={openAddStudent} handleCallback={handleAddStudent}/>
            <LessonDiary loading={loading} open={openDiary} handleCallback={handleDiaryCallback} data={data}/>
        </div>
    );
}

const LessonDiary = ({ loading, open, handleCallback, data }) => {
    const [controller] = useController();
    const { userInfo } = controller;
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [classData, setClassData] = useState(data)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
      if (!open) setEditMode(false)
    }, [open])
    
    const updateDiary = (index, key, value) => {
        classData.updateDiary(index, key, value)
        setClassData(classData)
        // forceUpdate()
    }

    const addRowDiary = () => {
        classData.addDiary()
        forceUpdate()
    }

    return (
        <Dialog
            size={'xl'}
            open={open}
            handler={() => {
                handleCallback(false)
                // if (mode === 'normal' || !openDiary) handleOpen()
            }}
            className={"bg-transparent shadow-none"}
        >
            <Card className="mx-auto h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex flex-col text-center pb-1">
                        <Typography variant="h4" color="black">
                            LESSON DIARY
                        </Typography>
                        {/* <Typography variant="h4" color="black">
                            {data.id || '---'}
                        </Typography> */}
                    </div>
                    <div className="flex flex-row gap-2 justify-center pb-4">
                        <div className="flex flex-row items-center gap-1">
                            <Typography
                                variant="small"
                                color="orange"
                            >
                                {'CLASS CODE'}{': '}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="min-w-[2rem]"
                                contentEditable={editMode}
                                onBlur={() => forceUpdate()}
                                onInput={(e) => {
                                    updateDiary('', 'class_code', e.currentTarget.innerText)
                                }}
                            >
                                {classData.class_code || classData.id}
                            </Typography>
                            {editMode ? <PencilSquareIcon className="w-3 h-3 ml-2 mb-1" /> : ''}
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <Typography
                                variant="small"
                                color="orange"
                            >
                                {'TEXTBOOKS'}{': '}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="min-w-[2rem]"
                                contentEditable={editMode}
                                onBlur={() => forceUpdate()}
                                onInput={(e) => {
                                    updateDiary('', 'textbooks', e.currentTarget.innerText)
                                }}
                            >
                                {classData.textbooks}
                            </Typography>
                            {editMode ? <PencilSquareIcon className="w-3 h-3 ml-2" /> : ''}
                        </div>
                    </div>
                    <div className="absolute right-0 top-0">
                        <IconButton
                            color="blue-gray"
                            size="sm"
                            variant="text"
                            onClick={() => handleCallback(false)}
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
                    <table className="w-full min-w-max border-separate border-spacing-0 text-left">
                        <thead className="">
                            <tr>
                                {HEADER_DIARY.map((head, index) => (
                                    <th
                                        // onClick={() => handleSort(index)}
                                        key={index}
                                        style={{ border: '2px solid black' }}
                                        className="w-0 bg-orange-500 p-1 transition-colors sticky top-0 z-10"
                                    >
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className={"text-center gap-2 leading-none font-bold"}
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classData.timetable?.map(
                                (data, index) => {
                                    const diary = data.lesson_diary
                                    // const isLast = index === makeData.length - 1;
                                    const classes = editMode ? 'p-1 border text-center max-w-[150px] whitespace-pre-wrap' : 'py-2 px-4 border text-center max-w-[150px] whitespace-pre-wrap'
                                    const style={ borderBottom: '2px solid black', borderLeft: '2px solid black', borderRight: '2px solid black', overflowWrap: 'break-word' }
                                    return (
                                        <tr>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold"
                                                    // onBlur={() => forceUpdate()}
                                                >
                                                    {diary.lesson_id }
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                {editMode ? (
                                                    <Input
                                                        type="date"
                                                        size="md"
                                                        variant="standard"
                                                        // label="Start Date"
                                                        value={formatDate(diary.day, 'YYYY-MM-DD')}
                                                        onChange={(e) => {
                                                            updateDiary(index, 'day', formatDate(e.target.value))
                                                            forceUpdate()
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal p-0"
                                                        onBlur={() => forceUpdate()}
                                                        onInput={(e) => {
                                                            updateDiary(index, 'day', e.currentTarget.innerText)
                                                        }}
                                                    >
                                                        {diary.day}
                                                    </Typography>
                                                )}
                                            </td>
                                            <td className={classes + ' w-[10rem]'} style={style}>
                                                {editMode ? (
                                                    <Select
                                                        variant="standard"
                                                        value={diary.teacher ? diary.teacher : undefined}
                                                    >
                                                        {classData.teacher ?
                                                            <Option
                                                                onClick={() => { 
                                                                    updateDiary(index, 'teacher', classData.teacher)
                                                                    updateDiary(index, 'teacher_id', classData.teacher_id)
                                                                    forceUpdate()
                                                                }} 
                                                                className="flex items-center gap-2">
                                                                {classData.teacher}
                                                            </Option>
                                                            : <></>}
                                                        {classData.sub_teacher ?
                                                            <Option
                                                                onClick={() => { 
                                                                    updateDiary(index, 'teacher', classData.sub_teacher) 
                                                                    updateDiary(index, 'teacher_id', classData.sub_teacher_id)
                                                                    forceUpdate()
                                                                }} className="flex items-center gap-2">
                                                                {classData.sub_teacher}
                                                            </Option>
                                                            : <></>}
                                                        {classData.ta_teacher ?
                                                            <Option
                                                                onClick={() => { 
                                                                    updateDiary(index, 'teacher', classData.ta_teacher) 
                                                                    updateDiary(index, 'teacher_id', classData.ta_teacher_id)
                                                                    forceUpdate()
                                                                }} className="flex items-center gap-2">
                                                                {classData.ta_teacher}
                                                            </Option>
                                                            : <></>}
                                                    </Select>
                                                ) : (
                                                    <Typography
                                                        variant="small"
                                                        color="orange"
                                                        className="font-bold"
                                                        contentEditable={editMode}
                                                        onBlur={() => forceUpdate()}
                                                        onInput={(e) => {
                                                            updateDiary(index, 'teacher', e.currentTarget.innerText)
                                                        }}
                                                    >
                                                        {diary.teacher}
                                                    </Typography>
                                                )}
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold"
                                                    onBlur={() => forceUpdate()}
                                                    contentEditable={editMode}
                                                    onInput={(e) => {
                                                        updateDiary(index, 'unit', e.currentTarget.innerText)
                                                    }}
                                                >
                                                    {diary.unit}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold"
                                                    contentEditable={editMode}
                                                    onBlur={() => forceUpdate()}
                                                    onInput={(e) => {
                                                        updateDiary(index, 'unit_lesson', e.currentTarget.innerText)
                                                    }}
                                                >
                                                    {diary.unit_lesson}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal text-left"
                                                    contentEditable={editMode}
                                                    onBlur={() => forceUpdate()}
                                                    onInput={(e) => {
                                                        updateDiary(index, 'content', e.currentTarget.innerText)
                                                    }}
                                                >
                                                    {diary.content}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                    contentEditable={editMode}
                                                    onBlur={() => forceUpdate()}
                                                    onInput={(e) => {
                                                        updateDiary(index, 'homework', e.currentTarget.innerText)
                                                    }}
                                                >
                                                    {diary.homework}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                    contentEditable={editMode}
                                                    onBlur={() => forceUpdate()}
                                                    onInput={(e) => {
                                                        updateDiary(index, 'performance', e.currentTarget.innerText)
                                                    }}
                                                >
                                                    {diary.performance}
                                                </Typography>
                                            </td>
                                            <td className={editMode ? 'cursor-pointer ' : ' ' + classes} style={style} onClick={() => {
                                                if (userInfo.roles === '1' && editMode) {
                                                    updateDiary(index, 'checked', !diary.checked)
                                                    forceUpdate()
                                                }
                                            }}>
                                                <Typography
                                                    variant="small"
                                                    color="blue"
                                                    className="font-normal text-center"
                                                    onBlur={() => forceUpdate()}
                                                >
                                                    {diary.checked ? 'Checked' : ''}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                    contentEditable={userInfo.roles === '1' && editMode}
                                                    onBlur={() => forceUpdate()}
                                                    onInput={(e) => {
                                                        updateDiary(index, 'admin_note', e.currentTarget.innerText)
                                                    }}
                                                >
                                                    {diary.admin_note}
                                                </Typography>
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="pt-4 flex justify-between items-center">
                    <Typography
                        variant="small"
                        color="red"
                        className="font-normal"
                    >
                        {data.lesson_diary_note}
                    </Typography>
                    {userInfo.roles === '1' && (
                        <div className="flex item-center justify-end gap-2">
                            {editMode ? (
                                <>
                                    <Button variant="text" size="sm"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="gradient" size="sm"
                                        onClick={() => addRowDiary()}
                                    >
                                        Add Row
                                    </Button>
                                    <Button variant="gradient" color="deep-orange" size="sm"
                                        loading={loading}
                                        onClick={() => handleCallback(true, classData)}
                                    >
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button variant="gradient" color="deep-orange" size="sm"
                                    onClick={() => setEditMode(prev => !prev)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                    )}
                    {/* <div className="flex gap-2">
                        {mode !== 'normal' ? (
                            <Button variant="text" size="sm"
                                onClick={() => changeMode('normal')}
                            >
                                Trở lại
                            </Button>
                        ) : null}
                        {mode === 'normal' && (
                            <>
                                <Button variant="text" size="sm"
                                    onClick={() => { mode === 'addStudent' ? handleUpdateAttendance() : changeMode('addStudent') }}
                                >
                                    {mode !== 'addStudent' ? 'Thêm học sinh' : 'Xác nhận thêm học sinh'}
                                </Button>
                                <Button
                                    variant="text"
                                    size="sm"
                                    onClick={() => {
                                        mode === 'score' ? () => { } : changeMode('score')
                                    }}
                                >
                                    {mode !== 'score' ? 'Nhập điểm' : 'Xác nhận'}
                                </Button>
                            </>
                        )}

                        <Button variant="gradient" size="sm"
                            loading={loading}
                            onClick={() => handleConfirm()}
                        >
                            {mode === 'attendance' ? 'Xác nhận điểm danh'
                                : mode === 'score' ? 'Xác nhận nhập điểm'
                                    : mode === 'addStudent' ? 'Xác nhận thêm học sinh'
                                        : 'Điểm danh'
                            }
                        </Button>
                    </div> */}
                </CardFooter>
            </Card>
        </Dialog>
    )
}

const TableStudent = ({ studentList, setStudentList }) => {
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const tableRef = useRef(studentList)
    const [attendanceList, setAttendanceList] = useState([{}])

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, (item) => { return deburr(item[Header[indexCol]]) }, [isAsc ? 'asc' : 'desc'])
        setStudentList(sorted)
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    return (
        <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                <tr>
                    {HEADER_STUDENT.map((head, index) => (
                        <th
                            key={head}
                            className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                        >
                            <Typography
                                onClick={() => (index === 0 || index === 2) && handleSort(index)}
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                {head}{" "}
                                {(index === 0 || index === 2) && (
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

const Attendance = ({open, studentList, classInfo, calendar, setCalendar}) => {
    return (
        <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                <tr>
                    <th className="bg-blue-gray-50/50 z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 p-4 transition-colors" />
                    {calendar.map((item, index) => (
                        <th
                            // onClick={() => handleSort(index)}
                            key={index}
                            className="odd:bg-blue-gray-50/50 z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 p-4 transition-colors"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center pb-1 gap-2 leading-none " + ((moment(item.day, 'DD/MM/YYYY').format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {moment(item.day, 'DD/MM/YYYY').format('dddd')}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center gap-2 leading-none " + ((moment(item.day, 'DD/MM/YYYY').format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {item.day}
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
                                    const dayAttendance = info.attendance || {}
                                    const handleAttendance = (option) => {
                                        dayAttendance[student.id] = option
                                        // forceUpdate()
                                        setCalendar([...calendar]);
                                        console.log(dayAttendance[student.id]);
                                    } 
                                    return (
                                        <td className={classes + ' text-center cursor-pointer'}>
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

const ScoreTable = ({ studentList, setStudentList, classId }) => {
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const tableRef = useRef(studentList)
    const [attendanceList, setAttendanceList] = useState([{}])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, [Header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setStudentList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const handleUpdateScore = (index, type, key, score) => {
        studentList[index].updateScore({classId, type, key, score})
        setStudentList(studentList)
        console.log('handleUpdateScore', studentList, type);
    }

    return (
        <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                <tr>
                    <th className=" min-w-max z-10 sticky top-0 border-t border-r border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors" />
                    {semester[classId.includes('LIFE') ? 'LIFE' : 'NORMAL'].map((sem) => (
                        <th
                            colSpan={5}
                            className="z-10 sticky top-0 border-y border-r border-blue-100 bg-orange-500 p-4 transition-colors hover:bg-blue-200"
                        >
                            <Typography
                                type="number"
                                variant="h6"
                                className="text-center font-bold leading-none"
                                color="blue-gray"
                            >
                                {sem}
                            </Typography>
                        </th>
                    ))}
                </tr>
                <tr>
                    <th className=" min-w-max z-10 sticky top-0 border-r border-b bg-blue-gray-50 border-blue-gray-100 transition-colors" />
                    {semester[classId.includes('LIFE') ? 'LIFE' : 'NORMAL'].map(() => (
                        HEADER_SCORE.map((head, index) => (
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
                        )))
                    )}
                </tr>
            </thead>
            <tbody>
                {studentList?.map(
                    (student, studentIndex) => {
                        const isLast = studentIndex === studentList.length - 1;
                        const classes = isLast
                            ? "px-4 text-center border-r border-b border-blue-gray-50 hover:bg-blue-gray-50"
                            : "px-4 text-center border-r border-b border-blue-gray-50 hover:bg-blue-gray-50";
                        return (
                            <tr>
                                <td className={classes + ' min-w-max py-2 bg-blue-50 sticky left-0 border-r z-20'}>{student.full_name}</td>
                                {semester.VALUE[classId.includes('LIFE') ? 'LIFE' : 'NORMAL'].map((sem, semIndex) => (
                                    SCORE_FIELD.map((field, index) => {
                                        const score = student.score_table.find(item => item.term === sem) || {}
                                        return (
                                            <td
                                                onBlur={() => forceUpdate()}
                                                key={field}
                                                className={classes}
                                            >
                                                <Typography
                                                    contentEditable={field !== 'total'}
                                                    onInput={(e) => handleUpdateScore(studentIndex, sem, field, e.currentTarget.innerText)}
                                                    className={"focus:outline-none" + ((HEADER_SCORE.length - 1) === index && ' font-bold')}
                                                    color="blue-gray"
                                                >
                                                    {score[field]}
                                                </Typography>
                                            </td>
                                        )
                                    })
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