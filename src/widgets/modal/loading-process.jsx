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

export function LoadingProcess({ open, handleCallback }) {
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('Tạo sheet Lesson Dairy')

    useEffect(() => {

    }, [open])

    return (
        <>
            <Dialog
                size="sm"
                open={open}
                // handler={() => {
                //     handleCallback(false)
                // }}
                className="bg-transparent shadow-none w-min-w"
            >
                <Card className="mx-auto w-full">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-center px-6 pt-6"
                    >
                        <Typography variant="h4" color="black">
                            Loading Process
                        </Typography>
                    </CardHeader>
                    <CardBody className="flex flex-col">
                        <div className="flex py-4 justify-center items-center">
                            <Typography variant="small" color="black">
                                {message}
                            </Typography>
                            <Spinner className="h-4 w-4 ml-2" />
                        </div>
                    </CardBody>
                    {/* <CardFooter className="pt-0 flex justify-end">
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
                    </CardFooter> */}
                </Card>
            </Dialog>
        </>
    );
}