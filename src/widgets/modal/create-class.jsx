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
} from "@material-tailwind/react";
import { useController } from "../../context";
import formatNum from "../../utils/formatNumber/formatNum";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import useStorage from "../../utils/localStorageHook";
import { useFetch, useFirebase } from "../../utils/api/request";
import moment from "moment";
import ClassInfo from "../../data/entities/classesInfo";
import formatDate from "../../utils/formatNumber/formatDate";
import { glb_sv } from "../../service";
import { toast } from "react-toastify";

// const classType = [
//     'A1A1',
//     'A1A2',
//     'A2B1',
//     'A2B2',

// ]

const classType = {
    'LIFE': [
        'A1A2',
        'A2B1'
    ],
    'IELTS': [
        'SILVERA',
        'SILVERB',
        'GOLDA',
        'GOLDB',
        'DIAMONDA',
        'DIAMONDB',
        'MASTERA',
        'MASTERB',
    ],
    'TEENS': [
        '1A',
        '1B',
        '2A',
        '2B',
        '3A',
        '3B',
    ]
}

const classSchedule = glb_sv.classSchedule

export function CreateClasses({ classInfo = {}, setClassInfo, handleUpdateClass, open, handleCallback, isShow = true }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [classList, setClassList] = useState([])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [staffList, setStaffList] = useState([])
    const [courseList, setCourseList] = useState([])
    const tableRef = useRef([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    
    useEffect(() => {
        if (open) {
            getStudentList()
            getStaffList()
            getAllCourse()
            handleAdd()
            // getAllCourse()
        } else {
            setClassList([])
        }
    }, [open])

    const getAllCourse = () => {
        useFirebase('get_all_course', {getId: true})
            .then(data => {
                const object = {}
                data.forEach(item => {
                    object[item.id] = item.data()
                })
                console.log('get_all_course', object);
                setCourseList(object)
                // useStorage('set', 'programs', data)
            })
            .catch(err => console.log(err))
            // .finally(() => setLoading(false))
    }

    const getStudentList = () => {
        setLoading(true)
        useFirebase('get_student')
            .then(data => {
                setLoading(false)
                tableRef.current = data
                setStudentList(data)
                useStorage('set', 'studentInfo', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const getStaffList = () => {
        setLoading(true)
        useFirebase('get_staff_list')
            .then(data => {
                setLoading(false)
                setStaffList(data)
                console.log('getStaffList', data);
                // useStorage('set', 'staffList', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const generateCalendar = (classInfo) => {
        const startDate = moment(classInfo.start_date);
        const endDate = moment(classInfo.end_date);
        // Lấy mảng các ngày trong tháng
        const days = [];
        for (let i = 0; i <= endDate.diff(startDate, 'days'); i++) {
            days.push(startDate.clone().add(i, 'days'));
        }
        const timetable = []
        days.forEach(day => {
            if (glb_sv.offday.includes(moment(day).format('DD/MM'))) {
                // nghỉ
            } else if (
                (classInfo.class_schedule_id === 0 && (day.day() === 1 || day.day() === 3)) || // thú 2 4
                (classInfo.class_schedule_id === 1 && (day.day() === 2 || day.day() === 4)) || // thú 3 5
                (classInfo.class_schedule_id === 2 && (day.day() === 6 || day.day() === 7)) || // thú 7 cn
                (classInfo.class_schedule_id === 3 && (day.day() === 5)) // thú 6
            ) {
                timetable.push({
                    session: timetable.length + 1,
                    status: 0, //0 active, 1 nghỉ, 2 lý do khác
                    reason: '',
                    day: formatDate(day),
                    lesson_diary: {
                        lesson_id: timetable.length + 1,
                        day: formatDate(day),
                        teacher: '',
                        unit: '',
                        unit_lesson: '',
                        content: '',
                        homework: '',
                        performance: '',
                        checked: false,
                    },
                    attendance: {}
                })
                //         days.forEach(day => () && timetable.push({[moment(day).valueOf()]: new Object()}));
                //    } else if (classInfo.class_schedule_id === 1) {
                //         days.forEach(day => (day.day() === 2 || day.day() === 4) && timetable.push({[moment(day).valueOf()]: new Object()}));
                //    } else if (classInfo.class_schedule_id === 2) {
                //         days.forEach(day => (day.day() === 6 || day.day() === 7) && timetable.push({[moment(day).valueOf()]: new Object()}));
                //    } else if (classInfo.class_schedule_id === 3) {
                //         days.forEach(day => day.day() === 5 && timetable.push({[moment(day).valueOf()]: new Object()}));
            }
        })

        return(timetable)
    }

    const updateClassList = (index, key, value) => {
        classList[index].updateInfo(key, value)
        if ((key === 'end_date' || key === 'start_date' || key === 'class_schedule_id') && !!classList[index].start_date && !!classList[index].end_date) {
            if (moment(classList[index].start_date).isValid() || moment(classList[index].end_date).isValid()) {
                const timetable = generateCalendar(classList[index])
                classList[index].updateInfo('timetable', timetable)
            } else {
                toast.error('Ngày không hợp lệ!')
            }
        }
        forceUpdate()
        // setClassList(classList)
    }
    const handleAdd = () => {
        try {
            if (!classInfo.id) {
                const newClass = new ClassInfo({})
                const list = [...classList]
                list.push(newClass)
                setClassList(list)
            } else {
                const list = [...classList]
                list.push(classInfo)
                setClassList(list)
                setIsUpdate(true)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = (searchValue) => {
        try {
            var search = tableRef.current?.filter(item => 
                item.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.id?.includes(searchValue)
            );
            setStudentList(search)
        } catch (error) {
            console.log('error', error);
        }
    }
    // const updateClassList = ({ key, index, value, mode = 'add' }) => {
    //     if (mode === 'delete') {
    //         setClassList(classList.filter((item, i) => i !== index))
    //     }
    //     else {
    //         const objectEdit = [...classList]
    //         if (key === 'tuition') {
    //             objectEdit[index].tuition = value.tuition
    //             objectEdit[index].id_class = value.id_class
    //             objectEdit[index].id_class_type = value.id_class_type
    //             objectEdit[index].class_name = value.class_name
    //             setClassList(objectEdit)
    //         } else {
    //             objectEdit[index].student = value.full_name
    //             objectEdit[index].id_student = value.id
    //             setClassList(objectEdit)
    //         }
    //     }
    //     paymentListRef.current = [...classList]
    // }

    return (
        <>
            <Dialog
                size="lg"
                open={open}
                handler={() => {
                    handleCallback(false)
                    setSelectedClass({})
                }}
                className={isShow ? "" : "pointer-events-none" + " bg-transparent shadow-none w-min-w"}
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col">
                        {classList?.map((info, index) => (
                            <div className="flex py-4 border-b border-blue-gray-50 items-center">
                                <div className="flex w-full grid grid-cols-3 gap-6">
                                    <div className="grid gap-x-1 gap-y-3">
                                        <Typography variant="h6" color="black">
                                            Thông tin lớp
                                        </Typography>
                                        <Select
                                            // disabled={!info.id_student}
                                            label="Select program"
                                            error={!info.program}
                                            value={info.program}
                                            // selected={(element) =>
                                            //     element &&
                                            //     React.cloneElement(element, {
                                            //         disabled: true,
                                            //         className:
                                            //             "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                            //     })
                                            // }
                                        >
                                            {Object.keys(courseList).map(item => (
                                                <Option onClick={() => {
                                                    updateClassList(index, 'program', item)
                                                    updateClassList(index, 'level', '')
                                                }} key={item} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                        {(info.program && courseList[info.program] ) ? 
                                        <Select
                                            // disabled={!info.program}
                                            label="Class level"
                                            value={info.level}
                                            selected={(element) =>
                                                <Typography variant="small" className="flex truncate items-center opacity-100 px-0 gap-2 pointer-events-none">
                                                    {info.level}
                                                </Typography>
                                            }
                                        >
                                            {Object.values(courseList[info.program])?.map(item => (
                                                <Option onClick={() => {
                                                    updateClassList(index, 'level', item.level_id?.replace(' ', ''))
                                                    if (info.start_date != '')
                                                        updateClassList(index, 'end_date',
                                                            moment(info.start_date)
                                                                .add(courseList?.[info.program]?.[info.level]?.week, 'week').valueOf()
                                                        )
                                                }} key={item.level_id} value={item.level_id} className="flex items-center gap-2">
                                                    {item.level_id}
                                                </Option>
                                            ))}
                                        </Select> : null}
                                        {info.program === 'EXTRA' && <Select
                                            key="Select Student"
                                            label="Select Student"
                                            selected={() => info.student_id &&
                                                <Typography variant="small" className="flex truncate items-center opacity-100 px-0 gap-2 pointer-events-none">
                                                    {info.student_id + ' - ' + info.student}
                                                </Typography>
                                            }
                                        >
                                            <div>
                                                <Input
                                                    autoFocus
                                                    label="Search"
                                                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                />
                                            </div>
                                            {(studentList || []).map(item => (
                                                <Option onClick={() => {
                                                    updateClassList(index, 'student', item.full_name)
                                                    updateClassList(index, 'student_id', item.id)
                                                }} key={item.id} value={item.full_name} className="flex items-center gap-2">
                                                    {item.id + ' - ' + item.full_name}
                                                </Option>
                                            ))}
                                        </Select>}
                                        <Select
                                            label="CS"
                                            value={info.cs_staff ? info.cs_staff : undefined}
                                        >
                                            {info.cs_staff &&
                                                <Option onClick={() => {
                                                    updateClassList(index, 'cs_staff', '')
                                                    updateClassList(index, 'cs_staff_id', '')
                                                }} key={'Clear'} value={'Clear'} className="flex items-center gap-2">
                                                    Clear
                                                </Option>
                                            }
                                            {(staffList || [])?.filter(staff => ([0, 4].includes(staff.department_id)))?.map(item => (
                                                <Option
                                                    onClick={() => {
                                                        updateClassList(index, 'cs_staff', item.full_name)
                                                        updateClassList(index, 'cs_staff_id', item.id)
                                                    }} key={item.id} value={item.full_name} className="flex items-center gap-2">
                                                    {item.full_name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="grid gap-x-1 gap-y-3">
                                        <Typography variant="h6" color="black">
                                            Thông tin giáo viên
                                        </Typography>
                                        <Select
                                            label="Teacher"
                                            value={info.teacher ? info.teacher : undefined}
                                        >
                                            {info.teacher &&
                                                <Option onClick={() => {
                                                    updateClassList(index, 'teacher', '')
                                                    updateClassList(index, 'teacher_id', '')
                                                    updateClassList(index, 'teacher_phone', '')
                                                }} key={'Clear'} value={'Clear'} className="flex items-center gap-2">
                                                    Clear
                                                </Option>
                                            }
                                            {(staffList || [])?.filter(staff => [1, 3, 4, 7].includes(staff.roles_id))?.map(item => (
                                                <Option
                                                    onClick={() => {
                                                        updateClassList(index, 'teacher', item.full_name)
                                                        updateClassList(index, 'teacher_id', item.id)
                                                        updateClassList(index, 'teacher_phone', item.phone)
                                                    }} key={item.id} value={item.full_name} className="flex items-center gap-2">
                                                    {item.full_name}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Sub Teacher"
                                            value={info.sub_teacher ? info.sub_teacher : undefined}
                                        >
                                            {info.sub_teacher &&
                                                <Option onClick={() => {
                                                    updateClassList(index, 'sub_teacher', '')
                                                    updateClassList(index, 'sub_teacher_id', '')
                                                    updateClassList(index, 'sub_teacher_phone', '')
                                                }} key={'Clear'} value={'Clear'} className="flex items-center gap-2">
                                                    Clear
                                                </Option>
                                            }
                                            {(staffList || [])?.filter(staff => [1, 3, 4, 7].includes(staff.roles_id))?.map(item => (
                                                <Option
                                                    onClick={() => {
                                                        updateClassList(index, 'sub_teacher', item.full_name)
                                                        updateClassList(index, 'sub_teacher_phone', item.phone)
                                                        updateClassList(index, 'sub_teacher_id', item.id)
                                                    }} key={item.id} value={item.full_name} className="flex items-center gap-2">
                                                    {item.full_name}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            label="TA"
                                            value={info.ta_teacher ? info.ta_teacher : undefined}
                                        >
                                            {info.ta_teacher &&
                                                <Option onClick={() => {
                                                    updateClassList(index, 'ta_teacher', '')
                                                    updateClassList(index, 'ta_teacher_id', '')
                                                    updateClassList(index, 'ta_teacher_phone', '')
                                                }} key={'Clear'} value={'Clear'} className="flex items-center gap-2">
                                                    Clear
                                                </Option>
                                            }
                                            {(staffList || [])?.filter(staff => staff.roles_id === 5)?.map(item => (
                                                <Option
                                                    onClick={() => {
                                                        updateClassList(index, 'ta_teacher', item.full_name)
                                                        updateClassList(index, 'ta_teacher_phone', item.phone)
                                                        updateClassList(index, 'ta_teacher_id', item.id)
                                                    }} key={item.id} value={item.full_name} className="flex items-center gap-2">
                                                    {item.full_name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="grid gap-x-1 gap-y-3">
                                        <Typography variant="h6" color="black">
                                            Lịch học
                                        </Typography>
                                        <Input
                                            type="date"
                                            variant="outlined"
                                            label="Start Date"
                                            disabled={!info.program || !info.level}
                                            value={!info.start_date ? '' : formatDate(info.start_date, 'YYYY-MM-DD')}
                                            onChange={(e) => {
                                                updateClassList(index, 'start_date', formatDate(e.target.value, 'moment'))
                                                updateClassList(index, 'end_date',
                                                    moment(e.target.value, 'YYYY-MM-DD')
                                                        .add(courseList?.[info.program]?.[info.level]?.week, 'week').valueOf()
                                                )
                                            }}
                                        />
                                        <Input
                                            type="date"
                                            disabled={!info.start_date}
                                            min={formatDate(info.start_date, 'YYYY-MM-DD')}
                                            variant="outlined"
                                            label="End Date"
                                            value={!info.start_date ? '' : formatDate(info.end_date, 'YYYY-MM-DD')}
                                            onChange={(e) => updateClassList(index, 'end_date', formatDate(e.target.value, 'moment'))}
                                        />
                                        {info.program && info.program !== 'EXTRA' && (
                                            <Select
                                                label="Class Schedule"
                                                value={info.class_schedule}
                                                selected={(element) =>
                                                    element &&
                                                    React.cloneElement(element, {
                                                        disabled: true,
                                                        className:
                                                            "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                    })
                                                }
                                            >
                                                {classSchedule.map((item, i) => (
                                                    <Option onClick={() => {
                                                        console.log('item, index', item, i);
                                                        updateClassList(index, 'class_schedule', item)
                                                        updateClassList(index, 'class_schedule_id', i)
                                                    }} key={index} value={item} className="flex items-center gap-2">
                                                        {item}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    </div>
                                </div>
                            </div>
                            // <MinusCircleIcon
                            //     style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                            //     className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                            //     onClick={() => setClassList(classList.filter((_, i) => i !== index))}
                            // />
                        ))}
                    </CardBody>
                    {isShow ? (
                        <CardFooter className="pt-0 flex justify-end">
                            {/* <Button 
                            className="flex align-center" 
                            variant="text" color="blue-gray" 
                            onClick={handleAdd}
                        >
                            <PlusIcon className="w-3.5 h-3.5 mr-2"/>
                            Add more class
                        </Button> */}
                            <div className="pr-4">
                                <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                    Close
                                </Button>
                                <Button
                                    disabled={classList?.findIndex(item => !item.program || !item.level || !item.start_date || !item.end_date || !item.class_schedule) > -1}
                                    loading={loading}
                                    variant="gradient"
                                    onClick={() => isUpdate ? handleUpdateClass('update', classList[0]) : handleCallback(true, classList)}
                                >
                                    {isUpdate ? 'Update' : 'Confirm'}
                                </Button>
                            </div>
                        </CardFooter>
                    ) : null}
                    
                </Card>
            </Dialog>
        </>
    );
}