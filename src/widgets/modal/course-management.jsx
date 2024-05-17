import React, {useEffect, useRef, useState} from "react";
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
import {useFetch, useFirebase} from "../../utils/api/request";
import moment from "moment";
import sortObjByKey from "../../utils/sortObject/sortObjByKey";
import sortObjByValue from "../../utils/sortObject/sortObjByValue";
import { CreatePrograms } from "./create-programs";
import { toast } from "react-toastify";
import { NotificationDialog } from "./alert-popup";

export function CourseManagement({ loading, open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [courseList, setCourseList] = useState([])
    const updateList = useRef({})
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [alertMsg, setAlertMsg] = useState('')
    const [isFocus, setIsFocus] = useState(false)
    const [openCreateCourse, setOpenCreateCourse] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const deleteProgramRef = useRef({})
    const courseRef = useRef([])

    // useEffect(() => {
    //     if (!tuition?.length) getTuition()
    // }, [])

    useEffect(() => {
        // if (courseList.length === 0) {
        //     getAllCourse()
        // }
        if (open === true) {
            getAllCourse()
        } else {
            // setCourseList([{
            //     id: '',
            //     student: [{}]
            // }])
            updateList.current = {}
            setCourseList([])
            setAlertMsg('')
        }
    }, [open])

    const getAllCourse = () => {
        useFirebase('get_all_course')
            .then(data => {
                console.log('getAllCourse', data);
                setCourseList(data)
                courseRef.current = data
                useStorage('set', 'programs', data)
            })
            .catch(err => console.log(err))
            // .finally(() => setLoading(false))
    }

    const handleAdd = () => {
        const list = [...courseList]
        list.push({
            id: '',
            student: [{}]
        })
        setCourseList(list)
    }

    const handleAddStudent = (index) => {
        const list = [...courseList]
        list[index]['student'].push({})
        setCourseList(list)
    }

    const updateCourseInfo = ({ level, key, value, courseIndex, mod }) => {
        const update = [...courseList]
        if (mod == 'delete') {
            delete update[courseIndex][level]
            console.log('update', update);
            setCourseList(update)
            updateList.current = update
            forceUpdate()
            return
        }
        // if (mod === 'delete') {
        //     update[courseIndex] = update[courseIndex]?.filter((levelID) => levelID != level)
        // } 
        // else if (mod === 'editLevel') {
        //     delete update[courseIndex][key]
        // } 
        update[courseIndex][level][key] = value
        updateList.current[courseIndex] = update[courseIndex][level]
        // setCourseList(update)
    }

    const handleCallBackAddPrograms = (ok, programs) => {
        console.log('programs', ok, programs);
        if (!ok) {
            setOpenCreateCourse(false)
        } else {
            useFirebase('add_new_program', programs)
                .then(() => toast.success('Thêm khoá mới thành công'))
                .catch(err => toast.error('Thêm khoá mới thất bại! Vui lòng chụp lại lỗi và báo IT, lỗi: ' + err))
        }
    }

    const handleDeleteProgram = (ok) => {
        setOpenAlert(false)
        console.log('deleteProgramRef.current', deleteProgramRef.current);
        if (ok) {
            useFirebase('delete_program', deleteProgramRef.current )
                .then(() => toast.success('Thêm khoá mới thành công'))
                .catch(err => toast.error('Thêm khoá mới thất bại! Vui lòng chụp lại lỗi và báo IT, lỗi: ' + err))
        } else {
            deleteProgramRef.current = {}
        }
    }

    const handleConfirmDelete = (course) => {
        console.log('handleConfirmDelete', course);
        deleteProgramRef.current = course
        setAlertMsg(`Xác nhận xoá program ${course.program} / ${course.level}?`)
        setOpenAlert(true)
    }
    
    return (
        <>
            <Dialog
                size="sm"
                open={open}
                handler={() => {
                    !openCreateCourse && handleCallback(false)
                }}
                className="bg-transparent shadow-none w-max-w z-40"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col max-h-[50vh] overflow-y-auto">
                        <div className="w-full flex flex-col gap-y-6 justify-center">
                            {courseList.map((courses, index) => {
                                const course = sortObjByValue(sortObjByKey(courses), 'tuition') 
                                const courseLevel = Object.keys(course)
                                const courseInfo = Object.values(course)
                                const id = courseInfo[0].course_id
                                return (
                                    <div className="flex gap-4 items-center border-b border-blue-gray-50 pb-3 px-1">
                                        <div className="menu-fixed min-w-[6rem]">
                                            <Typography
                                                variant="small"
                                                className="text-[14px] font-bold text-blue-gray-400"
                                            >
                                                {id}
                                            </Typography>
                                        </div>

                                        <div className="grid grid-cols-1 min-w-[8rem] gap-y-3 menu-fixed grow">
                                            {courseInfo.map(info => (
                                                <Typography
                                                    variant="small"
                                                    className="text-[12px] font-bold text-blue-gray-400"
                                                >
                                                    {info.level_id}
                                                </Typography>
                                            ))}
                                        </div>

                                        <div className="grid grow grid-row gap-y-3">
                                            {courseInfo.map((info, indexInfo) => (
                                                <div className="flex">
                                                    <div className="flex items-center gap-2 justify-end flex-1">
                                                        <div className="flex items-center">
                                                            <Typography
                                                                contentEditable
                                                                onInput={(e) => updateCourseInfo({ courseIndex: index, level: courseLevel[indexInfo], key: 'hour', value: e.currentTarget.innerText })}
                                                                variant="small"
                                                                className="text-[12px] min-w-[2rem] text-right font-bold text-blue-gray-400"
                                                            >
                                                                {info.hour}
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                className="text-[12px] font-bold text-blue-gray-400 pl-1"
                                                            >
                                                                {'Giờ'}
                                                            </Typography>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <Typography
                                                                contentEditable
                                                                onInput={(e) => updateCourseInfo({ courseIndex: index, level: courseLevel[indexInfo], key: 'week', value: e.currentTarget.innerText })}
                                                                variant="small"
                                                                className="text-[12px] min-w-[2rem] text-right font-bold text-blue-gray-400"
                                                            >
                                                                {info.week}
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                className="text-[12px] font-bold text-blue-gray-400 pl-1"
                                                            >
                                                                {'Tuần'}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-[8rem] flex-2">
                                                        <Typography
                                                            variant="small"
                                                            contentEditable
                                                            onFocus={() => setIsFocus(true)}
                                                            onBlur={() => setIsFocus(false)}
                                                            onInput={(e) => updateCourseInfo({ courseIndex: index, level: courseLevel[indexInfo], key: 'tuition', value: e.currentTarget.innerText?.replace(/[^\d.-]+/g, '') })}
                                                            className="text-[12px] text-right font-bold text-blue-gray-400"
                                                        >
                                                            {!isFocus ? formatNum(info.tuition, 0, 'price') : formatNum(info.tuition, 0)}
                                                        </Typography>
                                                    </div>
                                                    <div className="self-center mr-2">
                                                        <MinusCircleIcon
                                                            className="w-4 h-4 ml-3 text-blue-gray-200 cursor-pointer"
                                                            onClick={() => {
                                                                // updateCourseInfo({ mod: 'delete', courseIndex: index, level: courseLevel[indexInfo] }
                                                                handleConfirmDelete({ program: id, level: courseLevel[indexInfo] })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* <div className="grow-0">
                                            <Button
                                                className="flex items-center"
                                                variant="text" color="blue-gray"
                                                onClick={() => handleAddStudent(index)}
                                                size="sm"
                                            >
                                                <PlusIcon className="w-3.5 h-3.5 mr-1" />
                                                More level
                                            </Button>
                                        </div> */}
                                    </div>
                                )
                            })}
                        </div>
                    </CardBody>
                    <CardFooter className="pt-2 flex justify-between items-center">
                        {/* <Button
                            className="flex align-center"
                            variant="text" color="blue-gray"
                            onClick={handleAdd}
                        >
                            <PlusIcon className="w-3.5 h-3.5 mr-2" />
                            New Program
                        </Button> */}
                        {/* <div className="grow-0 pt-0">
                            {errorMsg ? (
                                <Typography variant="small" color="red">
                                    {errorMsg}
                                </Typography>
                            ) : null}
                        </div> */}
                        <div>
                            <Button className="min-w-max flex" variant="gradient" color="deep-orange" onClick={() => setOpenCreateCourse(true)}>
                                <PlusIcon className="w-3.5 h-3.5 mr-2" />
                                New programs
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gaps-2 min-w-max">
                            <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                Close
                            </Button>
                            <Button
                                // disabled={Object.keys(updateList.current).length === 0}
                                loading={loading}
                                variant="gradient"
                                onClick={() => handleCallback(true, updateList.current)}
                            >
                                Confirm
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
            <CreatePrograms loading={loading} open={openCreateCourse} handleCallback={handleCallBackAddPrograms}/>
            <NotificationDialog open={openAlert} handleCallback={handleDeleteProgram} message={alertMsg} />
        </>
    );
}