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
import { glb_sv } from "../../service";

export function PaymentPopup({ selectedMonth, open, handleCallback, classList, loading, tuitionTable }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [paymentList, setPaymentList] = useState([{
        student_name: '',
        program: '',
        tuition: '',
        id_class: '',
        note: '',
        date: '',
        date_ii: '',
        id_student: ''
    }])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [allCourse, setAllCourse] = useState({})
    const [studentList, setStudentList] = useState({})
    const currentMonth = moment().format('MMYYYY')

    useEffect(() => {
        if (open) {
            getAllCourse()
        }
        setPaymentList([{
            student_name: '',
            program: '',
            tuition: '',
            id_class: '',
            note: '',
            date: moment().format('DDMMYYYYHHmmSS'),
            id_student: '',
            month: selectedMonth,
            method_id: 1
        }])
        setStudentList({})
    }, [open])

    const getAllCourse = () => {
        useFirebase('get_all_course')
            .then(data => {
                const list = data.reduce((accumulator, item) => {
                    Object.values(item).map(price => {
                        if (!accumulator[price.course_id]) accumulator[price.course_id] = {}
                        if (!accumulator[price.course_id][price.level_id?.replace(' ','')]) accumulator[price.course_id][price.level_id?.replace(' ','')] = {}

                        accumulator[price.course_id][price.level_id?.replace(' ','')] = price
                    })
        
                    return accumulator;
                }, {});
                setAllCourse(list)

            })
            .catch(err => console.log(err))
            // .finally(() => setLoading(false))
    }

    const handleAdd = () => {
        const list = [...paymentList]
        list.push({
            student_name: '',
            program: '',
            tuition: '',
            id_class: '',
            note: '',
            date: moment().format('DDMMYYYYHHmmSS'),
            date_ii: '',
            id_student: '',
            month: selectedMonth,
            method_id: 1
        })
        setPaymentList(list)
    }

    const updateListPayment = async ({ key, index, value, mod }) => {
        try {
            if (mod === 'delete') {
                const {[index]: temp, ...rest} = studentList
                setPaymentList(prev => prev.filter((item, key) => index !== key))
                setStudentList(rest)
            } else if (key === 'id_class') {
                const [program, level, _id] = value.id.split('_')
                let maxtuition = Number(allCourse[program][level].tuition)
                const studentListRef = await value?.getStudentList()
                if (Object.keys(tuitionTable[value.id]).length > 0) {
                    const list = studentListRef.filter((item) => (tuitionTable[value.id][item.id]?.tuition || 0) < maxtuition)
                    studentList[index] = list
                }
                else studentList[index] = studentListRef
                setStudentList({ ...studentList })

                paymentList[index][key] = value.id
                paymentList[index]['program'] = value.program
                if (program !== 'IELTS') paymentList[index]['tuition'] = maxtuition
            } else if (key === 'student') {
                paymentList[index] = {
                    ...paymentList[index],
                    student_name: value.full_name,
                    id_student: value.id,
                }
            } else if (key === 'tuition') {
                console.log('paymentList[index]', paymentList[index]);
                let date = ''
                let currentTuition = 0
                const currentInfo = paymentList[index] || {}
                const [program, level, _id] = currentInfo.id_class.split('_')
                let maxtuition = Number(allCourse[program][level].tuition)
                try {
                    currentTuition = tuitionTable[currentInfo['id_class']]?.[currentInfo['id_student']]?.tuition || 0
                    date = tuitionTable[currentInfo['id_class']]?.[currentInfo['id_student']]?.date || ''
                } catch (error) {
                    console.log('error', error);
                }
                paymentList[index]['tuition'] = Number(currentTuition) > 0 ? maxtuition : value
                paymentList[index]['date'] = date || moment().format('DDMMYYYYHHmmSS')
                if (date) paymentList[index]['date_ii'] = moment().format('DDMMYYYYHHmmSS')
            } else {
                paymentList[index][key] = value
            }
        } catch (error) {
            console.log('maxtuition', error);
        }
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
                            const program = info.program
                            const level = info.id_class.split('_')[1]
                            let tuition = program ? Number(allCourse[program]?.[level]?.tuition) : undefined
                            const currentTuition = tuitionTable[info['id_class']]?.[info['id_student']]?.tuition || 0
                            console.log('tuitionTable', currentTuition, tuitionTable[info['id_class']]?.[info['id_student']]?.tuition);
                            // if (info.program) tuition = Number(allCourse[program][level].tuition)
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
                                            // disabled={!info.id_class}
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
                                            {(studentList[index] || []).map(item => {
                                                if (paymentList.findIndex((ele, _index) => (ele.id_student === item.id) && (_index !== index)) === -1) {
                                                    return (
                                                        <Option onClick={() => updateListPayment({ key: 'student', value: item, index: index })} key={item.id} value={item.id + ' - ' + item.full_name} className="flex items-center gap-2">
                                                            {item.id + ' - ' + item.full_name}
                                                        </Option>
                                                    )
                                                }
                                                else return <></>
                                            })}
                                        </Select>
                                        <Select
                                            label="Select Tuition"
                                            // value={info.tuition}
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                                // !info.tuition ? <></> :
                                                // <Typography variant="small" className="flex truncate items-center opacity-100 px-0 gap-2 pointer-events-none">
                                                //     {formatNum(info.tuition, 0, 'price')}
                                                // </Typography>
                                            }
                                        >
                                            {currentTuition === 0 ? (
                                                <Option onClick={() => updateListPayment({ value: tuition, index: index, key: 'tuition' })} key={tuition} value={tuition} className="flex items-center gap-2">
                                                    {formatNum(tuition, 0, 'price')}
                                                </Option>
                                            ) : <></>}
                                            {info.program === 'IELTS' ? (
                                                <Option onClick={() => updateListPayment({ value: tuition / 2, index: index, key: 'tuition' })} key={'tuition'} value={tuition / 2} className="flex items-center gap-2">
                                                    {formatNum(tuition / 2, 0, 'price')}
                                                </Option>
                                            ) : <></>}
                                        </Select>
                                        {/* {tuitionList[info.id_class]?.length > 1 ? (
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
                                        )} */}
                                        <Input
                                            variant="outlined"
                                            label="Note"
                                            value={info?.note}
                                            placeholder="Optional"
                                            onChange={(e) => updateListPayment({ value: e.target.value, index: index, key: 'note' })}
                                        />
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal min-w-max flex items-center"
                                        >
                                            <Checkbox
                                                checked={!info?.method_id}
                                                onClick={() => updateListPayment({ value: !info.method_id ? 1 : 0, index: index, key: 'method_id' })}
                                            />
                                            Tiền mặt
                                        </Typography>
                                    </div>
                                    <MinusCircleIcon
                                        style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                                        className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                                        onClick={() => updateListPayment({index: index, mod: 'delete'})}
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