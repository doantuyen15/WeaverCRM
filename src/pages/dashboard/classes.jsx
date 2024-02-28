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
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { orderBy } from 'lodash';
import { useFetch, useFirebase } from "../../utils/api/request";
import { useController } from "../../context";
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PhoneIcon, PlusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import formatDate from "../../utils/formatNumber/formatDate";
import { CreateClasses } from "../../widgets/modal/create-class";
import { glb_sv } from "../../service";
import FormatPhone from "../../utils/formatNumber/formatPhone";
import DefaultSkeleton from "../../widgets/skeleton";
import { TableScore } from "../../widgets/modal/table-score";
import { AddStudentToClass } from "../../widgets/modal/add-student-class";
import { toast } from "react-toastify";
import { ModalClassInfo } from "../../widgets/modal/class-info";

const Header = ['STT', 'Phone', 'Họ', 'Tên', 'Ngày sinh', "Email", 'Điểm', 'Ghi chú']

export function Class() {
    const [controller] = useController();
    const { userInfo } = controller;
    const [openModal, setOpenModal] = useState(false)
    const [openModalClass, setOpenModalClass] = useState(false)
    const [loading, setLoading] = useState(false)
    const tableRef = useRef([])
    const [classList, setClassList] = useState([])
    const [openList, setOpenList] = useState([])
    const [dataClassIndex, setDataClassIndex] = useState(false)

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
                console.log('class', data);
                // handleSort(1)
                // glb_sv.classList = data
                // useStorage('set', 'classList', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleUpdateClass = (ok, classList = []) => {
        console.log('handleMakePayment', ok, classList);
        if (!ok) {
            setOpenModal(false)
            return
        }
        setLoading(true)
        useFirebase('add_student_classes', classList)
            .then(() => {
                setLoading(false)
                setOpenModal(false)
                toast.success("Add Success!")
            })
            .catch((error) => toast.error(error))
            // .finally(() => {

            // })
        // let updateClass = []
        // if (updateClass.length === 0) {
        //     toast.error('Danh sách học sinh thêm vào không được bỏ trống!')
        //     setLoading(false)
        // }
        // 
        // setOpenModal(false)
    }

    const handleClassList = (item, index) => {

        // console.log('handleOpenTable', item?.getStudentList());
        if (openList.includes(index)) setOpenList([...openList.filter(i => i !== index)])
        else {
            openList.push(index)
            setOpenList([...openList])
            return
        }
        // item?.getStudentList()
        //     .then((student_list) => {
        //         classList[index].updateInfo('student_list', student_list)
        //         setClassList([...classList])
        //     })
        //     .catch(e => console.error(e))
    }

    const handleOpenModal = (index) => {
        setDataClassIndex(index)
        setOpenModalClass(true)
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <div className="flex justify-between">
                        <Typography variant="h6" color="white">
                            DANH SÁCH CÁC LỚP
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[65vh]">
                    <div className="flex justify-end pr-4 gap-2">
                        {/* <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenModal(true)}>
                            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Add Student To Class
                        </Button> */}
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={() => getClassList()}
                        >
                            <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                        </Button>
                    </div>
                    <List>
                        {glb_sv.programs.map((item, index) => (
                            <ListItem ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
                                <Accordion
                                    open={openList.includes(index)}
                                >
                                    <AccordionHeader
                                        onClick={() => handleClassList(item, index)}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <Typography variant="h6" color="blue-gray">
                                                {item}
                                            </Typography>
                                            {openList.includes(index) ? (
                                                <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                                            ) : (
                                                <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                                            )}
                                        </div>
                                    </AccordionHeader>
                                    <AccordionBody>
                                        {classList.map((classInfo, index) => (
                                            classInfo.id.includes(item) ? <ClassInfo openModal={() => handleOpenModal(index)} item={classInfo} /> : null
                                        ))}
                                    </AccordionBody>
                                </Accordion>
                            </ListItem>
                        ))}
                    </List>
                </CardBody>
            </Card>
            {openModalClass ? <ModalClassInfo getClassList={getClassList} classList={classList} handleOpen={setOpenModalClass} open={openModalClass} data={classList[dataClassIndex]} /> : null}
            {/* <CreateClasses open={openModal} handleOpen={setOpenModal} handleCallback={handleUpdateClass} /> */}
        </div>
    );
}

export default Class;

export const ClassInfo = ({ item, openModal }) => {
    return (
        <>
            <div className="hover:bg-blue-gray-50 flex p-2 b justify-between items-center w-full border-b border-blue-gray-50"
                onClick={() => openModal()}
            >
                <Typography variant="h6" color="blue-gray">
                    {item.id}
                </Typography>
                <div className="grid grid-rows-2 grid-flow-col gap-x-6">
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                </div>
            </div>
        </>
    )
}

export const ClassTable = ({ list }) => {
    return (
        <>
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                    <tr>
                        {Header.map((el) => (
                            <th
                                key={el}
                                className="border-b border-blue-gray-50 py-3 px-5 text-left"
                            >
                                <Typography
                                    variant="small"
                                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                                >
                                    {el}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list?.map(
                        ({ first_name, last_name, phone, register_date, email, note, score }, key) => {
                            const className = `py-3 px-5 ${key === authorsTableData.length - 1
                                ? ""
                                : "border-b border-blue-gray-50"
                                }`;
                            return (
                                <>
                                    <tr key={key} className="hover:bg-blue-gray-50/50">
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {key + 1}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {FormatPhone(phone)}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {first_name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {last_name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {formatDate(register_date)}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {email}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Popover placement="top-start" 
                                                // open={openPopover} handler={() => {
                                                //     getStudentScore(item.id);
                                                //     setOpenPopover(prev => !prev);
                                                // }}
                                            >
                                                <PopoverHandler>
                                                    <MagnifyingGlassIcon strokeWidth={2} className="w-3.5 h-3.5 text-blue-gray-500 cursor-pointer" />
                                                </PopoverHandler>
                                                <PopoverContent className="z-[999999]">
                                                    <TableScore item={score} />
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {note}
                                            </Typography>
                                        </td>
                                    </tr>
                                </>
                            );
                        }
                    )}
                </tbody>
            </table>
        </>
    )
}