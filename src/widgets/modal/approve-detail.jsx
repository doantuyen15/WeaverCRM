import React from "react";
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
    Chip,
    Tooltip,
} from "@material-tailwind/react";
import FormatPhone from "../../utils/formatNumber/formatPhone";
import formatDate from "../../utils/formatNumber/formatDate";
import { ArrowUpTrayIcon, ArrowUturnLeftIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { CreateClasses } from "./create-class";
import { glb_sv } from "../../service";
import formatNum from "../../utils/formatNumber/formatNum";
import { ModalFinanceDetail } from "../../pages/dashboard/finance";
import { ModalStudent } from "./modal-student";

const ListStatus = glb_sv.ListStatus

const TABLE_HEAD = [
    "Tình trạng đăng ký",
    "Họ",
    "Tên",
    "Ngày đăng ký",
    "Số điện thoại",
    "Ngày sinh",
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Advisor",
    'Listening',
    'Speaking',
    'Reading',
    'Writing',
    'Grammar & Vocabulary'
];

const TABLE_TUITION = ['Mã HS', 'Tên', 'Ngày đóng', 'Số tiền đóng', 'Ghi chú']

export function ModalApproveDetail({ setOpen, open, data, typeApprove }) {
    console.log('ModalApproveDetail', data);
    return (
        <>
            {typeApprove === 'add_student' || typeApprove === 'update_student' ? (
                <ModalStudent studentData={data} open={open} handleCallback={setOpen} justShow />
            ) : typeApprove === 'add_classes' ? (
                <CreateClasses handleCallback={() => setOpen('')} classInfo={data[0]} open={open} isShow={false} />
            ) : typeApprove === 'staff_checkin' ? (
                <Dialog
                    // size="xs"
                    open={open}
                    handler={() => setOpen('')}
                    className="bg-transparent shadow-none h-[50px] w-[20vw]"
                >
                    <Card className="w-full h-full">
                        <CardBody className="p-0 px-0 h-full">
                            <div className="flex h-full justify-around items-center">
                                <Typography
                                    variant="h6"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    Fullname: {data.displayName}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    Roles: {glb_sv.roles[Number(data.roles) - 1]}
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>
            ) : ['make_finance', 'make_tuition', 'make_refunds'].includes(typeApprove) ? (
                <ModalFinanceDetail open={open} handleOpen={setOpen} data={data}/>
            ) : <></>}
            {/* : typeApprove === 'make_tuition' ? (
                <Dialog
                    // size="xs"
                    open={open}
                    handler={() => setOpen('')}
                    className="bg-transparent shadow-none max-w-[80%]"
                >
                    <Card className="h-full w-full">
                        <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
                            <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        {TABLE_TUITION.map((head, index) => (
                                            <th
                                                key={head}
                                                className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                                >
                                                    {head}{" "}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map(
                                        ({ id_student, student_name, tuition, date, note }, index) => {
                                            const isLast = index === data.length - 1;
                                            const className = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            return (
                                                <tr key={index} className="even:bg-blue-gray-50/50">
                                                    <td className={className}>
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {id_student}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className={`text-xs font-normal ${!tuition ? 'text-red-500' : 'text-blue-gray-500'}`}>
                                                            {student_name}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-normal text-blue-gray-600">
                                                            {date ? formatDate(date) : ''}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-500">
                                                            {formatNum(tuition, 0, 'price')}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {note}
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Dialog>
            ) */}
        </>
    );
}