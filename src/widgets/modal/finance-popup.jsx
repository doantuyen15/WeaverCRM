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
    Badge,
    Spinner,
} from "@material-tailwind/react";
import { useController } from "../../context";
import formatNum from "../../utils/formatNumber/formatNum";
import { PlusIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import useStorage from "../../utils/localStorageHook";
import { useFetch, useFirebase } from "../../utils/api/request";
import moment from "moment";
import ClassInfo from "../../data/entities/classesInfo";
import formatDate from "../../utils/formatNumber/formatDate";
import StaffInfo from "../../data/entities/staffInfo";
import { glb_sv } from "../../service";
import Finance from "../../data/entities/finance";
import FormatPhone from "../../utils/formatNumber/formatPhone";

const academic = glb_sv.academic

const department = glb_sv.department

const roles = glb_sv.roles

const BillType = {
    'pay': [
        'Loại khác',
        'Refunds',
        'Chi tiền vật tư / thiết bị',
        'Chi tiền lương',
    ],
    'receive': [
        'Loại khác',
        'Thu tiền học phí',
    ],
}

const AccountType = [
    'Tiền mặt',
    'Chuyển khoản'
]

export function FinancePopup({ open, handleCallback, isPayment = false, dataClass = [], dataStudent }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [newBill, setNewBill] = useState({})
    // const [editStaff, setEditStaff] = useState(staffInfo)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [staffList, setStaffList] = useState([])
    const [classList, setClassList] = useState([])
    const [loadingTuition, setLoadingTuition] = useState(false)
    const [tuitionData, setTuitionData] = useState([])
    const [tuitionDate, setTuitionDate] = useState([])
    const courseTuition = useRef({})
    const currentClassInfo = useRef({})
    const [loading, setLoading] = useState(false)
    const currentMonth = moment().format('MMYYYY')
    const newBillRef = useRef({})

    useEffect(() => {
        if (open) {
            getClassList()
            getStaffList()
            if (!dataStudent?.id_class) {
                const createBill = new Finance({
                    isPayment: isPayment,
                    type_id: !isPayment ? 1 : 0,
                    type: !isPayment ? BillType['receive'][1] : BillType['pay'][0],
                    tuition_date: currentMonth,
                    account_type: AccountType[0],
                    account_type_id: 0,
                    create_date: moment().valueOf()
                })
                newBillRef.current = createBill
                setNewBill(createBill)
            } else {
                const createBill = new Finance({
                    isPayment: isPayment,
                    type_id: !isPayment ? 1 : 0,
                    type: !isPayment ? BillType['receive'][1] : BillType['pay'][0],
                    tuition_date: '',
                    account_type: AccountType[0],
                    account_type_id: 0,
                    customer_id: dataStudent.id_student,
                    customer: dataStudent.full_name,
                    class_id: dataStudent.id_class,
                    create_date: moment().valueOf()
                })
                getCourseTuition()
                newBillRef.current = createBill
                setNewBill(createBill)
                currentClassInfo.current = dataClass.find(item => item.id === dataStudent.id_class) || {}
                getTuitionForCustomer(dataStudent.month, dataStudent.id_student)
            }
        } else {
            setNewBill({})
            setLoadingTuition(false)
        }
    }, [open])

    const updateFinance = (key, value) => {
        newBillRef.current?.updateInfo(key, value)
        setNewBill(newBillRef.current)
        forceUpdate()
    }

    const getStaffList = () => {
        // setLoading(true)
        useFirebase('get_staff_list')
            .then(data => {
                // setLoading(false)
                setStaffList(data)
                // useStorage('set', 'staffList', data)
            })
            .catch(err => console.log(err))
        // .finally(() => setLoading(false))
    }

    const getClassList = () => {
        if (dataClass.length === 0) {
            useFirebase('get_class_list')
            .then(data => {
              setLoading(false)
              data?.map(item => item.getStudentList().then(setClassList(data)))
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
        }
        else dataClass.map(item => item.getStudentList().then(setClassList(dataClass)))
        setLoading(true)

    }

    const getTuitionForCustomer = (month, customer_id) => {
        setLoadingTuition(true)
        const { id, program, level, start_date, end_date } = currentClassInfo.current
        useFirebase('query_tuition', {
            customer_id, 
            class_id: id,
            month
        })
            .then(data => {
                const tuitionFee = Number(courseTuition.current[program]?.[level?.trim()]?.['tuition'])
                let totalTuition = 0

                if (data?.length != 0) {
                    data.forEach(item => {
                        if (!item.isPayment) totalTuition += Number(item.amount)
                        else totalTuition -= Number(item.amount)
                    })
                }
                console.log('getTuitionForCustomer', courseTuition.current[program], program, level);


                if (program === 'IELTS') {
                    if ((Number(totalTuition) === 0 && isPayment) || (Number(totalTuition) >= tuitionFee && !isPayment) ) {
                        setTuitionData([])
                    } else if ((Number(totalTuition) >= tuitionFee && isPayment) || (Number(totalTuition) === 0 && !isPayment)) {
                        setTuitionData([
                            tuitionFee,
                            tuitionFee / 2
                        ])
                    } else {
                        setTuitionData([
                            tuitionFee / 2,
                        ])
                    } 
                } else {
                    const totalMonth = moment(end_date, 'DD/MM/YYYY').diff(moment(start_date, 'DD/MM/YYYY'), 'months')
                    const option = []
                    // const startMonth = moment(start_date, 'DD/MM/YYYY').clone()
                    for(var i = 0; i < totalMonth; i++) {
                        option.push(moment(start_date, 'DD/MM/YYYY').clone().add(i, 'month').format('MMYYYY'))
                    }
                    setTuitionDate(option)
                    if (totalTuition === 0) {
                        updateFinance('amount', tuitionFee)
                        console.log('tuitionFee', tuitionFee);
                        setTuitionData([
                            tuitionFee
                        ])
                    } else {
                        updateFinance('amount', 0)
                        setTuitionData([])
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setLoadingTuition(false))
    }

    const getCourseTuition = () => {
        useFirebase('get_all_course', {getId: true})
            .then(data => {
                data.forEach(item => {
                    courseTuition.current[item.id] = item.data()
                })
            })
            .catch(err => console.log(err))
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
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-center px-6 pt-6"
                    >
                        <Typography variant="h3" color="black">
                            {isPayment ? 'Lập phiếu chi' : 'Lập phiếu thu'}
                        </Typography>
                    </CardHeader>
                    <CardBody className="flex flex-col">
                        <div className="flex py-4 border-b border-blue-gray-50 items-center">
                            <div className="flex w-full grid grid-cols-2">
                                <div className="text-center flex flex-row grid gap-x-1 gap-y-3">
                                    <Typography variant="h6" color="black">
                                        THÔNG TIN NGUỒN TIỀN
                                    </Typography>
                                    <div className="grid gap-3 pr-6 border-r-2">
                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Mã phiếu (tự tạo)
                                                </Typography>
                                                {/* <span className="absolute -top-1 -right-2 text-red-500">*</span> */}
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    variant="standard"
                                                    autoFocus={false}
                                                    disabled
                                                    // label="Mã phiếu (tự tạo)"
                                                    // placeholder="Mã phiếu (tự tạo)"
                                                    // contentEditable={false}
                                                    className="px-4 pb-3 opacity-70 pointer-events-none"
                                                    value={newBill.code}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Ngày lập phiếu
                                                </Typography>
                                                <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Input
                                                    autoFocus={true}
                                                    variant="standard"
                                                    type="date"
                                                    max={moment().format('YYYY-MM-DD')}
                                                    className="pl-4 pr-2"
                                                    value={formatDate(newBill.create_date, 'YYYY-MM-DD')}
                                                    onChange={(e) => updateFinance('create_date', moment().valueOf())}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Loại
                                                </Typography>
                                                <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Select
                                                    placeholder="Chọn loại thu"
                                                    variant="standard"
                                                    value={newBill.type}
                                                    // error={!newBill.type?.toString()}
                                                    selected={(element) =>
                                                        element &&
                                                        React.cloneElement(element, {
                                                            disabled: true,
                                                            className:
                                                                "flex items-center opacity-100 px-4 gap-2 pointer-events-none",
                                                        })
                                                    }
                                                >
                                                    {BillType[isPayment ? 'pay' : 'receive'].map((item, id) => (
                                                        <Option onClick={() => {
                                                            updateFinance('type', item)
                                                            updateFinance('type_id', id)
                                                        }}
                                                            key={item} value={item} className="flex items-center gap-2">
                                                            {item}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>

                                        {newBill.type_id !== 1 && (
                                            <div className="grid grid-cols-3 self-center">
                                                <div className="max-w-max relative self-center">
                                                    <Typography variant="small" color="black">
                                                        Số tiền
                                                    </Typography>
                                                    <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                                </div>
                                                <div className="col-span-2 pb-3">
                                                    <Input
                                                        variant="standard"
                                                        className="px-4"
                                                        value={formatNum(newBill.amount, 0, 'price')}
                                                        onChange={(e) => updateFinance('amount', e.target.value.replace(/[^\d.-]+/g, ''))}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Quỹ
                                                </Typography>
                                                <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Select
                                                    placeholder="Chọn quỹ"
                                                    variant="standard"
                                                    value={newBill.account_type}
                                                    // error={!newBill.account_type?.toString()}
                                                    selected={(element) =>
                                                        element &&
                                                        React.cloneElement(element, {
                                                            disabled: true,
                                                            className:
                                                                "flex items-center opacity-100 px-4 gap-2 pointer-events-none",
                                                        })
                                                    }
                                                >
                                                    {AccountType.map((item, id) => (
                                                        <Option onClick={() => {
                                                            updateFinance('account_type', item)
                                                            updateFinance('account_type_id', id)
                                                        }}
                                                            key={item} value={item} className="flex items-center gap-2">
                                                            {item}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>

                                        {newBill.type_id === 1 ? (
                                            <>
                                                <div className="grid grid-cols-3 self-center">
                                                    <div className="max-w-max relative self-center">
                                                        <Typography variant="small" color="black">
                                                            Mã lớp học
                                                        </Typography>
                                                        <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                                    </div>
                                                    <div className="col-span-2 pb-3">
                                                        <Select
                                                            variant="standard"
                                                            value={newBill.class_id}
                                                            // error={!newBill.account_type?.toString()}
                                                            selected={(element) =>
                                                                <Typography className="flex items-center opacity-100 px-4 gap-2 pointer-events-none" variant="small" color="black">
                                                                    {newBill.class_id}
                                                                </Typography>
                                                            }
                                                        >
                                                            {classList.map(item => (
                                                                <Option onClick={() => {
                                                                    updateFinance('customer', '')
                                                                    updateFinance('customer_id', '')
                                                                    updateFinance('class_id', item.id)
                                                                    currentClassInfo.current = item
                                                                    if (Object.keys(courseTuition.current).length === 0) getCourseTuition()
                                                                }}
                                                                    key={item.id} value={item.id} className="flex items-center gap-2">
                                                                    {item.id}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>
                                                {newBill.class_id && (
                                                    <div className="grid grid-cols-3 self-center">
                                                        <div className="max-w-max relative self-center">
                                                            <Typography variant="small" color="black">
                                                                Khách hàng
                                                            </Typography>
                                                            <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                                        </div>
                                                        <div className="col-span-2 pb-3">
                                                            <Select
                                                                variant="standard"
                                                                value={newBill.customer}
                                                                // error={!newBill.account_type?.toString()}
                                                                selected={(element) =>
                                                                    <Typography className="flex items-center opacity-100 px-4 gap-2 pointer-events-none" variant="small" color="black">
                                                                        {newBill.customer}
                                                                    </Typography>
                                                                }
                                                            >
                                                                {currentClassInfo.current?.student_list?.map(item => (
                                                                    <Option onClick={() => {
                                                                        updateFinance('customer', item.full_name)
                                                                        updateFinance('customer_id', item.id)
                                                                        getTuitionForCustomer(currentMonth, newBill.customer_id)
                                                                        currentClassInfo.current?.program === 'IELTS' && getTuitionForCustomer('', item.id)
                                                                    }}
                                                                        key={item.id} value={item.full_name} className="flex items-center gap-2">
                                                                        {item.full_name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}

                                                {newBill.customer_id && currentClassInfo.current?.program !== 'IELTS' && (
                                                    tuitionDate.length > 0 && (
                                                        <div className="grid grid-cols-3 self-center">
                                                            <div className="max-w-max relative flex items-center self-center">
                                                                <Typography variant="small" color="black">
                                                                    Học phí tháng
                                                                </Typography>
                                                                <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                                            </div>
                                                            <div className="col-span-2 pb-3">
                                                                <Select
                                                                    placeholder="Chọn quỹ"
                                                                    variant="standard"
                                                                    value={newBill.tuition_date}
                                                                    // error={!newBill.account_type?.toString()}
                                                                    selected={(element) =>
                                                                        <Typography className="flex items-center opacity-100 px-4 gap-2 pointer-events-none" variant="small" color="black">
                                                                            {newBill.tuition_date ? moment(newBill.tuition_date, 'MMYYYY').format('MMMM YYYY') : ''}
                                                                        </Typography>
                                                                    }
                                                                >
                                                                    {tuitionDate.map(month => (
                                                                        <Option onClick={() => {
                                                                            updateFinance('tuition_date', month)
                                                                            updateFinance('amount', 0)
                                                                            getTuitionForCustomer(month, newBill.customer_id, 'refunds')
                                                                        }}
                                                                            key={month} value={month} className="flex items-center gap-2">
                                                                            {moment(month, 'MMYYYY').format('MMMM YYYY')}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                                <div className="grid grid-cols-3 self-center">
                                                    <div className="max-w-max relative flex items-center self-center">
                                                        <Typography variant="small" color="black">
                                                            Số tiền
                                                        </Typography>
                                                        <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                                        {loadingTuition && <Spinner className="w-4 h-4 ml-2" />}
                                                    </div>
                                                    <div className="col-span-2 pb-3">
                                                        <Select
                                                            placeholder="Chọn quỹ"
                                                            variant="standard"
                                                            value={newBill.amount}
                                                            // error={!newBill.account_type?.toString()}
                                                            selected={(element) =>
                                                                <Typography className="flex items-center opacity-100 px-4 gap-2 pointer-events-none" variant="small" color="black">
                                                                    {formatNum(newBill.amount, 0, 'price')}
                                                                </Typography>
                                                            }
                                                        >
                                                            {tuitionData.map(item => (
                                                                <Option onClick={() => {
                                                                    updateFinance('amount', item)
                                                                }}
                                                                    key={item} value={item} className="flex items-center gap-2">
                                                                    {formatNum(item, 0, 'price')}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        
                                    </div>
                                </div>

                                <div className="text-center flex flex-row grid gap-x-1 gap-y-3 pl-6">
                                    <div className="grid gap-3 pb-3">
                                        <Typography variant="h6" color="black">
                                            THÔNG TIN NHÂN SỰ
                                        </Typography>

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Nhân viên
                                                </Typography>
                                                <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Select
                                                    variant="standard"
                                                    value={newBill.staff_name}
                                                    // error={!newBill.staff_id?.toString()}
                                                    selected={(element) =>
                                                        <Typography className="flex items-center opacity-100 px-4 gap-2 pointer-events-none" variant="small" color="black">
                                                            {newBill.staff_name}
                                                        </Typography>
                                                    }
                                                >
                                                    {staffList.map((item, id) => (
                                                        <Option
                                                            // onClick={(e) => e.stopPropagation()}
                                                            onClick={(e) => {
                                                                // e.stopPropagation()
                                                                updateFinance('staff_id', item.id)
                                                                updateFinance('staff_name', item.full_name)
                                                                newBill.staff_phone = item.phone
                                                                updateFinance('staff_phone', item.phone)
                                                            }}
                                                            key={item.id} value={item.full_name} className="flex items-center gap-1"
                                                        >
                                                            {item.full_name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Số điện thoại
                                                </Typography>
                                                {/* <span className="absolute -top-1 -right-2 text-red-500">*</span> */}
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Input
                                                    readOnly
                                                    variant="standard"
                                                    value={FormatPhone(newBill.staff_phone)}
                                                    className="px-4"
                                                    onChange={(e) => updateFinance('staff_phone', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Diễn giải
                                                </Typography>
                                                {/* <span className="absolute -top-1 -right-2 text-red-500">*</span> */}
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Input
                                                    variant="standard"
                                                    value={newBill.explain}
                                                    className="px-4"
                                                    onChange={(e) => updateFinance('explain', e.target.value)}
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0 flex justify-end">
                        <div className="pr-4">
                            <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                                Close
                            </Button>
                            <Button
                                disabled={(!newBill.amount || !newBill.department_id < 0 || newBill.staff_id < 0)}
                                variant="gradient"
                                onClick={() => handleCallback(true, newBill)}
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