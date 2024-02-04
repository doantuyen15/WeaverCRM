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

export function PaymentPopup({ open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [first, setfirst] = useState([])
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [paymentList, setPaymentList] = useState([{
        tuition: '',
        class_name: ''
    }])
    const paymentListRef = useRef([])
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])


    useEffect(() => {
        if (!tuition?.length) getTuition()
    }, [])

    useEffect(() => {
        setPaymentList([{
            tuition: '',
            class_name: ''
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
            tuition: '',
            class_name: ''
        })
        setPaymentList(list)
    }

    const updateListPayment = (item, index, mode = 'add') => {
        let list = [...paymentList]
        if (mode === 'delete') {
            setPaymentList(list.filter((item, i) => i !== index))
        }
        else {
            const list = [...paymentList]
            list[index] = item
            setPaymentList(list)
        }
        paymentListRef.current = list
        console.log('paymentListRef.current', paymentListRef.current);
    }
    
    return (
        <>
            <Dialog
                size="sm"
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
                                                <Option onClick={() => updateListPayment(item, index)} key={item.class_name} value={item.class_name} className="flex items-center gap-2">
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
                                        style={{ visibility: index == 0 ? 'hidden' : 'visible'}}
                                        className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer" 
                                        onClick={() => updateListPayment(info, index, 'delete')}
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
                        <div>
                            <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                Close
                            </Button>
                            <Button
                                disabled={paymentList.findIndex(item => item.class_name === '') > -1}
                                loading={loading} 
                                variant="gradient" 
                                onClick={() => handleCallback(true, paymentList)}
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