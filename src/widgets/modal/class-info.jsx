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
import StaffInfo from "../../data/entities/staffInfo";
import { orderBy } from 'lodash'
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
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

const semester = {
    LIFE: [
        'Kỳ I',
        'Kỳ II',
        'Kỳ III',
        'Cuối Kỳ'
    ],
    NORMAL: [
        'Giữa kỳ',
        'Cuối Kỳ'   
    ],
    VALUE: {
        LIFE: [
            'mid',
            'mid_ii',
            'mid_iii',
            'final'
        ],
        NORMAL: [
            'mid',
            'final'
        ],
    }
}

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

]

const currentMonth = moment().format('M')

export function ModalClassInfo({ open, data, handleOpen, classList }) {
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

    const handleDiaryCallback = (ok, studentList) => {
        if (!ok) {
            setOpenDiary(false)
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
                                handleCallback={handleAttendance}
                                studentList={studentList}
                                classInfo={data}
                                calendar={calendar}
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
            <LessonDiary open={openDiary} handleCallback={handleDiaryCallback} data={data}/>
            {/* <Attendance open={openAttendance} handleCallback={handleAttendance}/> */}
        </div>
    );
}

const LessonDiary = ({ open, handleCallback, data = {} }) => {
    const makeData = [
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `• identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        },
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `
            • identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        },
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `
            • identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        },
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `
            • identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        },
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `
            • identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        },
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `
            • identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        },
        {
            lesson_id: 0, day: '20102021', teacher: 'NgocV', unit: '5. CONSUMERISM', unit_lesson: 'Reading',
            content: `
            • identify topic sentences
            • identify main and supporting ideas 
            • match headings with paragraphs
            • use will and going to.
            `,
            homeword: 'Exam skills',
            performance: 'Good overall. Bảo (the new student) does have a lot of potentials',
            checked: false
        }
    ]
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const updateDiary = (index, key, value) => {
        data.updateDiary(index, key, value)
        console.log('index, key, value', index, key, value);
        // forceUpdate()
    }
    // console.log('lesson_diary', data.lesson_diary);

    const addRowDiary = () => {
        data.addDiary()
        forceUpdate()
    }

    function CustomHTMLElement(props) {
        return <div dangerouslySetInnerHTML={{ __html: props.customHtml }} />
    }

    return (
        <Dialog
            size={'xl'}
            // size={zoom ? 'xl' : 'lg'}
            open={open}
            handler={() => {
                handleCallback(false)
                // if (mode === 'normal' || !openDiary) handleOpen()
            }}
            className={"bg-transparent shadow-none"}
        >
            <Card className="mx-auto h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex flex-col text-center pb-6">
                        <Typography variant="h4" color="black">
                            LESSON DIARY
                        </Typography>
                        <Typography variant="h4" color="black">
                            {data.id || '---'}
                        </Typography>
                    </div>
                    <div className="flex flex-row gap-2 justify-center">
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
                            >
                                {data.textbooks}
                            </Typography>
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
                            >
                                {data.textbooks}
                            </Typography>
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
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {HEADER_DIARY.map((head, index) => (
                                    <th
                                        // onClick={() => handleSort(index)}
                                        key={index}
                                        style={{ border: '2px solid black' }}
                                        className="bg-orange-500 z-10 sticky top-0 cursor-pointer p-4 transition-colors"
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
                            {makeData?.map(
                                (diary, index) => {
                                    // const isLast = index === makeData.length - 1;
                                    const classes = 'py-2 px-4 border text-center'
                                    const style={ border: '2px solid black' }
                                    return (
                                        <tr>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.lesson_id}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.day}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="orange"
                                                    className="font-normal"
                                                >
                                                    {diary.teacher}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.unit}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.unit_lesson}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    contentEditable={true}
                                                    onBlur={() => forceUpdate()}
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal min-w-[15vw] whitespace-pre-wrap"
                                                    onInput={(e) => {
                                                        updateDiary(index, 'content', e.currentTarget.innerText)
                                                    }}
                                                // onInput={}
                                                >
                                                    {diary.content}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.homeword}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.performance}
                                                </Typography>
                                            </td>
                                            <td className={classes} style={style}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {diary.checked ? 'checked' : ''}
                                                </Typography>
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="pt-4 flex justify-between">
                    <Button variant="gradient" color="deep-orange" size="sm"
                        onClick={() => addRowDiary()}
                    >
                        Add row
                    </Button>
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
                                        const score = (student.score_table?.[classId] || {})[sem] || {};
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