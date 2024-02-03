import React, {useEffect, useState} from "react";
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

const priceBoard = [
    {
        price: '5000000',
        classNm: 'TEENS1'
    },
    {
        price: '5300000',
        classNm: 'TEENS2'
    },
    {
        price: '5300000',
        classNm: 'TEENS3'
    },
    {
        price: '5600000',
        classNm: 'TEENS4'
    },
    {
        price: '5600000',
        classNm: 'TEENS5'
    },
    {
        price: '5900000',
        classNm: 'TEENS6'
    },
    {
        price: '5900000',
        classNm: 'TEENS7'
    }
]

export function PaymentPopup({ open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [first, setfirst] = useState([])
    const [selectedClass, setSelectedClass] = useState({})
    const [loading, setLoading] = useState(false)
    const [paymentList, setPaymentList] = useState([{
        price: '',
        classNm: ''
    }])

    useEffect(() => {
        const requestInfo = {
            headers: {
                "authorization": `Bearer ${userInfo.token}`,
            },
            method: 'get',
            service: 'students',
            callback: (data) => {
                setLoading(false)
                // setTable(data)
                // tableRef.current = data
            },
            handleError: (error) => {
                console.log('error', error)
                setLoading(false)
            }
        }
        // useFetch(requestInfo)
    }, [])

    useEffect(() => {
        setPaymentList([{
            price: '',
            classNm: ''
        }])
    }, [open])
    

    const handleAdd = () => {
        const list = [...paymentList]
        list.push({
            price: '',
            classNm: ''
        })
        setPaymentList(list)
    }

    const updateListPayment = (item, index, mode = 'add') => {
        if (mode === 'delete') {
            setPaymentList(prev => prev.filter((item, i) => i !== index))
        }
        else {
            const list = [...paymentList]
            list[index] = item
            setPaymentList(list)
        }
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
                                            {priceBoard.map(item => (
                                                <Option onClick={() => updateListPayment(item, index)} key={item.classNm} value={item.classNm} className="flex items-center gap-2">
                                                    {item.classNm}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Input
                                            variant="outlined"
                                            label="Tuition Fee"
                                            contentEditable={false}
                                            value={formatNum(info.price, 0, 'price')}
                                            placeholder="Outlined"
                                        />
                                    </div>

                                    <MinusCircleIcon className="w-7 h-7 ml-3 text-blue-gray-200" onClick={() => updateListPayment(info, index, 'delete')}/>
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
                            <Button variant="gradient" onClick={() => handleCallback(true)}>
                                Confirm
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}