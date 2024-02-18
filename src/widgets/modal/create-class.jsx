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
import { PlusIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import useStorage from "../../utils/localStorageHook";
import { useFetch, useFirebase } from "../../utils/api/request";
import moment from "moment";
import ClassInfo from "../../data/entities/classes";
import formatDate from "../../utils/formatNumber/formatDate";

// const classType = [
//     'A1A1',
//     'A1A2',
//     'A2B1',
//     'A2B2',

// ]

const classType = {
    'LIFE': [
        'A1A1',
        'A1A2',
        'A2B1',
        'A2B2',
    ],
    'IELTS': [
        'SILVERA',
        'SILVERB',
    ],
    'TEENS': [
        'TEEN1',
        'TEEN2',
    ]
}

const classSchedule = [
    'Thứ 2 - 4',
    'Thứ 3 - 5',
    'Thứ 7 - CN',
    'Thứ 6',
]

export function CreateClasses({ open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [classList, setClassList] = useState([])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [staffList, setStaffList] = useState([])

    useEffect(() => {
        getStudentList()
        getStaffList()
        handleAdd()
        // const studentListRef = useStorage('get', 'studentInfo')
        // if (!studentListRef) getStudentList()
        // else {
        //     setStudentList(studentListRef)
        //     // tableRef.current = studentList
        // }
        // const staffListRef = useStorage('get', 'staffList')
        // if (!staffListRef) getStaffList()
        // else {
        //     setStaffList(staffListRef)
        //     // tableRef.current = studentList
        // }
    }, [])

    const getStudentList = () => {
        setLoading(true)
        useFirebase('get_student')
            .then(data => {
                setLoading(false)
                // tableRef.current = data
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
                // tableRef.current = data
                setStaffList(data)
                console.log('getStaffList', data);
                // useStorage('set', 'staffList', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const updateClassList = (index, key, value) => {
        classList[index].updateInfo(key, value)
        setClassList([...classList])
    }

    // useEffect(() => {
    //     setPaymentList([{
    //         student: '',
    //         tuition: '',
    //         class_name: '',
    //         id_class: '',
    //         id_class_type: '',
    //         note: '',
    //         date: moment(Date.now()).format('YYYY-MM-DD'),
    //         id_student: ''
    //     }])
    // }, [open])

    const getTuition = () => {
        console.log('getTuition');

    }

    const handleAdd = () => {
        try {
            const newClass = new ClassInfo({})
            console.log('handleAdd', newClass);
            const list = [...classList]
            list.push(newClass)
            setClassList(list)
        } catch (error) {
            console.log(error);
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
                className="bg-transparent shadow-none w-min-w"
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
                                            label="Select Program"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {Object.keys(classType).map(item => (
                                                <Option onClick={() => updateClassList(index, 'program', item)} key={item} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            disabled={!info.program}
                                            label="Class level"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {info.program && (classType[info.program].map(item => (
                                                <Option onClick={() => updateClassList(index, 'level', item)} key={index} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            )))}
                                        </Select>
                                        {console.log(staffList?.filter(staff => staff.department_id == 4))}
                                        <Select
                                            label="CS"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {(staffList || [])?.filter(staff => ([0, 4].includes(staff.department_id)))?.map(item => (
                                                <Option
                                                    onClick={() => {
                                                        updateClassList(index, 'cs_staff', item.full_name)
                                                        // updateClassList(index, 'cs_staff_phone', item.phone)
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
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {(staffList || [])?.filter(staff => staff.roles_id?.includes(3))?.map(item => (
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
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {(staffList || [])?.filter(staff => staff.roles_id?.includes(3))?.map(item => (
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
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {(staffList || [])?.filter(staff => staff.roles_id?.includes(4))?.map(item => (
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
                                            value={formatDate(info.start_date, 'YYYY-MM-DD')}
                                            onChange={(e) => updateClassList(index, 'start_date', formatDate(e.target.value))}
                                        />
                                        <Input
                                            type="date"
                                            variant="outlined"
                                            label="End Date"
                                            value={formatDate(info.end_date, 'YYYY-MM-DD')}
                                            onChange={(e) => updateClassList(index, 'end_date', formatDate(e.target.value))}
                                        />
                                        <Select
                                            label="Class Schedule"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {classSchedule.map(item => (
                                                <Option onClick={() => updateClassList(index, 'class_schedule', item)} key={index} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    {/* <Select
                                        label="Select Student"
                                        selected={(element) =>
                                            element &&
                                            React.cloneElement(element, {
                                                disabled: true,
                                                className:
                                                    "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                            })
                                        }
                                    >
                                        {(studentList || []).map(item => (
                                            <Option onClick={() => updateClassList({ key: 'student', value: item, index: index })} key={item.id_student} value={item.id + ' - ' + item.class_name} className="flex items-center gap-2">
                                                {item.id + ' - ' + item.full_name}
                                            </Option>
                                        ))}
                                    </Select> */}

                                </div>

                            </div>
                            // <MinusCircleIcon
                            //     style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                            //     className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                            //     onClick={() => setClassList(classList.filter((_, i) => i !== index))}
                            // />
                        ))}
                    </CardBody>
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
                                // disabled={classList?.findIndex(item => item.class_name === '') > -1}
                                loading={loading}
                                variant="gradient"
                                onClick={() => handleCallback(true, classList)}
                            >
                                Confirm
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}