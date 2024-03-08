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
                <Dialog
                    size="lg"
                    open={open}
                    handler={() => setOpen('')}
                    className="bg-transparent shadow-none min-w-[80%]"
                >
                    <Card className="h-full w-full">
                        <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
                            <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head, index) => (
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
                                        (item, index) => {
                                            const isLast = index === data.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            return (
                                                <tr key={index} className="even:bg-blue-gray-50/50">
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <div className="flex">
                                                                <Chip
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    value={
                                                                        <div className="flex items-center justify-center">
                                                                            {ListStatus[Number(item.status_res)].status}
                                                                        </div>
                                                                    }
                                                                    className="min-w-32"
                                                                    color={ListStatus[Number(item.status_res)].color}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {item.first_name}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {item.last_name}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {formatDate(item.register_date)}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {FormatPhone(item.phone)}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {formatDate(item.dob)}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {FormatPhone(item.parent_phone)}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.address}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.email}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.referrer}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.advisor}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.score_table[0]?.listening}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.score_table[0]?.speaking}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.score_table[0]?.reading}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.score_table[0]?.writing}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item.score_table[0]?.grammar}
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                        {/* <CardFooter className="flex items-center justify-end border-t border-blue-gray-50 p-4">
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Button key={'Confirm'} className="flex items-center gap-3" loading={loading} size="sm" onClick={() => handleConfirmCallback(true)} disabled={!objectEdit && !data}>
                        <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Confirm & Request
                    </Button>
                    <Button className="flex items-center gap-3" size="sm" onClick={() => handleConfirmCallback(false)} >
                        <ArrowUturnLeftIcon strokeWidth={2} className="h-4 w-4" /> Cancel
                    </Button>
                </div>
            </CardFooter> */}
                    </Card>
                </Dialog>
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
            ) : typeApprove === 'make_finance' || typeApprove === 'make_tuition' ? (
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