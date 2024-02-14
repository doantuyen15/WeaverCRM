import React, { useRef, useEffect, useState } from "react";
import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Tooltip,
    Progress,
    Alert,
} from "@material-tailwind/react";
import {
    EllipsisVerticalIcon,
    ArrowUpIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "./../../widgets/cards";
import { StatisticsChart } from "./../../widgets/charts";
import {
    statisticsCardsData,
    statisticsChartsData,
    projectsTableData,
    ordersOverviewData,
} from "../../data";
import { CheckBadgeIcon, CheckCircleIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, ClockIcon, MinusCircleIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Amethyst from "../../assets/amethyst.png";
import { useController } from "../../context";
import {useFetch, useFirebase} from "../../utils/api/request";
import { orderBy } from 'lodash';
import FormatDate from "../../utils/formatNumber/formatDate";
import { Slide, toast } from "react-toastify";
import { ModalApproveDetail } from "../../widgets/modal/approve-detail";

const header = [
    "STT", 
    // "Loại lệnh",
    "Người tạo",
    "Thời gian tạo",
    "Chi tiết",
    "Note"
]
const headerMap = ["type_request", "created_at"]
const typeList = {
    'add_student': 'Add Student'
}
const status = [
    'Duyệt',
    'Chờ Duyệt',
    'Từ chối'
]

export function Approval() {
    const [controller] = useController();
    const {userInfo} = controller;
    const [list, setList] = useState([])
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [objectEdit, setObjectEdit] = useState([])
    const [loading, setLoading] = useState(false)
    const [onAdd, setOnAdd] = useState(false)
    const focusRef = useRef(null)
    const tableRef = useRef([])
    const [openDetail, setOpenDetail] = useState(false)
    const [itemDetail, setItemDetail] = useState([])

    useEffect(() => {
        getApprovalList()
    }, [])

    const getApprovalList = () => {
        setLoading(true)
        useFirebase('get_approval_list')
            .then(data => {
                setLoading(false)
                const groupedData = data.reduce((acc, item) => {
                    acc[Object.keys(item)[0]] = acc[Object.keys(item)[0]] || [];
                    acc[Object.keys(item)[0]].push({...Object.values(item)[0], type: Object.keys(item)[0]});
                    return acc;
                }, {});
                setList(groupedData)
                console.log('get_approval_list', groupedData)
            })
            .catch(err => console.log(err))
    }

    const handleSort = (indexCol) => {
        let sorted
        // if (key === 'Member') {
        //     sorted = orderBy(TABLE_ROWS, ['name'], [isAsc ? 'asc' : 'desc'])
        // } else return
        sorted = orderBy(tableRef.current, [header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const handleApprove = (ok, item) => {
        setLoading(true)
        useFirebase("update_approval", item)
            .then(res => {
                setLoading(false)
                getApprovalList()
            })
    }

    const openApproveDetail = (item, type) => {
        setOpenDetail(true)
        setItemDetail(item)
    }

    return (
        <div className="mt-12">
            <div className="mb-4 grid grid-cols-1 gap-6">
                <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex items-center justify-between p-6"
                    >
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1">
                                Approval
                            </Typography>
                            <Typography
                                variant="small"
                                className="flex items-center gap-1 font-normal text-blue-gray-600"
                            >
                                <MinusCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                                <strong>{list.length} waiting</strong>
                            </Typography>
                        </div>
                        <Menu placement="left-start">
                            <MenuHandler>
                                <IconButton size="sm" variant="text" color="blue-gray">
                                    <EllipsisVerticalIcon
                                        strokeWidth={3}
                                        fill="currenColor"
                                        className="h-6 w-6"
                                    />
                                </IconButton>
                            </MenuHandler>
                            <MenuList>
                                <MenuItem>Accept All</MenuItem>
                                <MenuItem>Reject All</MenuItem>
                            </MenuList>
                        </Menu>
                    </CardHeader>
                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    {header.map(
                                        (head, index) => (
                                            <th
                                                onClick={() => handleSort(index)}
                                                key={head}
                                                className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                                >
                                                    {head}{" "}
                                                    {index !== header.length - 1 && (
                                                        keySort !== index ? (
                                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                                        ) : keySort === index && isAsc ? (
                                                            <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                                                        )
                                                    )}
                                                </Typography>
                                            </th>
                                        )
                                    )}
                                    <th
                                        className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(list)?.map(
                                    (type, index) => {
                                        const className = `py-3 px-5 ${index === list.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50"
                                            }`;

                                        return (
                                            <>
                                                <tr>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold pt-4 pl-4"
                                                    >
                                                        {typeList[type]}
                                                    </Typography>
                                                </tr>
                                                {list[type].map((item, stt) => (
                                                    <tr key={index}>
                                                        <td className={className}>
                                                            <div className="flex items-center gap-4">
                                                                <Typography
                                                                    variant="small"
                                                                    className="text-xs font-medium text-blue-gray-600"
                                                                >
                                                                    {stt}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        {/* <td className={className}>
                                                            <Typography
                                                                variant="small"
                                                                className="text-xs font-medium text-blue-gray-600"
                                                            >
                                                                {typeList[item.type_request - 1]}
                                                            </Typography>
                                                        </td> */}
                                                        <td className={className}>
                                                            {/* <Avatar src={Amethyst} alt={name} size="sm" /> */}
                                                            <Typography
                                                                variant="small"
                                                                className="text-xs font-medium text-blue-gray-600"
                                                            >
                                                                {item.requesting_username}
                                                            </Typography>
                                                        </td>
                                                        <td className={className}>
                                                            <Typography
                                                                variant="small"
                                                                className="text-xs font-medium text-blue-gray-600"
                                                            >
                                                                {item.created_at}
                                                            </Typography>
                                                        </td>
                                                        <td className={className}>
                                                            <InformationCircleIcon 
                                                                className="w-5 h-5 cursor-pointer"
                                                                onClick={() => openApproveDetail(item.data, type)} 
                                                            />
                                                        </td>
                                                        <td className={className}>
                                                            <Typography
                                                                variant="small"
                                                                className="text-xs font-medium text-blue-gray-600"
                                                            >
                                                                {''}
                                                            </Typography>
                                                        </td>
                                                        <td className={className}>
                                                            <Menu placement="left-start">
                                                                <MenuHandler>
                                                                    <IconButton variant="text">
                                                                        <PencilIcon className="h-4 w-4" />
                                                                    </IconButton>
                                                                </MenuHandler>
                                                                <MenuList>
                                                                    <MenuItem onClick={() => handleApprove(true, item)}>Approve</MenuItem>
                                                                    <MenuItem onClick={() => handleApprove(false, item)}>Reject</MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
            <ModalApproveDetail open={openDetail} handleOpen={setOpenDetail} data={itemDetail}/>
        </div>
    );
}

export default Approval;
