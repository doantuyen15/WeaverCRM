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
import ClassInfo from "../../data/entities/classes";

const classType = [
    'A1A1',
    'A1A2',
    'A2B1',
    'A2B2',
    'SILVERA',
    'SILVERB',
]

const program = [
    'LIFE',
    'IELT',
    'TEENS'
]

export function CreateClasses({  open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [classList, setClassList] = useState([])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])


    useEffect(() => {
        const studentListRef = useStorage('get', 'studentInfo')
        if (!studentListRef) getStudentList()
        else {
            setStudentList(studentListRef)
            // tableRef.current = studentList
        }
        handleAdd()
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

    const updateClassList = ({ key, index, value, mode = 'add' }) => {
        if (mode === 'delete') {
            setClassList(classList.filter((item, i) => i !== index))
        }
        else {
            const objectEdit = [...classList]
            if (key === 'tuition') {
                objectEdit[index].tuition = value.tuition
                objectEdit[index].id_class = value.id_class
                objectEdit[index].id_class_type = value.id_class_type
                objectEdit[index].class_name = value.class_name
                setClassList(objectEdit)
            } else {
                objectEdit[index].student = value.full_name
                objectEdit[index].id_student = value.id
                setClassList(objectEdit)
            }
        }
        paymentListRef.current = [...classList]
    }
    
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
                                <div className="gap-6 flex w-full">
                                    <Select
                                        // disabled={!info.id_student}
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
                                        {classType?.map(item => (
                                            <Option onClick={() => updateClassList({ key: 'classType', value: item, index: index })} key={item.class_name} value={item.class_name} className="flex items-center gap-2">
                                                {item}
                                            </Option>
                                        ))}
                                    </Select>
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
                                        {program?.map(item => (
                                            <Option onClick={() => updateClassList({ key: 'program', value: item, index: index })} key={item.class_name} value={item.class_name} className="flex items-center gap-2">
                                                {item}
                                            </Option>
                                        ))}
                                    </Select>
                                    <Select
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
                                    </Select>
                                    <Input
                                        readOnly
                                        variant="outlined"
                                        label="Tuition Fee"
                                        contentEditable={false}
                                        value={formatNum(info.tuition, 0, 'price')}
                                        placeholder="Outlined"
                                    />
                                </div>

                                <MinusCircleIcon
                                    style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                                    className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                                    onClick={() => updateClassList({index: index, mode: 'delete'})}
                                />
                            </div>
                        ))}
                    </CardBody>
                    <CardFooter className="pt-0 flex justify-between">
                        <Button 
                            className="flex align-center" 
                            variant="text" color="blue-gray" 
                            onClick={handleAdd}
                        >
                            <PlusIcon className="w-3.5 h-3.5 mr-2"/>
                            Add more class
                        </Button>
                        <div className="pr-4">
                            <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                Close
                            </Button>
                            <Button
                                // disabled={classList?.findIndex(item => item.class_name === '') > -1}
                                loading={loading} 
                                variant="gradient" 
                                onClick={() => handleCallback(true, paymentListRef.current)}
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