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

const academic = glb_sv.academic

const department = glb_sv.department

const roles = glb_sv.roles

export function CreateStaff({ open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    const [loading, setLoading] = useState(false)
    const [newStaff, setNewStaff] = useState({})
    const [tuition, setTuition] = useState(useStorage('get', 'tuition') || [])
    const [studentList, setStudentList] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        const newStaffRef = new StaffInfo({})
        setNewStaff(newStaffRef)
    }, [])

    const updateStaffList = (key, value) => {
        if (key === 'roles' || key === 'roles_id') {
            if (newStaff[key]?.includes(value)) {
                const newRoles= newStaff[key]?.filter(item => item !== value)
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
                    <CardBody className="flex flex-col">
                        <div className="flex py-4 border-b border-blue-gray-50 items-center">
                            <div className="flex w-full grid grid-cols-3 gap-6">
                                <div className="grid gap-x-1 gap-y-3">
                                    <Typography variant="h6" color="black">
                                        IDENTIFY
                                    </Typography>
                                    <Input
                                        variant="outlined"
                                        label="Phone"
                                        value={newStaff.phone}
                                        onChange={(e) => updateStaffList('phone', e.target.value)}
                                    />
                                    <Input
                                        variant="outlined"
                                        label="Tên nhân viên"
                                        value={newStaff.full_name}
                                        onChange={(e) => updateStaffList('full_name', e.target.value)}
                                    />
                                    <Input
                                        variant="outlined"
                                        label="Số CCCD/CMND"
                                        value={newStaff.id_number}
                                        onChange={(e) => updateStaffList('id_number', e.target.value)}
                                    />
                                    <Input
                                        type="date"
                                        variant="outlined"
                                        label="Ngày cấp"
                                        value={formatDate(newStaff.id_date, 'YYYY-MM-DD')}
                                        onChange={(e) => updateStaffList('id_date', formatDate(e.target.value))}
                                    />
                                    <Input
                                        variant="outlined"
                                        label="Nơi cấp"
                                        value={newStaff.id_place}
                                        onChange={(e) => updateStaffList('id_place', e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-x-1 col-span-2 gap-y-3">
                                    <Typography variant="h6" color="black">
                                        THÔNG TIN NHÂN SỰ
                                    </Typography>
                                    <div className="grid gap-x-1 grid-cols-2 gap-y-3">
                                        <Input
                                            type="date"
                                            variant="outlined"
                                            label="Ngày sinh"
                                            value={formatDate(newStaff.dob, 'YYYY-MM-DD')}
                                            onChange={(e) => updateStaffList('dob', formatDate(e.target.value))}
                                        />
                                        <Input
                                            variant="outlined"
                                            label="Email"
                                            value={newStaff.email}
                                            onChange={(e) => updateStaffList('email', e.target.value)}
                                        />
                                        <Input
                                            variant="outlined"
                                            label="Address"
                                            value={newStaff.address}
                                            onChange={(e) => updateStaffList('address', e.target.value)}
                                        />
                                        <Select
                                            value={newStaff.roles?.toString()}
                                            label="Chức vụ"
                                            selected={(element) =>
                                                // (element) &&
                                                <Typography className="max-w-[200px] text-xs overflow-hidden font-normal text-blue-gray-600 pointer-events-none">
                                                    {newStaff.roles?.toString()}
                                                </Typography>
                                                // React.cloneElement(element, {
                                                //     disabled: true,
                                                //     className:
                                                //         "flex truncate items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                // })
                                            }
                                        >
                                            {roles.map((item, id) => (
                                                <Option
                                                    // onClick={(e) => e.stopPropagation()}
                                                    key={item} value={item} className="flex items-center gap-1"
                                                >
                                                    <div className="flex w-full items-center" onClick={(e) => {
                                                        e.stopPropagation()
                                                        updateStaffList('roles', item)
                                                        updateStaffList('roles_id', id)
                                                    }}>
                                                        <Checkbox
                                                            className="w-4 h-4" checked={newStaff.roles?.includes(item)} />
                                                        {item}
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Phòng"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {department.map((item, id) => (
                                                <Option onClick={() => {
                                                    updateStaffList('department', item)
                                                    updateStaffList('department_id', id)
                                                }} 
                                                key={item} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Input
                                            variant="outlined"
                                            label="STK Ngân hàng"
                                            value={newStaff.bank_number}
                                            onChange={(e) => updateStaffList('bank_number', e.target.value)}
                                        />
                                        <Input
                                            variant="outlined"
                                            label="Chi nhánh ngân hàng"
                                            value={newStaff.bank_branch}
                                            onChange={(e) => updateStaffList('bank_branch', e.target.value)}
                                        />
                                        <Select
                                            label="Trình độ học vấn"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {academic.map((item, id) => (
                                                <Option onClick={() => {
                                                    updateStaffList('academic', item)
                                                    updateStaffList('academic_id', id)
                                                }} 
                                                key={item} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Input
                                            variant="outlined"
                                            label="Tốt nghiệp trường"
                                            value={newStaff.graduated_school}
                                            onChange={(e) => updateStaffList('graduated_school', e.target.value)}
                                        />
                                        <Select
                                            label="Trạng thái làm việc"
                                            selected={(element) =>
                                                element &&
                                                React.cloneElement(element, {
                                                    disabled: true,
                                                    className:
                                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                                })
                                            }
                                        >
                                            {['Còn làm việc', 'Đã nghỉ', 'Chưa làm việc'].map((item, id) => (
                                                <Option onClick={() => {
                                                    updateStaffList('working_status', item)
                                                    updateStaffList('working_status_id', id)
                                                }} 
                                                key={item} value={item} className="flex items-center gap-2">
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Input
                                            type="date"
                                            variant="outlined"
                                            label="Ngày bắt đầu"
                                            value={formatDate(newStaff.work_date, 'YYYY-MM-DD')}
                                            onChange={(e) => updateStaffList('work_date', formatDate(e.target.value))}
                                        />
                                        <Input
                                            type="date"
                                            variant="outlined"
                                            label="Ngày kết thúc"
                                            value={formatDate(newStaff.end_date, 'YYYY-MM-DD')}
                                            onChange={(e) => updateStaffList('end_date', formatDate(e.target.value))}
                                        />
                                        <div className="col-span-2">
                                            <Input
                                                variant="outlined"
                                                label="Ghi chú"
                                                value={newStaff.note}
                                                onChange={(e) => updateStaffList('note', e.target.value)}
                                            />
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
                                disabled={(newStaff.department_id === '' || newStaff.roles_id?.length === 0)}
                                variant="gradient"
                                onClick={() => handleCallback(true, newStaff)}
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