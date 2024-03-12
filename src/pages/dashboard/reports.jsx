import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon, ArrowUturnDownIcon, ArrowPathIcon, PlusIcon, DocumentTextIcon, TableCellsIcon, RectangleGroupIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    AccordionHeader,
    Accordion,
    AccordionBody,
    Popover,
    PopoverContent,
    PopoverHandler,
    TabsBody,
    TabPanel
} from "@material-tailwind/react";
import { ModalConfirmUpdate } from "../../widgets/modal/confirm-update-student";
import { orderBy } from 'lodash'
import StudentInfo from "../../data/entities/studentInfo";
import { ModalEditStudent } from "../../widgets/modal/edit-student";
import { useFetch, useFirebase } from "../../utils/api/request";
import { useController } from "../../context";
import moment from "moment";
import formatPhone from "../../utils/formatNumber/formatPhone";
import DayPickerInput from "../../widgets/daypicker/daypicker-input";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import { toast } from "react-toastify";
import formatDate from "../../utils/formatNumber/formatDate";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputMask from 'react-input-mask';
import DefaultSkeleton from '../../widgets/skeleton/index'
import { glb_sv } from "../../service";
import exportExcelScore from "../../utils/exportExcel/exportScore";
import exportExcel from "../../utils/exportExcel";

const TABLE_HEAD = [
    "Export",
    "ID",
    "Họ",
    "Tên",
    "Ngày đăng ký",
    "Chương trình học/lớp",
    "Điểm",
    "Số điện thoại",
    "Ngày sinh",
    "Số điện thoại phụ",
    "Địa chỉ",
    "Email",
    "Người giới thiệu",
    "Advisor",
    "Note"
];

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
        color: 'gray'
    }
]

const Header = [
    'status_res', //0
    'id', //1
    "first_name",
    "last_name",
    'register_date',
    'class_id',
    'has_score',
    'phone',
    'dob',
    'parent_phone',
    'address',
    'email', //11
    'referrer',
    'advisor',
    'note'//14
        // 'writing',
    // 'reading',
    // 'speaking',
    // 'listening',
    // 'grammar',
    // 'total',
]

const HeaderScore = [
    '',
    'Semester',
    'Grammar',
    'Listening',
    'Speaking',
    'Reading',
    'Writing',
    'Total',
    'Time'
]

const HeaderTuition = ['Mã HS', 'Tên', 'Ngày đóng', 'Số tiền còn lại', 'Ghi chú']

export default function ReportScore() {
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [studentList, setStudentList] = useState([])
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [objectNew, setObjectNew] = useState([])
    const [objectEdit, setObjectEdit] = useState([])
    const [loading, setLoading] = useState(false)
    const [onAdd, setOnAdd] = useState(false)
    const focusRef = useRef(null)
    const tableRef = useRef([])
    const [editMode, setEditMode] = useState(false)
    const [editKey, setEditKey] = useState([])
    const [openScore, setOpenScore] = useState(-1)
    const [openPayment, setOpenPayment] = useState(false)
    const [controller] = useController();
    const { userInfo } = controller;
    const currentEditKey = useRef({})    
    const [mod, setMod] = useState('score')
    const tuitionTable = useRef([])
    const [classStudentList, setClassStudentList] = useState([])
    const currentMonth = moment().format('MMYYYY')

    useEffect(() => {
        getStudentList()
    }, [])

    const getTuitionTable = (month = '') => {
        setLoading(true)
        useFirebase('get_tuition_table', month || currentMonth)
            .then(data => {
                setLoading(false)
                tuitionTable.current = data
                // useStorage('set', 'classList', data)
                console.log('getTuitionTable', data);
                // setClassStudentList(list.map(item => {
                //     return {
                //       ...item,
                //       ...classTuition[item.id]
                //     }
                // }
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const getStudentList = () => {
        setLoading(true)
        useFirebase('get_student')
            .then(data => {
                console.log('getStudentList', data);
                tableRef.current = data
                setStudentList(data)
                // useStorage('set', 'studentInfo', data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const handleAddStudent = () => {
        setOnAdd(true)
        const list = [...objectNew]
        const newStudent = new StudentInfo()
        list.push(newStudent)
        setObjectNew(list)
    }

    const handleCancelAdd = (removeIndex) => {
        setObjectNew(objectNew.filter((item, index) => index !== removeIndex))
    }

    const handleSearch = (searchValue) => {
        try {
            var search = tableRef.current.filter(item => item.full_name.toLowerCase().includes(searchValue.toLowerCase()));
            setStudentList(search)
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleSort = (indexCol) => {
        let sorted
        sorted = orderBy(tableRef.current, [Header[indexCol]], [isAsc ? 'asc' : 'desc'])
        setStudentList([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    const handleConfirmCallback = (ok) => {
        if (ok) {
            sendRequestAddStudent()
        } else {
            setOpenModalConfirm(false)
        }
    }

    const handleEdit = (item, index) => {
        objectEdit.push(item)
        currentEditKey.current = {
            ...currentEditKey.current,
            [index]: objectEdit?.length - 1
        }
        setObjectEdit(objectEdit)
        editKey.push(index)
        setEditKey([...editKey])
        setEditMode(true)
    }

    const sendRequestAddStudent = () => {
        setLoading(true)
        if (objectNew.length > 0) {
            useFirebase('add_student', objectNew)
                .then(() => {
                    toast.success("Thêm học viên thành công! Yêu cầu đang chờ duyệt")
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Thêm học viên không thành công! Lỗi: ${err}`)
                })
                .finally(() => {
                    setObjectNew([])
                    setLoading(false)
                    setOpenModalConfirm(false)
                })
        }
        if (objectEdit.length > 0) {
            console.log('objectEdit', objectEdit);
            useFirebase('update_student', objectEdit)
                .then(() => {
                    toast.success("Sửa thông tin học viên thành công! Yêu cầu đang chờ duyệt")
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Sửa thông tin học viên không thành công! Lỗi: ${err}`)
                })
                .finally(() => {
                    setObjectEdit([])
                    setLoading(false)
                    setOpenModalConfirm(false)
                })
        }
    }

    const handleRemove = () => {
        console.log('handleRemove');
        // setAlertModal(true)
    }

    return (
        <>

            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none pb-6">
                    <div className="mb-4 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Report
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                Export reports to Excel 
                            </Typography>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
                    <div className="flex right-0 top-30 absolute items-center justify-end gap-4">
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={() => getStudentList()}
                        >
                            <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                        </Button>
                    </div>
                    <Tabs value={mod}>
                        <TabsHeader className="max-w-max mx-auto">
                            <Tab value="score" className="w-48 h-10">
                                <TableCellsIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                Score
                            </Tab>
                            <Tab onClick={() => getTuitionTable()} value="tuition" className="w-48 h-10">
                                <BanknotesIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                Tuition
                            </Tab>
                        </TabsHeader>
                        <TabsBody>
                            <TabPanel key={'score'} value={'score'}>
                                <div className="w-full md:w-72 mb-2">
                                    <Input
                                        className=""
                                        placeholder="Student name"
                                        label="Search student"
                                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
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
                                                        {(index === 1 || index === 3) && (
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentList?.map(
                                            (item, index) => {
                                                const testScore = item.score_table.find(item => item.class_id === 'test') || {}
                                                const isLast = index === studentList.length - 1;
                                                const classes = isLast
                                                    ? "py-2 px-4"
                                                    : "py-2 px-4 border-b border-blue-gray-50";
                                                return (
                                                    <StudentRow
                                                        classes={classes}
                                                        item={item}
                                                        index={index}
                                                        handleEdit={handleEdit}
                                                        handleRemove={handleRemove}
                                                    />
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </TabPanel>
                            <TabPanel key={'treemap'} value={'treemap'}>
                                {/* <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0" >
                                    <thead>
                                        <tr>
                                            {HeaderTuition.map((el) => (
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
                                        {classStudentList?.map(({ id, full_name, tuition, date, note }, index) => {
                                            // const { tuition, date, note } = (tuiList || []).find(item => item.id_student === id) || {};
                                            const className = `py-3 px-5 ${index === authorsTableData.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50"
                                                }`;
                                            // if ((tuitionDefault - tuition === 0) && !filterTuition) return (<></>)
                                            return (
                                                <tr key={index}>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {id}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className={`text-xs font-normal ${!tuition ? 'text-red-500' : 'text-blue-gray-500'}`}>
                                                            {full_name}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-normal text-blue-gray-600">
                                                            {date ? formatDate(date) : ''}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-500">
                                                            {typeof tuition === 'number' ? formatNum(tuitionDefault - tuition, 0, 'price') : formatNum(tuitionDefault, 0, 'price')}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {note}
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table> */}
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </CardBody>
                {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                </CardFooter> */}
                <ModalConfirmUpdate
                    open={openModalConfirm}
                    handleOpen={setOpenModalConfirm}
                    objectNew={objectNew}
                    objectEdit={objectEdit}
                    handleConfirmCallback={handleConfirmCallback}
                    loading={loading}
                    StudentRow={StudentRow}
                />
            </Card>
        </>
    );
}
import ExcelJS from 'exceljs'

const StudentRow = ({ hideColumn = false, classes, index, item, handleEdit = () => { }, handleRemove = () => { }, isConfirm = false }) => {
    const [controller] = useController();
    const { userInfo } = controller;
    const [openPopover, setOpenPopover] = React.useState(false);
    const [scoreTable, setScoreTable] = useState([])
    const [loading, setLoading] = useState(false)

    const TableScore = ({scoreTable = []}) => {
        return (
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
                    {scoreTable.map((score, index) => {
                        return (
                            <tr key={'scorebody'}>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.class_id?.toUpperCase() || 'Test'}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {glb_sv.semester.MAP[score.term]}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.grammar}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.listening}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {score.speaking}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {score.reading}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {score.writing}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {score.total}
                                    </Typography>
                                </td>
                                <td className='p-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {formatDate(score.update_time, 'DD/MM/YYYY')}
                                    </Typography>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    // function handleImport() {
    //     const wb = new Excel.Workbook();
    //     const reader = new FileReader()
      
    //     reader.readAsArrayBuffer(this.file)
    //     reader.onload = () => {
    //       const buffer = reader.result;
    //       wb.xlsx.load(buffer).then(workbook => {
    //         console.log(workbook, 'workbook instance')
    //         workbook.eachSheet((sheet, id) => {
    //           sheet.eachRow((row, rowIndex) => {
    //             console.log(row.values, rowIndex)
    //           })
    //         })
    //       })
    //     }
    //   }

    return (
        <tr key={index} className="even:bg-blue-gray-50/50">
            <td className={classes + ' cursor-pointer'}>
                <DocumentTextIcon
                    onClick={() => exportExcel({reportName: 'score', data: item})}
                    className="w-5 h-5"
                />
            </td>
            <td className={classes}>
                <div className="flex flex-col">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                    >
                        {item.id}
                    </Typography>
                </div>
            </td>
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {item.first_name}
                </Typography>
            </td>
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {item.last_name}
                </Typography>
            </td>
            <td className={classes}>
                <div className="flex flex-col">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                    >
                        {formatDate(item.register_date)}
                    </Typography>
                </div>
            </td>
            <td className={classes}>
                <div className="flex flex-row">
                    {item.class_id.map((id, indexClassID) => {
                        const isLast = indexClassID === item.class_id?.length - 1;
                        return (
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {id}{!isLast && ', '}
                            </Typography>
                        )
                    })}

                </div>
            </td>
            {item.score_table?.length > 1 || item.has_score ? (
                <td className={classes}>
                    <Popover placement="top-start" open={openPopover} handler={() => {
                        // getStudentScore(item.id);
                        setOpenPopover(prev => !prev);
                    }}>
                        <PopoverHandler>
                            <MagnifyingGlassIcon strokeWidth={2} className="w-3.5 h-3.5 cursor-pointer" />
                        </PopoverHandler>
                        <PopoverContent className="z-[999999]">
                            {loading ? (
                                <DefaultSkeleton />
                            ) : (
                                <TableScore scoreTable={item.score_table}/>
                            )}
                        </PopoverContent>
                    </Popover>
                </td>
            ) : <td/>}
            <td className={classes}>
                <div className="flex flex-col">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                    >
                        {formatPhone(item.phone)}
                    </Typography>
                </div>
            </td>
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {formatDate(item.dob)}
                </Typography>
            </td>
            <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                    {formatPhone(item.parent_phone)}
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
                    {item.note}
                </Typography>
            </td>
        </tr>
    )
}