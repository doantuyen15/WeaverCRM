import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Switch,
    Button,
    CardFooter,
    List,
    ListItem,
    Accordion,
    AccordionHeader,
    AccordionBody,
    PopoverHandler,
    PopoverContent,
    Popover,
    Menu,
    MenuHandler,
    IconButton,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { orderBy } from 'lodash';
import { useFetch, useFirebase } from "../../utils/api/request";
import { useController } from "../../context";
import { ArrowPathIcon, MagnifyingGlassIcon, PhoneIcon, PlusIcon, UserPlusIcon, WrenchIcon } from "@heroicons/react/24/solid";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import formatDate from "../../utils/formatNumber/formatDate";
import { CreateClasses } from "../../widgets/modal/create-class";
import { glb_sv } from "../../service";
import FormatPhone from "../../utils/formatNumber/formatPhone";
import DefaultSkeleton from "../../widgets/skeleton";
import { TableScore } from "../../widgets/modal/table-score";
import { ClassTable } from "./classes";
import { toast } from "react-toastify";
import { CourseManagement } from "../../widgets/modal/course-management";

const Header = ['STT', 'Phone', 'Họ', 'Tên', 'Ngày sinh', "Email", 'Điểm', 'Ghi chú']

export function Programs() {
    const [controller] = useController();
    const { userInfo } = controller;
    const [openModal, setOpenModal] = useState(false)
    const [openCourseEdit, setOpenCourseEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const tableRef = useRef([])
    const [classList, setClassList] = useState([])
    const [objectEdit, setObjectEdit] = useState({})
    const [openList, setOpenList] = useState([])


    useEffect(() => {
        getClassList()
        // if (!glb_sv.classList) getClassList()
        // else {
        //     tableRef.current = glb_sv.classList
        //     setClassList(glb_sv.classList)
        // }
    }, [])

    const getClassList = () => {
        setLoading(true)
        useFirebase('get_class_list')
            .then(async data => {
                setLoading(false)
                // const groupedData = data?.reduce((acc, item) => {
                //     const id = item.id;
                //     acc[id] = acc[id] || [];
                //     acc[id].push(item);
                //     return acc;
                // }, {});
                // setList(groupedData)
                // console.log('get_class_list', await data[0].getStudentList());
                tableRef.current = data
                setClassList(data)
                // handleSort(1)
                glb_sv.classList = data
                // useStorage('set', 'classList', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleAddClasses = (ok, classList = []) => {
        console.log('add_classes', ok, classList);
        if (ok) {
            setLoading(true)
            useFirebase('add_classes', classList)
                .then(() => {
                    setLoading(false)
                    toast.success('Tạo lớp thành công, yêu cầu đang chờ duyệt!')
                    setOpenModal(false)
                })
                // .catch((err) => toast.error(err))
        } else {
            setOpenModal(false)
        }
    }

    const handleUpdateClass = (type, item) => {
        setLoading(true)
        if (type === 'update') {
            useFirebase('update_class_info', item)
            .then((res) => {
                toast.success('Cập nhật thông tin lớp học thành công!')
            })
            .catch((err) => toast.error('Lỗi: ' + err))
            .finally(() => {
                getClassList()
                setLoading(false)
            })
        } else {
            useFirebase('delete_class_info', item)
            .then((res) => {
                toast.success('Xoá lớp học thành công!')
            })
            .catch((err) => toast.error('Lỗi: ' + err))
            .finally(() => {
                getClassList()
                setLoading(false)
            })
        }

    }

    const handleSelectEdit = (item) => {
        setObjectEdit(item)
        setOpenModal(true)
    }

    const handleEditCallback = (ok, courses) => {
        console.log('handleEditCallback', ok, courses);
        if (!ok) {
            setOpenCourseEdit(false)
        } else {
            setLoading(true)
            useFirebase('update_course_info', courses)
                .then(() => {
                    toast.success('Cập nhật thành công!')
                })
                .catch(err => toast.error(err))
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <div className="flex justify-between">
                        <Typography variant="h6" color="white">
                            DANH SÁCH CÁC KHÓA HỌC
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[65vh]">
                    <div className="flex justify-end pr-4 gap-2">
                        <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenModal(true)}>
                            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Create new class
                        </Button>
                        {userInfo.ro}
                        <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenCourseEdit(true)}>
                            <WrenchIcon strokeWidth={2} className="h-4 w-4" /> Course modification
                        </Button>
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={() => getClassList()}
                        >
                            <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                        </Button>
                    </div>
                    <List>
                        {classList.map((item, index) => (
                            <ListItem ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
                                <Accordion
                                    // open={openList.includes(index)}
                                >
                                    <AccordionHeader
                                        // onClick={() => handleOpenTable(item, index)}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <Typography variant="h6" color="blue-gray">
                                                {item.id}
                                            </Typography>
                                            <div className="grid grid-rows-2 grid-flow-col gap-x-6">
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-1"
                                                    >
                                                        Start at: 
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-2 pl-6"
                                                    >
                                                        {formatDate(item.start_date)}
                                                    </Typography>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-1"
                                                    >
                                                        End at: 
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-2 pl-6"
                                                    >
                                                        {formatDate(item.end_date)}
                                                    </Typography>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow-0"
                                                    >
                                                        Teacher: 
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow pl-6"
                                                    >
                                                        {item.teacher}
                                                    </Typography>
                                                    <Tooltip content={item.teacher_phone || 'No phone'}>
                                                        <PhoneIcon
                                                            strokeWidth={2}
                                                            className="h-2.5 w-2.5 ml-1"
                                                        />
                                                    </Tooltip>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow-0"
                                                    >
                                                        Teacher 2: 
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow pl-6"
                                                    >
                                                        {item.sub_teacher}
                                                    </Typography>
                                                    <Tooltip content={item.sub_teacher_phone || 'No phone'}>
                                                        <PhoneIcon
                                                            strokeWidth={2}
                                                            className="h-2.5 w-2.5 ml-1"
                                                        />
                                                    </Tooltip>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow-0"
                                                    >
                                                        TA: 
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow pl-6"
                                                    >
                                                        {item.ta_teacher}
                                                    </Typography>
                                                    <Tooltip content={item.ta_teacher_phone || 'No phone'}>
                                                        <PhoneIcon
                                                            strokeWidth={2}
                                                            className="h-2.5 w-2.5 ml-1"
                                                        />
                                                    </Tooltip>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow-0"
                                                    >
                                                        CS: 
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 grow pl-6"
                                                    >
                                                        {item.cs_staff}
                                                    </Typography>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-1"
                                                    >
                                                        Total student:
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-2 pl-6"
                                                    >
                                                        {item.student_list?.length || 0}
                                                    </Typography>
                                                </div>
                                                <div className="flex">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-1"
                                                    >
                                                        Class schedule:
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold text-blue-gray-400 flex-2 pl-6"
                                                    >
                                                        {item.class_schedule}
                                                    </Typography>
                                                </div>
                                                <div className="row-span-2 h-full flex items-center">
                                                    <Menu placement="bottom-end">
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
                                                            <MenuItem onClick={() => handleSelectEdit(item)}>Edit</MenuItem>
                                                            <MenuItem onClick={() => handleUpdateClass('delete', item)}>Remove</MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionHeader>
                                    <AccordionBody>
                                        <ClassTable list={item.student_list} />
                                    </AccordionBody>
                                </Accordion>
                            </ListItem>
                        ))}
                    </List>
                </CardBody>
                {/* <CardFooter className="pt-0 gap-2 flex justify-end">
                    <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenPayment(true)}>
                        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Make a tuition payment
                    </Button>
                    <Button
                        className="flex items-center gap-3"
                        size="sm"
                        onClick={() => getStudentList()}
                    >
                        <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                    </Button>
                </CardFooter> */}
            </Card>
            <CreateClasses classInfo={objectEdit} setClassInfo={setObjectEdit} handleUpdateClass={handleUpdateClass} open={openModal} handleOpen={setOpenModal} handleCallback={handleAddClasses} />
            <CourseManagement loading={loading} open={openCourseEdit} handleCallback={handleEditCallback} />
        </div>
    );
}

export default Programs;