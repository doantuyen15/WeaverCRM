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
} from "@material-tailwind/react";
import { useController } from "../../context";
import useStorage from "../../utils/localStorageHook";
import StaffInfo from "../../data/entities/staffInfo";
import { orderBy } from 'lodash'
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DefaultSkeleton, { TableSkeleton } from "../skeleton";
import { doc, getDoc } from "firebase/firestore";
import { StudentRow } from "../../pages/dashboard";
import { Attendance } from "./attendance";

const TABLE_HEAD = [
    // "Tình trạng đăng ký",
    "ID",
    "Họ",
    "Tên",
    "Ngày đăng ký",
    "Điểm",
    "Số điện thoại",
    "Ngày sinh",
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Advisor"
];

const Header = [
    // 'status_res',
    'id',
    "first_name",
    "last_name",
    'register_date',
    'has_score',
    'phone',
    'dob',
    'parent_phone',
    'address',
    'email',
    'referrer',
    'advisor',
    'writing',
    'reading',
    'speaking',
    'listening',
    'test_input_score'
]

export function ModalClassInfo({ open, data, handleOpen }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [loading, setLoading] = useState(false)
    const [newStaff, setNewStaff] = useState({})
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const tableRef = useRef([])
    const [openAttendance, setOpenAttendance] = useState(false)

    useEffect(() => {
        getStudent()
    }, [])

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, [Header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setStudentList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const getStudent = async() => {
        setLoading(true)
        const studentList = await Promise.all(data?.student_list.map(docRef => getDoc(docRef)))
        const items = studentList.map(i => {
           return {
            ...i.data(),
            id: i.id
           }
        })
        setStudentList(items)
        setTimeout(() =>
            setLoading(false),
        1000)
    }

    const updateStaffList = (key, value) => {
        if (key === 'roles' || key === 'roles_id') {
            if (newStaff[key]?.includes(value)) {
                const newRoles = newStaff[key]?.filter(item => item !== value)
                newStaff.updateInfo(key, newRoles)
            } else {
                newStaff.updateInfo(key, [...newStaff[key], value])
            }
        } else {
            newStaff.updateInfo(key, value)
            setNewStaff(newStaff)
        }
        forceUpdate()
    }

    const handleAttendance = () => {
        console.log('handleAttendance');
    }

    return (
        <>
            <Dialog
                size="lg"
                open={open}
                handler={() => {
                    // handleCallback(false)
                    handleOpen()
                }}
                className="bg-transparent shadow-none min-w-[80vw]"
            >
                <Card className="mx-auto w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none pb-6">
                        <div className="flex justify-center">
                            <Typography variant="h4" color="black">
                                Danh sách lớp {data.id}
                            </Typography>
                        </div>
                    </CardHeader>
                    <CardBody className="flex flex-col p-0 px-0 overflow-auto max-h-[70vh]">
                        {loading ? (
                            <div className="p-4">
                                <TableSkeleton />
                            </div>
                        ) : (
                            <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
                                <thead>
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
                                                    {(index === 0 || index === 1 || index === 3) && (
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
                                    {studentList?.map(
                                        (item, index) => {
                                            const isLast = index === studentList.length - 1;
                                            const classes = isLast
                                                ? "py-2 px-4"
                                                : "py-2 px-4 border-b border-blue-gray-50";
                                            return (
                                                <StudentRow
                                                    classes={classes}
                                                    item={item}
                                                    index={index}
                                                    hideColumn={true}
                                                    // handleEdit={handleEdit}
                                                    // handleRemove={handleRemove}
                                                />
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        )}
                    </CardBody>
                    <CardFooter className="pt-0 flex justify-end">
                        <div className="flex pt-4 gap-2">
                            <Button variant="text" size="sm"
                            // onClick={() => handleCallback(false)}
                            >
                                Thêm học sinh
                            </Button>
                            <Button
                                disabled={(newStaff.department_id === '' || newStaff.roles_id?.length === 0)}
                                variant="text"
                                size="sm"
                                // onClick={() => handleCallback(true, newStaff)}
                            >
                                Nhập điểm
                            </Button>
                            <Button variant="gradient" size="sm"
                            // onClick={() => handleCallback(false)}
                            >
                                Điểm danh
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Dialog>
            <Attendance open={openAttendance} handleCallback={handleAttendance}/>
        </>
    );
}