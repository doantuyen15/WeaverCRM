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

export function AddStudentToClass({ loading, classList, open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    // const [loading, setLoading] = useState(false)
    const [updateList, setUpdateList] = useState([{
        id: '',
        student: []
    }])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [errorMsg, setErrorMsg] = useState('')

    // useEffect(() => {
    //     if (!tuition?.length) getTuition()
    // }, [])

    useEffect(() => {
        getStudentList()
        setUpdateList([{
            id: '',
            student: [{}]
        }])
        setErrorMsg('')
    }, [open])

    const getStudentList = () => {
        useFirebase('get_student')
            .then(data => {
                console.log('getStudentList', data);
                // tableRef.current = data
                setStudentList(data)
                useStorage('set', 'studentInfo', data)
            })
            .catch(err => console.log(err))
            // .finally(() => setLoading(false))
    }
    
    const getTuition = () => {
        console.log('getTuition');
        // const requestInfo = {
        //     headers: {
        //         "authorization": `${userInfo.token}`,
        //     },
        //     method: 'get',
        //     service: 'getAllClassRoom',
        //     callback: (data) => {
        //         console.log('getAllClassRoom', data);
        //         setLoading(false)
        //         setTuition(data)
        //         useStorage('set', 'tuition', data)
        //     },
        //     handleError: (error) => {
        //         console.log('error', error)
        //         setLoading(false)
        //     }
        // }
        // useFetch(requestInfo)
    }

    const handleAdd = () => {
        const list = [...updateList]
        list.push({
            id: '',
            student: [{}]
        })
        setUpdateList(list)
    }

    const handleAddStudent = (index) => {
        const list = [...updateList]
        list[index]['student'].push({})
        setUpdateList(list)
    }

    const validate = () => {
        console.log('classInfo', updateList);
        let updateClass = []
        let error = false
        try {
            updateList.forEach(classInfo => {
                if (classInfo.id === '') {
                    setErrorMsg('Thông tin lớp không được bỏ trống!')
                    error = true
                    return
                }
                if (classInfo?.length !== 0) {
                    const newClass = classInfo?.student?.filter(studentInfo => Object.keys(studentInfo)?.length !== 0) || []
                    if (newClass.length > 0) updateClass.push({id: classInfo.id, student: newClass})
                }
            })
            if (error) return
            if (updateClass.length === 0) {
                setErrorMsg('Danh sách học sinh thêm vào không được bỏ trống!')
                return
            }
            console.log('updateClass', updateClass);
        } catch (error) {
            console.log('updateClass', error);
        }
        handleCallback(true, updateClass)
    }

    const updateClassInfo = ({ key, index, value, studentIndex, isDelete }) => {
        const update = [...updateList]
        if (key === 'student') {
            if (isDelete) {
                update[index][key] = update[index][key]?.filter((_,deleteIndex) => deleteIndex != studentIndex)
            } else {
                update[index][key][studentIndex] = value
            }
        } else {
            update[index][key] = value
        }
        setUpdateList(update)
        forceUpdate()
    }
    
    return (
        <>
            <Dialog
                size="md"
                open={open}
                handler={() => { 
                    handleCallback(false)
                    setSelectedClass({})
                }}
                className="bg-transparent shadow-none w-max-w"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col max-h-[50vh] overflow-y-auto">
                        <div className="w-full flex flex-col gap-y-6 justify-center">
                            {updateList.map((classInfo, index) => (
                                <>
                                    <div className="flex gap-4 items-center border-b border-blue-gray-50 pb-3">
                                        <div className="grow menu-fixed">
                                            <Select
                                                // style={{ position: 'fixed'}}
                                                // disabled={!info.id}
                                                // className="absolute"
                                                // variant="outlined"
                                                label="Select Class"
                                                selected={(element) =>
                                                    element &&
                                                    React.cloneElement(element, {
                                                        disabled: true,
                                                        className:
                                                            "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                    })
                                                }
                                            >
                                                {classList?.map(item => (
                                                    <Option onClick={() => updateClassInfo({ key: 'id', value: item.id, index: index })} key={item.class_name} value={item.class_name} className="flex items-center gap-2">
                                                        {item.id}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="grid grow grid-col-1 gap-y-3 menu-fixed">
                                            {classInfo.student?.map((student, studentIndex) => (
                                                <Select
                                                    key={studentIndex}
                                                    value={student.id ? (student.id + ' - ' + student?.full_name) : undefined}
                                                    placeholder="Student"
                                                    label="Select Student"
                                                >
                                                    {studentIndex != 0 ? (
                                                        <Option onClick={() => updateClassInfo({ key: 'student', value: {}, index: index, studentIndex: studentIndex, isDelete: true })} key={studentIndex} value={'None'} className="flex items-center gap-2">
                                                            {'None'}
                                                        </Option>
                                                    ) : <></>}
                                                    {studentList?.map(item => (
                                                        <Option onClick={() => updateClassInfo({ key: 'student', value: item, index: index, studentIndex: studentIndex })} key={item.id_student} value={item.id} className="flex items-center gap-2">
                                                            {item.id + ' - ' + item.full_name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            ))}
                                        </div>
                                        <div className="grow-0">
                                            <Button
                                                className="flex items-center"
                                                variant="text" color="blue-gray"
                                                onClick={() => handleAddStudent(index)}
                                                size="sm"
                                            >
                                                <PlusIcon className="w-3.5 h-3.5 mr-1" />
                                                More student
                                            </Button>
                                        </div>
                                        <div className="grow-0">
                                            <MinusCircleIcon
                                                style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                                                className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                                                onClick={() => setUpdateList(updateList.filter((_, indexClass) => indexClass !== index))}
                                            />
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </CardBody>
                    <CardFooter className="pt-2 flex justify-between items-center">
                        <Button 
                            className="flex align-center" 
                            variant="text" color="blue-gray" 
                            onClick={handleAdd}
                        >
                            <PlusIcon className="w-3.5 h-3.5 mr-2"/>
                            More class
                        </Button>
                        <div className="grow-0 pt-0">
                            {errorMsg ? (
                                <Typography variant="small" color="red">
                                    {errorMsg}
                                </Typography>
                            ) : null}
                        </div>
                        <div className="grid grid-cols-2 gaps-2 min-w-max">
                            <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                Close
                            </Button>
                            <Button
                                // disabled={updateList.findIndex(item => item.class_name === '') > -1}
                                loading={loading} 
                                variant="gradient" 
                                onClick={() => validate()}
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