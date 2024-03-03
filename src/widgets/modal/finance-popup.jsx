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

const academic = glb_sv.academic

const department = glb_sv.department

const roles = glb_sv.roles

const BillType = {
    'pay': [
        'Loại khác',
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

export function FinancePopup({ open, handleCallback, staffInfo = {}, isPayment }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [newBill, setNewBill] = useState({})
    // const [editStaff, setEditStaff] = useState(staffInfo)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [staffList, setStaffList] = useState([])

    useEffect(() => {
        if (open) {
            getStaffList()
            setNewBill(new Finance({ 
                isPayment: isPayment
            }))
        } else {
            setNewBill({})
        }
    }, [open])

    const updateFinance = (key, value) => {
        newBill.updateInfo(key, value)
        setNewBill(newBill)
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
                                                    onChange={(e) => updateFinance('create_date', formatDate(e.target.value || moment(), 'DDMMYYYY'))}
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

                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Giá trị
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
                                    </div>
                                </div>

                                <div className="text-center flex flex-row grid gap-x-1 gap-y-3 pl-6">
                                    <Typography variant="h6" color="black">
                                        THÔNG TIN NHÂN SỰ
                                    </Typography>
                                    <div className="grid gap-3 pb-3">
                                        <div className="grid grid-cols-3 self-center">
                                            <div className="max-w-max relative self-center">
                                                <Typography variant="small" color="black">
                                                    Phòng ban nộp
                                                </Typography>
                                                <span className="absolute -top-1 -right-2 text-red-500">*</span>
                                            </div>
                                            <div className="col-span-2 pb-3">
                                                <Select
                                                    // label="Phòng ban nộp"
                                                    variant="standard"
                                                    value={newBill.department}
                                                    // error={!newBill.department?.toString()}
                                                    selected={(element) =>
                                                        element &&
                                                        React.cloneElement(element, {
                                                            disabled: true,
                                                            className:
                                                                "flex items-center opacity-100 px-4 gap-2 pointer-events-none",
                                                        })
                                                    }
                                                >
                                                    {department.map((item, id) => (
                                                        <Option onClick={() => {
                                                            updateFinance('department', item)
                                                            updateFinance('department_id', id)
                                                        }}
                                                            key={item} value={item} className="flex items-center gap-2">
                                                            {item}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>

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
                                                    {staffList.filter(item => item.department_id !== newBill.department_id).map((item, id) => (
                                                        <Option
                                                            // onClick={(e) => e.stopPropagation()}
                                                            onClick={(e) => {
                                                                // e.stopPropagation()
                                                                updateFinance('staff_id', id)
                                                                updateFinance('staff_name', item.full_name)
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