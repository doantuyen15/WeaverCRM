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
} from "@material-tailwind/react";
import {
    EllipsisVerticalIcon,
    ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "./../../widgets/cards";
import { StatisticsChart } from "./../../widgets/charts";
import {
    statisticsCardsData,
    statisticsChartsData,
    projectsTableData,
    ordersOverviewData,
} from "../../data";
import { CheckBadgeIcon, CheckCircleIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, ClockIcon, InformationCircleIcon, MinusCircleIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Amethyst from "../../assets/amethyst.png";
import { useController } from "../../context";
import useFetch from "../../utils/api/request";
import orderBy from 'lodash'
import FormatDate from "../../utils/formatNumber/formatDate";

const header = ["STT", "Loại lệnh", "Người tạo", "Thời gian tạo", "Chi tiết", "Note"]
const headerMap = ["type_request", "created_at"]

export function Approval() {
    const [controller] = useController();
    const {userInfo} = controller;
    const [table, setTable] = useState([])
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [objectEdit, setObjectEdit] = useState([])
    const [loading, setLoading] = useState(false)
    const [onAdd, setOnAdd] = useState(false)
    const focusRef = useRef(null)
    const tableRef = useRef([])

    useEffect(() => {
        getApprovalList()
    }, [])

    const getApprovalList = () => {
        setLoading(true)
        const requestInfo = {
            headers: {
                "authorization": `${userInfo.token}`,
            },
            method: 'get',
            service: 'getListApproval',
            callback: (data) => {
                setLoading(false)
                setTable(JSON.parse(data))
                tableRef.current = JSON.parse(data)
                console.log(tableRef.current);
            },
            handleError: (error) => {
                console.log('error', error)
                setLoading(false)
            }
        }
        useFetch(requestInfo)
    }

    const handleSort = (indexCol) => {
        let sorted
        // if (key === 'Member') {
        //     sorted = orderBy(TABLE_ROWS, ['name'], [isAsc ? 'asc' : 'desc'])
        // } else return
        sorted = orderBy(tableRef.current, [header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setTable([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const handApprove = (ok, item) => {
        setLoading(true)
        const requestInfo = {
            headers: {
                "authorization": `${userInfo.token}`,
            },
            body: [
                item.id_approval,
                item.type_request,
                '1',
                item.new_data_update,
                '0',
                '1'
            ],
            method: 'POST',
            service: 'approval',
            callback: (data) => {
                setLoading(false)
                setTable(JSON.parse(data))
                tableRef.current = JSON.parse(data)
                getApprovalList()
            },
            handleError: (error) => {
                console.log('error', error)
                setLoading(false)
            }
        }
        useFetch(requestInfo)
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
                                <strong>{table.length} waiting</strong>
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
                                {table.map(
                                    (item, index) => {
                                        item.index = index
                                        const className = `py-3 px-5 ${index === table.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50"
                                            }`;

                                        return (
                                            <tr key={index}>
                                                <td className={className}>
                                                    <div className="flex items-center gap-4">
                                                        {/* <Avatar src={Amethyst} alt={name} size="sm" /> */}
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-bold"
                                                        >
                                                            {item.index}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography
                                                        variant="small"
                                                        className="text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {item.type_request}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography
                                                        variant="small"
                                                        className="text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {/* {budget} */}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography
                                                        variant="small"
                                                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {FormatDate(item.created_at)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <InformationCircleIcon className="w-4 h-4"/>
                                                </td>
                                                <td className={className}>
                                                    <Typography
                                                        variant="small"
                                                        className="mb-1 block text-xs font-medium text-blue-gray-600"
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
                                                            <MenuItem onClick={() => handApprove(true, item)}>Approve</MenuItem>
                                                            <MenuItem onClick={() => handApprove(false, item)}>Reject</MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default Approval;
