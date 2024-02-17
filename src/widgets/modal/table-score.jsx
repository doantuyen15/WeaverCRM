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
import formatDate from "../../utils/formatNumber/formatDate";
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

const HeaderScore = [
    // 'Chương trình học',
    'Listening',
    'Speaking',
    'Reading',
    'Writing',
    'Score',
]

export function TableScore({ handleOpen, open, item = {} }) {
    return (
        // <Dialog
        //     // size="xs"
        //     open={open}
        //     handler={handleOpen}
        //     className="bg-transparent shadow-none max-w-[80%]"
        // >

        // </Dialog>
        <Card className="h-full w-full rounded-none" shadow={false}>
            <CardHeader floated={false} shadow={false} className="rounded-none pb-6">
                <Typography variant="h5" color="blue-gray">
                    Bảng điểm
                </Typography>
            </CardHeader>
            <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
                <table className="text-left">
                    <thead>
                        <tr>
                            {HeaderScore.map((head) => (
                                <th
                                    key={head}
                                    className="border-b p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={'scorebody'}>
                            <td className='p-4'>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {item.listening}
                                </Typography>
                            </td>
                            <td className='p-4'>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {item.speaking}
                                </Typography>
                            </td>
                            <td className='p-4'>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                >
                                    {item.reading}
                                </Typography>
                            </td>
                            <td className='p-4'>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                >
                                    {item.writing}
                                </Typography>
                            </td>
                            <td className='p-4'>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                >
                                    {item.vocabulary}
                                </Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardBody>
            {/* <CardFooter className="flex items-center justify-end border-t border-blue-gray-50 p-4">
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button key={'Confirm'} className="flex items-center gap-3" loading={loading} size="sm" onClick={() => handleConfirmCallback(true)} disabled={(!objectEdit && !objectNew) || loading}>
                    <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Confirm & Request
                </Button>
                <Button className="flex items-center gap-3" size="sm" onClick={() => handleConfirmCallback(false)} >
                    <ArrowUturnLeftIcon strokeWidth={2} className="h-4 w-4" /> Cancel
                </Button>
            </div>
        </CardFooter> */}
        </Card>
    );
}