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
import {useFetch} from "../../utils/api/request";
import moment from "moment";
import { glb_sv } from "../../service";

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

export function PaymentPopup({ open, handleCallback, classList, loading }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [paymentList, setPaymentList] = useState([{
        student_name: '',
        program: '',
        tuition: '',
        id_class: '',
        note: '',
        date: moment(Date.now()).format('YYYY-MM-DD'),
        id_student: ''
    }])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        setPaymentList([{
            student_name: '',
            program: '',
            tuition: '',
            id_class: '',
            note: '',
            date: moment().format('DDMMYYYY'),
            id_student: ''
        }])
    }, [open])

    const handleAdd = () => {
        const list = [...paymentList]
        list.push({
            student_name: '',
            program: '',
            tuition: '',
            id_class: '',
            note: '',
            date: moment().format('DDMMYYYY'),
            id_student: ''
        })
        setPaymentList(list)
    }

    const updateListPayment = ({ key, index, value }) => {
        if (key === 'id_class') {
            paymentList[index][key] = value.id
            paymentList[index]['program'] = value.program
            if (value.program !== 'IELTS') paymentList[index]['tuition'] = glb_sv.getTuitionFee[value.program][0]['value']
        } else if (key === 'student') {
            paymentList[index] = {
                ...paymentList[index], 
                student_name: value.full_name,
                id_student: value.id,
                date: moment(Date.now()).format('YYYY-MM-DD'),
            }
        } else {
            paymentList[index][key] = value
        }
        setPaymentList(paymentList)
        forceUpdate()
    }
    
    return (
        <>
            <Dialog
                size="lg"
                open={open}
                handler={() => { 
                    handleCallback(false)
                }}
                className="bg-transparent shadow-none w-min-w"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col">
                        {paymentList.map((info, index) => {
                            const prices = glb_sv.getTuitionFee?.[info.program]
                            return (
                                <div className="flex py-4 pl-4 border-b border-blue-gray-50 items-center">
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
                                            {classList?.map(item => (
                                                <Option onClick={() => updateListPayment({ index: index, value: item, key: 'id_class' })} key={item.id} value={item.id} className="flex items-center gap-2">
                                                    {item.id}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            disabled={!info.id_class}
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
                                            {(classList.find(classInfo => classInfo.id === info.id_class)?.student_list || []).map(item => (
                                                <Option onClick={() => updateListPayment({ key: 'student', value: item, index: index })} key={item.id} value={item.id + ' - ' + item.full_name} className="flex items-center gap-2">
                                                    {item.id + ' - ' + item.full_name}
                                                </Option>
                                            ))}
                                        </Select>
                                        {console.log('pricest', prices)}

                                        {prices?.length > 1 ? (
                                            <Select
                                                label="Select Price"
                                                selected={(element) =>
                                                    element &&
                                                    React.cloneElement(element, {
                                                        disabled: true,
                                                        className:
                                                            "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                    })
                                                }
                                            >
                                                {prices.map(price => (
                                                    <Option onClick={() => updateListPayment({ value: price.value, index: index })} key={price.key} value={price.value} className="flex items-center gap-2">
                                                        {price.key + ' - ' + formatNum(price.value, 0, 'price')}
                                                    </Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Input
                                                readOnly
                                                variant="outlined"
                                                label="Tuition Fee"
                                                contentEditable={false}
                                                value={prices ? (prices[0]?.key + ' - ' + formatNum(prices[0]?.value, 0, 'price')) : undefined}
                                                placeholder="Outlined"
                                            />
                                        )}
                                        <Input
                                            variant="outlined"
                                            label="Note"
                                            value={info?.note}
                                            placeholder="Optional"
                                            onChange={(e) => updateListPayment({ value: e.target.value, index: index, key: 'note' })}
                                        />
                                    </div>

                                    <MinusCircleIcon
                                        style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                                        className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                                    // onClick={() => updateListPayment({index: index, mode: 'delete'})}
                                    />
                                </div>
                            )
                        })}
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
                                disabled={paymentList.findIndex(item => item.id_class === '' || item.id_student === '') > -1}
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