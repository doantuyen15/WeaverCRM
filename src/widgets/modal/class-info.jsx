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
import { loadExcelTemplate } from "../../utils/luckySheet";
import { Workbook } from "@fortune-sheet/react";
import lessonDairyTest from '../../data/sample/lesson_dairy'
import Deburr from "../../utils/formatNumber/deburr";
import { ModalStudent } from "./modal-student";

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

    const [selectedStudent, setSelectedStudent] = useState({})
    const [openModalEditStudent, setOpenModalEditStudent] = useState(false)

    useEffect(() => {
        getStudent()
    }, [classList])

    const getStudent = () => {
        setLoading(true)
        data.getStudentList()
            .then((res) => {
                console.log('getStudentList', );
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

    const handleEditStudent = (item) => {
        setSelectedStudent(item)
        setOpenModalEditStudent(true)
    }

    const handleRemoveStudent = (item) => {
        useFirebase('delete_student_from_class', { class_id: data.id, student_id: item.id })
            .then(() => {
                toast.success("Xoá học viên khỏi lớp thành công!")
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Xoá học viên khỏi lớp không thành công! Lỗi: ${err}`)
            })
            .finally(() => {
                setLoading(false)
                setOpenModalEditStudent(false)
                getClassList()
            })
    }

    const handleEditStudentCallback = (ok, studentInfo, isUpdate) => {
        console.log('handleEditStudentCallback', studentInfo);
        if (!ok) {
            setOpenModalEditStudent(false)
        } else {
            useFirebase('update_student', studentInfo)
                .then(() => {
                    toast.success("Sửa thông tin học viên thành công! Yêu cầu đang chờ duyệt")
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Sửa thông tin học viên không thành công! Lỗi: ${err}`)
                })
                .finally(() => {
                    setSelectedStudent({})
                    // setLoading(false)
                    setOpenModalEditStudent(false)
                })
        }
    }
    
    return (
        <div>
            <Dialog
                key={'class_info'}
                size={zoom ? 'xl' : 'lg'}
                open={open}
                handler={() => {
                    // handleCallback(false)
                    if (mode === 'normal' && !openDiary && !openModalEditStudent) handleOpen()
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
                        ) 
                        // : openAttendance ? (
                        //     <Attendance
                        //         open={openAttendance}
                        //         studentList={studentList}
                        //         classInfo={data}
                        //         calendar={(data.timetable || []).sort(({day:a}, {day:b}) => b-a)}
                        //         setCalendar={setCalendar}
                        //     />
                        // ) 
                        : openInputScore ? (
                            <ScoreTable setStudentList={setStudentList} studentList={studentList} data={data} classId={data.id} />
                        ) : (
                            <TableStudent setStudentList={setStudentList} studentList={studentList} handleEdit={handleEditStudent} handleRemove={handleRemoveStudent} />
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
                                    <Button
                                        variant="text"
                                        size="sm"
                                        onClick={() => {
                                            mode === 'score' ? () => { } : changeMode('score')
                                        }}
                                    >
                                        {mode !== 'score' ? 'Nhập điểm' : 'Xác nhận'}
                                    </Button>
                                    <Button size="sm" variant="gradient"
                                        onClick={() => { mode === 'addStudent' ? () => { } : changeMode('addStudent') }}
                                    >
                                        {mode !== 'addStudent' ? 'Thêm học sinh' : 'Xác nhận thêm học sinh'}
                                    </Button>
                                </>
                            )}

                            {/* <Button variant="gradient" size="sm"
                                loading={loading}
                                onClick={() => handleConfirm()}
                            >
                                {mode === 'attendance' ? 'Xác nhận điểm danh'
                                    : mode === 'score' ? 'Xác nhận nhập điểm'
                                        : mode === 'addStudent' ? 'Xác nhận thêm học sinh'
                                            : 'Điểm danh'
                                }
                            </Button> */}
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
            <AddStudentToClass loading={loading} classList={classList} open={openAddStudent} handleCallback={handleAddStudent}/>
            <LessonDiary loading={loading} open={openDiary} handleCallback={handleDiaryCallback} data={data}/>
            <ModalStudent studentData={selectedStudent} open={openModalEditStudent} handleCallback={handleEditStudentCallback} />
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
    const [staffList, setStaffList] = useState([])
    // const [dataSheet, setDataSheet] = useState(data.lesson_diary || [{ name: 'Sheet1', celldata: [{ r: 0, c: 0, v: null }] }])
    const [dataSheet, setDataSheet] = useState(lessonDairyTest)
    const dataUpdate = useRef(lessonDairyTest)

    useEffect(() => {
        if (!open) setEditMode(false)
        convertDataSheet()
    }, [open])
    
    const settings = {
        // data: lessonDairyTest, // sheet data
        // onOp: (dataSheet) => { 
        //     console.log('data', dataSheet);
        //     // data.updateDairy(dataSheet)
        // },
        onChange: (dataChange) => {
            // setDataSheet(lessonDairyTest)
            console.log('onChange', dataChange);
            dataUpdate.current = dataChange
        },
        lang: 'en' // set language
    }

    const convertDataSheet = () => {
        console.log('lessonDairyTest', lessonDairyTest);

        lessonDairyTest.forEach((sheet, sheetIndex) => {
            if (!dataUpdate.current[sheetIndex]?.celldata) {
                dataUpdate.current[sheetIndex].celldata = []
            }
            sheet.data?.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    dataUpdate.current[sheetIndex]?.celldata.push({
                        r: rowIndex,
                        c: columnIndex,
                        v: cell,
                    });
                });
            })
        });
        setDataSheet([...dataUpdate.current])
        return dataUpdate.current
    }

    // const loadDataSheet = () => {
    //     loadExcelTemplate().then((res) => {
    //         console.log('loadExcelTemplate', res);
    //         setDataSheet(res)
    //     })
    // }

    const getStaffList = () => {
        useFirebase('get_staff_list')
            .then(data => {
                console.log('get_staff_list', data);
                setStaffList(data?.filter(staff => [1, 3, 4, 7].includes(staff.roles_id)))
            })
            .catch(err => console.log(err))
    }
    
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
                    <Typography variant="h4" color="blue-gray" className="w-full pb-2 text-center">
                        Lesson Dairy
                    </Typography>
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
                <CardBody className="flex flex-col p-0 px-0 overflow-auto h-[85vh]">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ borderRadius: '.5rem' }}
                        src={`https://docs.google.com/spreadsheets/d/${classData.sheetId}/edit?widget=false&headers=false&rm=demo`}
                    />
                </CardBody>
                <CardFooter className="p-0 flex justify-end">
                    <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                        Close
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    )
}

const TableStudent = ({ studentList, setStudentList, handleEdit, handleRemove }) => {
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const tableRef = useRef(studentList)
    const [attendanceList, setAttendanceList] = useState([{}])

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, (item) => { return Deburr(item[Header[indexCol]]) }, [isAsc ? 'asc' : 'desc'])
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
                                handleEdit={handleEdit}
                                handleRemove={handleRemove}
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