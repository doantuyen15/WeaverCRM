import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    TabPanel,
    Tab,
    Switch,
    Tooltip,
    Button,
    Chip,
    List,
    ListItem,
    ListItemPrefix,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    IconButton
} from "@material-tailwind/react";
import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
    PencilIcon,
    TableCellsIcon,
    RectangleGroupIcon,
    PlusIcon,
    EllipsisVerticalIcon,
    ArrowPathIcon,
    ArrowUpTrayIcon,
    UserPlusIcon,
    ChevronUpDownIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CalendarIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "./../../widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "./../../data";
import { authorsTableData, projectsTableData } from "./../../data";
import React, { useEffect, useRef, useState } from 'react'
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { CreateAccount } from "../../widgets/modal/create-accout";
import {useFetch, useFirebase} from "../../utils/api/request";
import { useController } from "../../context";
import encryptString from "../../utils/encode/DataCryption";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { glb_sv } from "../../service";
import { orderBy } from 'lodash'
import { CreateStaff } from "../../widgets/modal/create-staff";
import formatDate from "../../utils/formatNumber/formatDate";
import useStorage from "../../utils/localStorageHook";
import moment from "moment";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { toast } from "react-toastify";

const TABLE_HEAD = [
    "STT", 
    "Phone", 
    "Tên nhân viên", 
    "CCCD/CMND", 
    "Ngày cấp", 
    "Nơi cấp", 
    "Ngày sinh", 
    "Địa chỉ", 
    "Email", 
    "Chức vụ",
    "Phòng",
    "STK Ngân hàng",
    "Chi nhánh ngân hàng",
    "Trình độ học vấn",
    "Tốt nghiệp trường",
    "Trạng thái làm việc",
    "Ngày bắt đầu",
    "Ngày kết thúc",
    "Ghi chú"
]

// const Header = [
//     "",
//     "phone", 
//     "full_name", 
//     "id_number", 
//     "id_date", 
//     "id_place", 
//     "dob", 
//     "address", 
//     "email", 
//     "position",
//     "department",
//     "bank_number",
//     "bank_branch",
//     "academic",
//     "graduated_school",
//     "working_status",
//     "work_date",
//     "end_date",
//     "note"
// ]
const currentMonth = moment().format('MMYYYY')

export function StaffList() {
    const [mod, setMod] = useState('table')
    const [showPassword, setShowPassword] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const [staffList, setStaffList] = useState([])
    const [controller, dispatch] = useController();
    const { userInfo } = controller;
    const [loading, setLoading] = useState(false)
    const [editStaff, setEditStaff] = useState({})
    const [timeTable, setTimeTable] = useState([])
    const [openAttendance, setOpenAttendance] = useState(false)
    const [calendar, setCalendar] = useState([])
    const calendarRef = useRef([])
    // const userInfo = glb_sv.userInfo

    const [openModal, setOpenModal] = useState(false)
    const tableRef = useRef([])

    useEffect(() => {
        getStaffList()
    }, [])

    const getStaffAttendance = () => {
        setLoading(true)
        useFirebase('get_staff_attendance')
            .then((list) => {
                setLoading(false)
                calendarRef.current = list
                setCalendar(list[currentMonth] || generateCalendar())
                console.log('get_staff_attendance', Object.values(list[currentMonth]));
            })
            .catch(() => setLoading(false))
        // const functions = getFunctions();
    }
    // console.log('get_staff_attendance', calendarRef.current, calendar);

    const generateCalendar = () => {
        const startDate = moment().startOf('M');
        const endDate = moment().endOf('M');
        // Lấy mảng các ngày trong tháng
        let timetable = {}
        // const days = [];
        for (let i = 0; i <= endDate.diff(startDate, 'days'); i++) {
            // days.push(startDate.clone().add(i, 'days'));
            const day = moment(startDate.clone().add(i, 'days')).format('DDMMYYYY')
            timetable[day] = {}
        }
        console.log('timetable', timetable);
        return(timetable)
    }

    const getStaffList = () => {
        setLoading(true)
        useFirebase('get_staff_list')
        .then((list) => {
            console.log('list', list);
            tableRef.current = list
            setLoading(false)
            setStaffList(list)
            useStorage('set', 'staffList', list)
        })
        .catch(() => setLoading(false))
        // const functions = getFunctions();
    }

    const handleStaffCallback = (ok, staff = {}) => {
        console.log('handleCreateCallback' , staff);
        setOpenCreate(false)
        if (ok) {
            if (!staff.isUpdate) {
                useFirebase('create_staff', {...staff, id: 'WESTAFF' + ('0' + staffList?.length)}).then(() => {
                    getStaffList()
                })
            } else {
                useFirebase('update_staff', staff).then(() => {
                    getStaffList()
                })
            }
        } else {
            setOpenCreate(false)
            setEditStaff({})
        }
    }

    const handleEditStaff = (staff) => {
        setEditStaff(staff)
        setOpenCreate(true)
    }

    const handleRemoveStaff = (staff) => {
        useFirebase('delete_staff', staff).then(() => {
            toast.success('Xoá nhân viên thành công!')
            getStaffList()
        }).catch((err) => toast.error('error:' + err))
    }

    const handleOpenAttendance = (open) => {
        if (open) {
            setOpenAttendance(true)
            getStaffAttendance()
        } else {
            setOpenAttendance(false)
            setCalendar([])
        }
    }

    const handleTakeAttendance = () => {
        setLoading(true)
        useFirebase('update_staff_attendance', {calendar: calendar, month: currentMonth})
            .then(() => {
                getStaffAttendance()
                toast.success('Điểm danh nhân viên thành công!')
            })
            .catch((err) => {
                console.log('err', err);
                toast.error('Điểm danh nhân viên thất bại!')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12 relative">
            <Card className="h-full w-full">
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <div className="flex justify-between">
                        <Typography variant="h6" color="white">
                            DANH SÁCH NHÂN VIÊN
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
                    <div className="absolute flex right-5 z-40 gap-2 justify-center rounded-lg p-1 items-center">
                        {openAttendance &&
                            <Button
                                className="flex items-center gap-3"
                                variant="text"
                                size="sm"
                                onClick={() => handleOpenAttendance(false)}
                            >
                                Cancel
                            </Button>
                        }
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={() => openAttendance ? handleTakeAttendance() : handleOpenAttendance(true)}
                        >
                            <CalendarIcon strokeWidth={2} className="w-4 h-4 text-white" />
                            {openAttendance ? 'Confirm' : 'Take attendance'}
                        </Button>
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={() => setOpenCreate(true)}
                        >
                            <PlusIcon strokeWidth={2} className="w-4 h-4 text-white" />
                            Create Staff
                        </Button>
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={() => openAttendance ? getStaffAttendance() : getStaffList()}
                        >
                            <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                        </Button>
                    </div>
                    {openAttendance ? (
                        <Attendance setCalendar={setCalendar} calendar={calendar} staffList={staffList}/>
                    ) : (
                        <StaffTable staffList={staffList} handleEditStaff={handleEditStaff} handleRemoveStaff={handleRemoveStaff}/>
                    )}
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    {/* <Typography variant="small" color="blue-gray" className="font-normal">
                        Page 1 of 10
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined" size="sm">
                            Previous
                        </Button>
                        <Button variant="outlined" size="sm">
                            Next
                        </Button>
                    </div> */}
                </CardFooter>
                {/* <ModalEditStudent open={openModalEdit} handleOpen={handleOpenEditStudent} objectEdit={objectEdit} /> */}
            </Card>
            <CreateStaff open={openCreate} staffInfo={editStaff} handleCallback={handleStaffCallback}/>
        </div>
    );
}

export default StaffList;

const StaffTable = ({ staffList, handleEditStaff, handleRemoveStaff }) => {
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const staffRef = useRef(staffList || [])
    const [staff, setStaff] = useState(staffList || [])
    // const [, updateState] = React.useState();
    // const forceUpdate = React.useCallback(() => updateState({}), [])

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(staffRef.current, ['full_name'], [isAsc ? 'asc' : 'desc'])
        setStaff([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    return (
        <table className="w-full pt-12 min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                {/* <tr className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 transition-colors hover:bg-blue-gray-200">
                <th colSpan={6}>
                    <Typography
                        variant="h2"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70 text-center p-2"
                    >
                        IDENTIFY
                    </Typography>
                </th>
                <th colSpan={20}>
                    <Typography
                        variant="h2"
                        color="blue-gray"
                        className="font-normal leading-none text-center opacity-70 p-2"
                    >
                        THÔNG TIN NHÂN SỰ
                    </Typography>
                </th>
            </tr> */}
                <tr>
                    {TABLE_HEAD.map((head, index) => (
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
                                {(index === 2) && (
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
                    ))}
                    <th
                        className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                    />
                </tr>
            </thead>
            <tbody>
                {staffList.map(
                    ({ id, academic, id_number, roles, end_date, note, department, phone, position, bank_number, bank_branch, working_status, email, full_name, isUpdate, dob, id_place, graduated_school, address, id_date, work_date }, key) => {
                        const className = `py-3 px-5 ${key === staffList.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                            }`;

                        return (
                            <tr key={id}>
                                <td className={className}>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {key + 1}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {phone}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {full_name}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {id_number}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {formatDate(id_date)}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {id_place}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {formatDate(dob)}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {address}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {email}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {roles?.toString()}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {department}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {bank_number}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {bank_branch}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {academic}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {graduated_school}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {working_status}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {formatDate(work_date)}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {formatDate(end_date)}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {note}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    {/* <IconButton variant="text" onClick={() => handleEditStaff(staffList[key])}>
                                        <PencilIcon className="h-4 w-4" />
                                    </IconButton> */}
                                    <Menu placement="left-start">
                                        <MenuHandler>
                                            <IconButton variant="text">
                                                <PencilIcon className="h-4 w-4" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => handleEditStaff(staffList[key])}>Edit</MenuItem>
                                            <MenuItem onClick={() => handleRemoveStaff(staffList[key])}>Remove</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </td>
                            </tr>
                        );
                    }
                )}
            </tbody>
        </table>
    )
}

const Attendance = ({open, handleCallback, staffList, classInfo, calendar, setCalendar}) => {

    return (
        <table className="w-full pt-12 min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                <tr>
                    <th className="bg-blue-gray-50/50 z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 p-4 transition-colors" />
                    {Object.keys(calendar).map((item, index) => (
                        <th
                            // onClick={() => handleSort(index)}
                            key={index}
                            className="odd:bg-blue-gray-50/50 z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 p-4 transition-colors"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center pb-1 gap-2 leading-none " + ((moment(item.day).format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {formatDate(item.day, 'dddd')}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={"text-center gap-2 leading-none " + ((moment(item.day).format('DDMMYYYY') == moment().format('DDMMYYYY')) ? ' font-bold' : 'opacity-70')}
                            >
                                {formatDate(item.day)}
                            </Typography>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {staffList?.map(
                    (staff, index) => {
                        const isLast = index === staffList.length - 1;
                        const classes = isLast
                            ? "py-2 px-4 odd:bg-blue-gray-50/50"
                            : "py-2 px-4 odd:bg-blue-gray-50/50 border-b border-blue-gray-50";
                        return (
                            <tr>
                                <td className={classes} style={{}}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {staff.full_name}
                                    </Typography>
                                </td>
                                {Object.values(calendar).map((dayAttendance, key) => {
                                    const handleAttendance = (option) => {
                                        dayAttendance[staff.id] = option
                                        // forceUpdate()
                                        setCalendar({...calendar});
                                    } 
                                    return (
                                        <td className={classes + ' text-center cursor-pointer'}>
                                            {dayAttendance[staff.id] === 1 ? (
                                                <CheckBoxIcon onClick={() => handleAttendance(2)} />
                                            ) : dayAttendance[staff.id] === 2 ? (
                                                <IndeterminateCheckBoxIcon onClick={() => handleAttendance(0)} />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon onClick={() => handleAttendance(1)} />
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    }
                )}
            </tbody>
        </table>
    )
}