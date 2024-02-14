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
} from "@material-tailwind/react";
import FormatPhone from "../../utils/formatNumber/formatPhone";
import FormatDate from "../../utils/formatNumber/formatDate";
import { ArrowUpTrayIcon, ArrowUturnLeftIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const ListStatus = [
    {
        type: 0,
        status: 'Đã đăng ký',
        color: 'green'
    },
    {
        type: 1,
        status: 'Chưa đăng ký',
        color: 'red'
    },
    {
        type: 2,
        status: 'Đã nghỉ',
        color: ''
    }
]

const TABLE_HEAD = [
    "Tình trạng đăng ký",
    "Số điện thoại",
    "Họ & tên",
    "Ngày sinh",
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Người phụ trách tư vấn/hướng dẫn học sinh",
    'Listening',
    'Speaking',
    'Reading',
    'Writing'
];

export function ModalApproveDetail({ handleOpen, open, data }) {
    return (
        <Dialog
            // size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none max-w-[80%]"
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
                                        ? "p-2"
                                        : "p-2 border-b border-blue-gray-50";
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
                                                    {item.full_name}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {FormatDate(item.dob)}
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
                                                    {item.listening}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item.speaking}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item.reading}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item.writing}
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
    );
}