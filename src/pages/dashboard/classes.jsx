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
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { orderBy } from 'lodash';
import { useFetch, useFirebase } from "../../utils/api/request";
import { useController } from "../../context";
import { ArrowPathIcon, PhoneIcon, PlusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import formatDate from "../../utils/formatNumber/formatDate";
import { CreateClasses } from "../../widgets/modal/create-class";

const Header = ['STT', 'Phone', 'Mã HS', 'Họ', 'Tên', 'Ngày sinh', "Email", 'Điểm', 'Ghi chú']

export function Class() {
    const [controller] = useController();
    const { userInfo } = controller;
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const tableRef = useRef([])
    const [classList, setClassList] = useState([])
    const [openList, setOpenList] = useState([])

    useEffect(() => {
        const classListRef = useStorage('get', 'classList', [])
        if (classListRef?.length === 0) getClassList()
        else {
            tableRef.current = classListRef
            setClassList(classListRef)
        }
    }, [])

    const getClassList = () => {
        setLoading(true)
        useFirebase('get_class_list')
            .then(data => {
                setLoading(false)
                // const groupedData = data?.reduce((acc, item) => {
                //     const id = item.id;
                //     acc[id] = acc[id] || [];
                //     acc[id].push(item);
                //     return acc;
                // }, {});
                // setList(groupedData)
                console.log('get_class_list', data);
                tableRef.current = data
                setClassList(data)
                // handleSort(1)
                useStorage('set', 'classList', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleUpdateClass = (ok, classList = []) => {
        console.log('handleMakePayment', ok, classList);
        setLoading(true)

        if (ok) {
            //
        }
        setOpenModal(false)
    }

    const handleOpenTable = (index) => {
        if (openList.includes(index)) setOpenList([...openList.filter(i => i !== index)])
        else {
            openList.push(index)
            setOpenList([...openList])
        }
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <div className="flex justify-between">
                        <Typography variant="h6" color="white">
                            DANH SÁCH LỚP
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[55vh]">
                    <div className="flex justify-end pr-4 gap-2">
                        <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenModal(true)}>
                            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Create new class
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
                            <ListItem>
                                <Accordion
                                    open={openList.includes(index)}
                                >
                                    <AccordionHeader
                                        onClick={() => handleOpenTable(index)}
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
                                                        Create at: 
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
            <CreateClasses open={openModal} handleOpen={setOpenModal} handleCallback={handleUpdateClass} />
        </div>
    );
}

export default Class;

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
                        ({ id, full_name, register_date, note }, key) => {
                            const className = `py-3 px-5 ${key === authorsTableData.length - 1
                                ? ""
                                : "border-b border-blue-gray-50"
                                }`;
                            return (
                                <>
                                    <tr key={key} className="odd:bg-blue-gray-50/50">
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {id}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {full_name}
                                            </Typography>
                                        </td>
                                        {/* <td className={className}>
                                                <Typography className="text-xs font-normal text-blue-gray-500">
                                                    {'LIFE'}
                                                </Typography>
                                                </td> */}
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {formatDate(register_date)}
                                            </Typography>
                                        </td>
                                        {/* <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {700.000}
                                            </Typography>
                                        </td> */}
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