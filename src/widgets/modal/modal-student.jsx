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
    Menu,
    MenuHandler,
    Chip,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { useController } from "../../context";
import formatNum from "../../utils/formatNumber/formatNum";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import useStorage from "../../utils/localStorageHook";
import { useFetch, useFirebase } from "../../utils/api/request";
import moment from "moment";
import ClassInfo from "../../data/entities/classesInfo";
import formatDate from "../../utils/formatNumber/formatDate";
import { glb_sv } from "../../service";
import { toast } from "react-toastify";
import StudentInfo from "../../data/entities/studentInfo";
import FormatPhone from "../../utils/formatNumber/formatPhone";

// const classType = [
//     'A1A1',
//     'A1A2',
//     'A2B1',
//     'A2B2',

// ]

const ListStatus = glb_sv.ListStatus

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

export function ModalStudent({ studentData, open, handleCallback, justShow = false }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [classList, setClassList] = useState([])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [studentInfo, setStudentInfo] = useState({})
    const [courseList, setCourseList] = useState([])
    const [staffList, setStaffList] = useState([])
    const [testScore, setTestScore] = useState({})

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    
    useEffect(() => {
        if (open) {
            if (!studentData.id) {
                setStudentInfo(new StudentInfo({
                    status_res: 0,
                    advisor: userInfo.display_name,
                    advisor_id: userInfo.uid
                }))
            } else {
                setIsUpdate(true)
                setStudentInfo(new StudentInfo(studentData))
                setTestScore(studentData?.score_table?.find(item => item.class_id === 'test') || {})
            }
            // getStudentList()
            // getStaffList()
            // getAllCourse()
            // handleAdd()
            // getAllCourse()
        } else {
            setStudentInfo({})
        }
    }, [open])

    useEffect(() => {
        getStaffList()
    }, [])
    

    const getAllCourse = () => {
        useFirebase('get_all_course', {getId: true})
            .then(data => {
                const object = {}
                data.forEach(item => {
                    object[item.id] = item.data()
                })
                setCourseList(object)
                // useStorage('set', 'programs', data)
            })
            .catch(err => console.log(err))
            // .finally(() => setLoading(false))
    }

    const updateStudentInfo = (key, value, type = 'info') => {
        if (type === 'info') {
            studentInfo?.updateInfo(key, value)
        } else {
            studentInfo?.updateScore({key: key, score: value, classId: 'test', type: ''})
            setTestScore(studentInfo?.score_table?.find(item => item.class_id === 'test') || {})
        }
        forceUpdate()
        // setClassList(classList)
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

    return (
        <Dialog
            size="lg"
            open={open}
            handler={() => {
                handleCallback(false)
            }}
            className={`bg-transparent shadow-none w-min-w`}
        >
            <Card className="mx-auto w-full">
                <CardBody className={justShow ? 'pointer-events-none' : ''}>
                    <div className="flex flex-col py-4 border-b border-blue-gray-50 items-center">
                        <div className="flex w-full grid grid-cols-3 gap-6 pb-6">
                            <Typography className="col-span-2" variant="h6" color="black">
                                Thông tin học viên
                            </Typography>
                            <Typography variant="h6" color="black">
                                Thông tin nhân viên
                            </Typography>
                        </div>
                        <div className="flex w-full grid grid-cols-3 gap-6">
                            <div className="grid col-span-2 grid-flow-col grid-rows-4 gap-6">
                                <Menu placement="bottom-start w-full">
                                    <MenuHandler>
                                        <div className="flex w-full">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={
                                                    <div className="flex justify-center">
                                                        {ListStatus[Number(studentInfo.status_res)]?.status}
                                                        <ChevronDownIcon strokeWidth={2} className="w-2.5 h-2.5 ml-2" />
                                                    </div>
                                                }
                                                className="w-full p-3"
                                                color={ListStatus[Number(studentInfo.status_res)]?.color}
                                            />
                                        </div>
                                    </MenuHandler>
                                    <MenuList className="min-w-0 p-1 z-[999999]">
                                        {ListStatus.map(({ type, status, color }) => (
                                            <MenuItem className="p-1" onClick={() => {
                                                updateStudentInfo('status_res', type)
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
                                <Input
                                    type="date"
                                    variant="outlined"
                                    label="Ngày đăng ký"
                                    value={!studentInfo.register_date ? '' : formatDate(studentInfo.register_date, 'YYYY-MM-DD')}
                                    onChange={(e) => updateStudentInfo('register_date', formatDate(e.target.value, 'moment'))}
                                />
                                <Input
                                    type="text"
                                    variant="outlined"
                                    label="Họ và tên"
                                    placeholder="Họ và tên"
                                    value={studentInfo.full_name}
                                    onChange={(e) => {
                                        updateStudentInfo('full_name', e.target.value)
                                    }}
                                />
                                <Input
                                    type="date"
                                    variant="outlined"
                                    label="Ngày sinh"
                                    value={!studentInfo.dob ? '' : formatDate(studentInfo.dob, 'YYYY-MM-DD')}
                                    onChange={(e) => updateStudentInfo('register_date', formatDate(e.target.value, 'moment'))}
                                />
                                <Input
                                    type="tel"
                                    maxLength={12}
                                    variant="outlined"
                                    label="Số điện thoại"
                                    placeholder='0123.456.789'
                                    value={FormatPhone(studentInfo.phone)}
                                    onChange={(e) => {
                                        updateStudentInfo('phone', e.target.value?.replaceAll(/\./g, ''))
                                    }}
                                />
                                <Input
                                    type="tel"
                                    maxLength={12}
                                    variant="outlined"
                                    label="Số điện thoại phụ"
                                    placeholder='0123.456.789'
                                    value={FormatPhone(studentInfo.parent_phone)}
                                    onChange={(e) => {
                                        updateStudentInfo('parent_phone', e.target.value?.replaceAll(/\./g, ''))
                                    }}
                                />
                                <Input
                                    variant="outlined"
                                    label="Địa chỉ"
                                    placeholder='Địa chỉ'
                                    value={studentInfo.address}
                                    onChange={(e) => {
                                        updateStudentInfo('address', e.target.value)
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-6">
                                <Select
                                    label="Người phụ trách"
                                    value={studentInfo.advisor ? studentInfo.advisor : undefined}
                                >
                                    {staffList.map(item => (
                                        <Option
                                            onClick={() => {
                                                updateStudentInfo('advisor', item.full_name)
                                                updateStudentInfo('advisor_id', item.id)
                                            }} key={item.id} value={item.full_name} className="flex items-center gap-2">
                                            {item.full_name}
                                        </Option>
                                    ))}
                                </Select>
                                <Input
                                    variant="outlined"
                                    label="Người giới thiệu"
                                    placeholder='Người giới thiệu'
                                    value={studentInfo.referrer}
                                    onChange={(e) => {
                                        updateStudentInfo('referrer', e.target.value)
                                    }}
                                />
                                <Input
                                    variant="outlined"
                                    label="Note"
                                    placeholder='Note'
                                    value={studentInfo.note}
                                    onChange={(e) => {
                                        updateStudentInfo('note', e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col py-4 border-b border-blue-gray-50 items-center">
                        <div className="flex w-full pb-6">
                            <Typography variant="h6" color="black">
                                Test đầu vào
                            </Typography>
                        </div>
                        <div className="flex flex-col w-full gap-6">
                            <div className="grid grid-cols-6 gap-6 pb-6">
                                <Typography variant="small" className="flex h-full items-center text-blue-gray-500">
                                    Số câu đúng: {
                                        Number(testScore._writing || 0) + 
                                        Number(testScore._listening || 0) + 
                                        Number(testScore._speaking || 0) + 
                                        Number(testScore._reading || 0) + 
                                        Number(testScore._grammar || 0)
                                    }
                                </Typography>
                                <Input
                                    size="md"
                                    type="number"
                                    variant="static"
                                    label="Writing"
                                    value={testScore._writing}
                                    onChange={(e) => {
                                        updateStudentInfo('_writing', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Listening"
                                    value={testScore._listening}
                                    onChange={(e) => {
                                        updateStudentInfo('_listening', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Speaking"
                                    value={testScore._speaking}
                                    onChange={(e) => {
                                        updateStudentInfo('_speaking', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Reading"
                                    value={testScore._reading}
                                    onChange={(e) => {
                                        updateStudentInfo('_reading', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Grammar/Volcabulary"
                                    value={testScore._grammar}
                                    onChange={(e) => {
                                        updateStudentInfo('_grammar', e.target.value, 'score')
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-6 gap-6">
                                <Typography variant="small" className="flex h-full items-center text-blue-gray-500">
                                    Điểm: {testScore.total || 0}
                                </Typography>
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Writing"
                                    max={10}
                                    min={0}
                                    value={testScore.writing}
                                    onChange={(e) => {
                                        updateStudentInfo('writing', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Listening"
                                    max={10}
                                    min={0}
                                    value={testScore.listening}
                                    onChange={(e) => {
                                        updateStudentInfo('listening', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Speaking"
                                    max={10}
                                    min={0}
                                    value={testScore.speaking}
                                    onChange={(e) => {
                                        updateStudentInfo('speaking', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Reading"
                                    max={10}
                                    min={0}
                                    value={testScore.reading}
                                    onChange={(e) => {
                                        updateStudentInfo('reading', e.target.value, 'score')
                                    }}
                                />
                                <Input
                                    type="number"
                                    variant="static"
                                    label="Grammar/Volcabulary"
                                    max={10}
                                    min={0}
                                    value={testScore.grammar}
                                    onChange={(e) => {
                                        updateStudentInfo('grammar', e.target.value, 'score')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="pt-0 flex justify-end px-6">
                    <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                        Close
                    </Button>
                    {!justShow ? (
                        <Button
                            disabled={!studentInfo.full_name || !studentInfo.register_date}
                            loading={loading}
                            variant="gradient"
                            onClick={() => handleCallback(true, studentInfo, isUpdate)}
                        >
                            {isUpdate ? 'Update' : 'Confirm'}
                        </Button>
                    ) : null}
                </CardFooter>
                
            </Card>
        </Dialog>
    );
}