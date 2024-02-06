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
import useFetch from "../../utils/api/request";
import moment from "moment";

// const tuition = [
//     {
//         price: '5000000',
//         classNm: 'TEENS1'
//     },
//     {
//         price: '5300000',
//         classNm: 'TEENS2'
//     },
//     {
//         price: '5300000',
//         classNm: 'TEENS3'
//     },
//     {
//         price: '5600000',
//         classNm: 'TEENS4'
//     },
//     {
//         price: '5600000',
//         classNm: 'TEENS5'
//     },
//     {
//         price: '5900000',
//         classNm: 'TEENS6'
//     },
//     {
//         price: '5900000',
//         classNm: 'TEENS7'
//     }
// ]

export function PaymentPopup({ studentList, open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [paymentList, setPaymentList] = useState([])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])


    useEffect(() => {
        if (!tuition?.length) getTuition()
    }, [])

    useEffect(() => {
        setPaymentList([{
            student: '',
            tuition: '',
            class_name: '',
            id_class: '',
            id_class_type: '',
            note: '',
            date: moment(Date.now()).format('YYYY-MM-DD'),
            id_student: ''
        }])
    }, [open])
    
    const getTuition = () => {
        console.log('getTuition');
        const requestInfo = {
            headers: {
                "authorization": `${userInfo.token}`,
            },
            method: 'get',
            service: 'getAllClassRoom',
            callback: (data) => {
                console.log('getAllClassRoom', data);
                setLoading(false)
                setTuition(data)
                useStorage('set', 'tuition', data)
            },
            handleError: (error) => {
                console.log('error', error)
                setLoading(false)
            }
        }
        useFetch(requestInfo)
    }

    const handleAdd = () => {
        const list = [...paymentList]
        list.push({
            student: '',
            tuition: '',
            class_name: '',
            id_class: '',
            id_class_type: '',
            note: '',
            date: moment(Date.now()).format('YYYY-MM-DD'),
            id_student: ''
        })
        setPaymentList(list)
    }

    const updateListPayment = ({ key, index, value, mode = 'add' }) => {
        if (mode === 'delete') {
            setPaymentList(paymentList.filter((item, i) => i !== index))
        }
        else {
            const objectEdit = [...paymentList]
            if (key === 'tuition') {
                objectEdit[index].tuition = value.tuition
                objectEdit[index].id_class = value.id_class
                objectEdit[index].id_class_type = value.id_class_type
                objectEdit[index].class_name = value.class_name
                setPaymentList(objectEdit)
            } else {
                objectEdit[index].student = value.full_name
                objectEdit[index].id_student = value.id_we
                setPaymentList(objectEdit)
            }
        }
        paymentListRef.current = [...paymentList]
        console.log('paymentListRef.current', paymentListRef.current);
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
                className="bg-transparent shadow-none w-min-w"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col">
                        {paymentList.map((info, index) => (
                            <div className="flex py-4 border-b border-blue-gray-50 items-center">
                                <div className="gap-6 flex w-full">
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
                                        {studentList?.map(item => (
                                            <Option onClick={() => updateListPayment({ key: 'student', value: item, index: index })} key={item.id_student} value={item.id_we + ' - ' + item.class_name} className="flex items-center gap-2">
                                                {item.id_we + ' - ' + item.full_name}
                                            </Option>
                                        ))}
                                    </Select>
                                    <Select
                                        disabled={!info.id_student}
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
                                        {tuition?.map(item => (
                                            <Option onClick={() => updateListPayment({ key: 'tuition', value: item, index: index })} key={item.class_name} value={item.class_name} className="flex items-center gap-2">
                                                {item.class_name}
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
                                    onClick={() => updateListPayment({index: index, mode: 'delete'})}
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
                            Add
                        </Button>
                        <div className="pr-4">
                            <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                Close
                            </Button>
                            <Button
                                disabled={paymentList.findIndex(item => item.class_name === '') > -1}
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