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

export function CourseManagement({ loading, open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    // const [loading, setLoading] = useState(false)
    const [courseList, setCourseList] = useState([])
    const updateList = useRef({})
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [errorMsg, setErrorMsg] = useState('')
    const [isFocus, setIsFocus] = useState(false)
    

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
            setErrorMsg('')
        }
    }, [open])

    const getAllCourse = () => {
        useFirebase('get_all_course')
            .then(data => {
                console.log('getAllCourse', data);
                setCourseList(data)
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
    
    return (
        <Dialog
            size="md"
            open={open}
            handler={() => { 
                handleCallback(false)
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

                                    <div className="grid grid-col-1 min-w-[4rem] gap-y-3 menu-fixed">
                                        {courseInfo.map(info => (
                                            <Typography
                                                variant="small"
                                                className="text-[12px] font-bold text-blue-gray-400 flex-2"
                                            >
                                                {info.level_id}
                                            </Typography>
                                        ))}
                                    </div>

                                    <div className="grid grow grid-row gap-y-3">
                                        {courseInfo.map((info, indexInfo) => (
                                            <div className="grid grid-cols-2">
                                                <div className="flex items-center gap-2 justify-around">
                                                    <div className="flex items-center">
                                                        <Typography
                                                            contentEditable
                                                            onInput={(e) => updateCourseInfo({ courseIndex: index, level: courseLevel[indexInfo], key: 'hour', value: e.currentTarget.innerText })}
                                                            variant="small"
                                                            className="text-[12px] font-bold text-blue-gray-400"
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
                                                            className="text-[12px] font-bold text-blue-gray-400"
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
                                                    

                                                    {/* <div className="grow-0">
                                                    <MinusCircleIcon
                                                        // style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                                                        className="w-5 h-5 ml-3 text-blue-gray-200 cursor-pointer"
                                                    // onClick={() => setCourseList(courseList.filter((_, indexClass) => indexClass !== index))}
                                                    />
                                                </div> */}
                                                </div>
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
                <CardFooter className="pt-2 flex justify-end items-center">
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
    );
}