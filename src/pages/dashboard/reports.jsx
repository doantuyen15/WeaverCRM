import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon,  UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon, ArrowUturnDownIcon, ArrowPathIcon, PlusIcon, DocumentTextIcon, TableCellsIcon, RectangleGroupIcon, BanknotesIcon } from "@heroicons/react/24/solid";
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
import formatNum from "../../utils/formatNumber/formatNum";
import exportExcel from "../../utils/exportExcel";

const STUDENT_HEAD = [
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

const HEADER_TUITION = ['Mã HS', 'Tên', 'Ngày lập phiếu', 'Học phí tháng', 'Số tiền', 'Ghi chú']

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
    const tuitionTableRef = useRef([])
    const [tuitionTable, setTuitionTable] = useState([])
    const currentMonth = moment().format('MMYYYY')
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const courseTuition = useRef({})
    const [init, setInit] = useState(false)
    const [selectTime, setSelectTime] = useState('')
    const currentYear = moment().format('YYYY')
    const monthOfQuarter = {
        I: ['01' + currentYear, '02' + currentYear, '03' + currentYear],
        II: ['04' + currentYear, '05' + currentYear, '06' + currentYear],
        III: ['07' + currentYear, '08' + currentYear, '09' + currentYear],
        IV: ['10' + currentYear, '11' + currentYear, '12' + currentYear],
    }
    const monthOfYear = [...monthOfQuarter.I, ...monthOfQuarter.II, ...monthOfQuarter.III, ...monthOfQuarter.IV]
    const queryFinance = useRef(currentMonth)
    const [financeTable, setFinanceTable] = useState([])
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [objectDetail, setObjectDetail] = useState({})

    useEffect(() => {
        getStudentList()
    }, [])

    const getCourseTuition = () => {
        if (Object.keys(courseTuition.current).length > 0) return
        useFirebase('get_all_course', { getId: true })
            .then(data => {
                data.forEach(item => {
                    courseTuition.current[item.id] = item.data()
                })
            })
            .catch(err => console.log(err))
    }

    const getTuitionTable = (month) => {
        setLoading(true)
        useFirebase('get_tuition_table', month || [currentMonth])
            .then(data => {
                setLoading(false)
                tuitionTableRef.current = data
                setTuitionTable(data?.filter(item => item.type_id === 1))
                console.log('table', data?.filter(item => item.type_id === 1));
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

    const getFinanceTable = (month) => {
        setLoading(true)
        console.log('selectDate.current', month || [currentMonth]);
        useFirebase('query_finance_table', month || [currentMonth])
          .then(data => {
            setLoading(false)
            console.log('query_finance_table', data);
            setFinanceTable(data)
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

    const handleOpenModalDetail = (item) => {
        setOpenModalDetail(true)
        setObjectDetail(item)
      }

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none pb-6">
                <div className="mb-4 flex items-center justify-between gap-8">
                    <div>
                        {/* <Typography variant="h5" color="blue-gray">
                            Report
                        </Typography> */}
                        <Typography variant="h5" color="blue-gray" className="mt-1 font-bold">
                            Export reports
                        </Typography>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0 px-0 overflow-auto max-h-[70vh]">
                <Tabs value={mod}>
                    {userInfo.roles.includes(['1']) ? (
                        <TabsHeader className="max-w-max mx-auto">
                            <Tab value="score" className="w-48 h-10">
                                <TableCellsIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                Score
                            </Tab>
                            <Tab onClick={() => {
                                // getCourseTuition()
                                if (!init) {
                                    getTuitionTable([currentMonth])
                                    setInit(true)
                                }
                            }} value="tuition" className="w-48 h-10">
                                <BanknotesIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                Tuition
                            </Tab>
                            <Tab onClick={() => {
                                if (!init) {
                                    getFinanceTable([currentMonth])
                                    setInit(true)
                                }
                            }} value="finance" className="w-48 h-10">
                                <AttachMoneyIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                Finance
                            </Tab>
                        </TabsHeader>
                    ) : null}
                    <TabsBody>
                        <TabPanel key={'score'} value={'score'}>
                            <div className="flex justify-between items-center">
                                <div className="w-full md:w-72 mb-2">
                                    <Input
                                        className=""
                                        placeholder="Student name"
                                        label="Search student"
                                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="h-8"
                                    size="sm"
                                    onClick={() => getTuitionTable([selectedMonth])}
                                >
                                    <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                                </Button>
                            </div>
                            <div className="flex flex-col p-0 px-0 overflow-auto max-h-[55vh]">
                                <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
                                    <thead>
                                        <tr>
                                            {STUDENT_HEAD.map((head, index) => (
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
                            </div>
                        </TabPanel>
                        <TabPanel key={'tuition'} value={'tuition'}>
                            <div className="grid grid-cols-4">
                                <div className="flex col-start-2 col-span-2 mb-2">
                                    <Menu>
                                        <MenuHandler>
                                            <Button
                                                size="md"
                                                ripple={false}
                                                // onClick={() => setSelectQuarter(prev => !prev)}
                                                // color={email ? "gray" : "blue-gray"}
                                                // disabled={!email}
                                                className="rounded-r-none min-w-max"
                                            >
                                                {selectTime ? selectTime : 'Other'}
                                            </Button>
                                        </MenuHandler>
                                        <MenuList onClick={() => setSelectedMonth('')}>
                                            <MenuItem onClick={() => {
                                                getTuitionTable(monthOfQuarter.I)
                                                setSelectedMonth(monthOfQuarter.I)
                                                setSelectTime('Quarter I')
                                            }}>Quarter I</MenuItem>
                                            <MenuItem onClick={() => {
                                                getTuitionTable(monthOfQuarter.II)
                                                setSelectedMonth(monthOfQuarter.II)
                                                setSelectTime('Quarter II')
                                            }}>Quarter II</MenuItem>
                                            <MenuItem onClick={() => {
                                                getTuitionTable(monthOfQuarter.III)
                                                setSelectedMonth(monthOfQuarter.III)
                                                setSelectTime('Quarter III')
                                            }}>Quarter III</MenuItem>
                                            <MenuItem onClick={() => {
                                                getTuitionTable(monthOfQuarter.IV)
                                                setSelectedMonth(monthOfQuarter.IV)
                                                setSelectTime('Quarter IV')
                                            }}>Quarter IV</MenuItem>
                                            <MenuItem onClick={() => {
                                                getTuitionTable(monthOfYear)
                                                setSelectedMonth(monthOfYear)
                                                setSelectTime('Year')
                                            }}>Year</MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <Input
                                        type="month"
                                        value={moment(selectedMonth, 'MMYYYY').format('YYYY-MM')}
                                        onChange={(e) => {
                                            if (!e.target.value) setSelectedMonth(moment().format('MMYYYY'))
                                            else setSelectedMonth(moment(e.target.value, 'YYYY-MM').format('MMYYYY'))
                                            getTuitionTable([moment(e.target.value, 'YYYY-MM').format('MMYYYY')])
                                            setSelectTime('Other')
                                        }}
                                        className="rounded-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        containerProps={{
                                            className: "min-w-0",
                                        }}
                                    />
                                    <Button
                                        size="md"
                                        ripple={false}
                                        // color={email ? "gray" : "blue-gray"}
                                        // disabled={!email}
                                        onClick={() => {
                                            console.log('click export', tuitionTable);
                                            exportExcel({reportName: 'tuition', data: tuitionTable})
                                        }}
                                        className="rounded-l-none"
                                    >
                                        Export
                                    </Button>
                                </div>
                                <div className="col-start-4 justify-self-end self-center">
                                    <Button
                                        className="h-8"
                                        size="sm"
                                        onClick={() => getTuitionTable(selectedMonth)}
                                    >
                                        <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col p-0 px-0 overflow-auto max-h-[55vh]">
                                <TuitionTable tuitionTable={tuitionTable} setTuitionTable={setTuitionTable} courseTuition={courseTuition.current} />
                            </div>
                        </TabPanel>
                        <TabPanel key={'finance'} value={'finance'}>
                            <div className="grid grid-cols-4">
                                <div className="flex col-start-2 col-span-2 mb-2">
                                    <Menu>
                                        <MenuHandler>
                                            <Button
                                                size="md"
                                                ripple={false}
                                                className="rounded-r-none min-w-max"
                                            >
                                                {selectTime ? selectTime : 'Other'}
                                            </Button>
                                        </MenuHandler>
                                        <MenuList onClick={() => setSelectedMonth('')}>
                                            <MenuItem onClick={() => {
                                                getFinanceTable(monthOfQuarter.I)
                                                setSelectTime('Quarter I')
                                                setSelectedMonth(monthOfQuarter.I)
                                            }}>Quarter I</MenuItem>
                                            <MenuItem onClick={() => {
                                                getFinanceTable(monthOfQuarter.II)
                                                setSelectTime('Quarter II')
                                                setSelectedMonth(monthOfQuarter.II)
                                            }}>Quarter II</MenuItem>
                                            <MenuItem onClick={() => {
                                                getFinanceTable(monthOfQuarter.III)
                                                setSelectTime('Quarter III')
                                                setSelectedMonth(monthOfQuarter.III)
                                            }}>Quarter III</MenuItem>
                                            <MenuItem onClick={() => {
                                                getFinanceTable(monthOfQuarter.IV)
                                                setSelectTime('Quarter IV')
                                                setSelectedMonth(monthOfQuarter.IV)
                                            }}>Quarter IV</MenuItem>
                                            <MenuItem onClick={() => {
                                                getFinanceTable(monthOfYear)
                                                setSelectTime('Year')
                                                setSelectedMonth(monthOfYear)
                                            }}>Year</MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <Input
                                        type="month"
                                        value={moment(selectedMonth, 'MMYYYY').format('YYYY-MM')}
                                        onChange={(e) => {
                                            if (!e.target.value) setSelectedMonth(moment().format('MMYYYY'))
                                            else setSelectedMonth(moment(e.target.value, 'YYYY-MM').format('MMYYYY'))
                                            getFinanceTable([moment(e.target.value, 'YYYY-MM').format('MMYYYY')])
                                            setSelectTime('Other')
                                        }}
                                        className="rounded-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        containerProps={{
                                            className: "min-w-0",
                                        }}
                                    />
                                    <Button
                                        size="md"
                                        ripple={false}
                                        // color={email ? "gray" : "blue-gray"}
                                        // disabled={!email}
                                        onClick={() => {
                                            console.log('click export', tuitionTable, selectTime, selectedMonth);
                                            exportExcel({reportName: 'finance', data: financeTable, info: {time: selectTime === 'Other' || !selectTime ? selectedMonth : (selectTime + ' - ' + moment().format('YYYY'))}})
                                        }}
                                        className="rounded-l-none"
                                    >
                                        Export
                                    </Button>
                                </div>
                                <div className="col-start-4 justify-self-end self-center">
                                    <Button
                                        className="h-8"
                                        size="sm"
                                        onClick={() => getFinanceTable([selectedMonth])}
                                    >
                                        <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col p-0 px-0 overflow-auto max-h-[55vh]">
                                <FinanceTable openModalDetail={handleOpenModalDetail} financeData={financeTable} />
                            </div>
                        </TabPanel>
                    </TabsBody>
                </Tabs>
            </CardBody>
            {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                </CardFooter> */}

            <ModalFinanceDetail open={openModalDetail} handleOpen={setOpenModalDetail} data={objectDetail} />
            
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
    );
}
import ExcelJS from 'exceljs'
import { FinanceTable, ModalFinanceDetail } from "./finance";

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
                <Menu placement="start-end">
                    <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray">
                            <DocumentTextIcon
                                // onClick={() => exportExcel({ reportName: 'score', data: item })}
                                className="w-5 h-5"
                            />
                        </IconButton>
                    </MenuHandler>
                    <MenuList>
                        {item.score_table.map((data, index) => (
                            <MenuItem onClick={() => exportExcel({ reportName: data.term ? 'score' : 'score_test', data: data, info: item })}>
                                {data.class_id + ' - ' + (data.term || 'đầu vào')}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
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

const TuitionTable = ({ tuitionTable, setTuitionTable, courseTuition }) => {
    const [keySort, setKeySort] = useState('')
    const [isAsc, setIsAsc] = useState(true)
    const tableRef = useRef(tuitionTable)

    const handleSortTuition = (indexCol) => {
        let sorted
        const searchCol = indexCol == 1 ? 'customer' : indexCol == 2 ? 'create_date' : indexCol == 3 ? 'tuition_date' : ''
        sorted = orderBy(tuitionTable, searchCol, [isAsc ? 'asc' : 'desc'])
        setTuitionTable([...sorted])
        setKeySort(indexCol)
        setIsAsc(prev => !prev)
    }

    return (
        <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
            <thead>
                <tr>
                    {HEADER_TUITION.map((head, index) => (
                        <th
                            onClick={() => handleSortTuition(index)}
                            key={head}
                            className="z-10 sticky top-0 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-4 transition-colors hover:bg-blue-gray-200"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                {head}{" "}
                                {(index === 1 || index === 2 || index === 3) && (
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
                {tuitionTable?.map(
                    (item, index) => {
                        // const [program, level, id] = item.class_id.split('_')
                        // const tuitionDefault = courseTuition[program]?.[level]?.['tuition']
                        const isLast = index === tuitionTable.length - 1;
                        const classes = isLast
                            ? "py-2 px-4"
                            : "py-2 px-4 border-b border-blue-gray-50";
                        return (
                            <tr key={index} className="even:bg-blue-gray-50/50">
                                {/* <td className={classes + ' cursor-pointer'}>
                                    <DocumentTextIcon
                                        onClick={() => exportExcelScore(item)}
                                        className="w-5 h-5"
                                    />
                                </td> */}
                                <td className={classes}>
                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                        {item.customer_id}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography className={`text-xs font-normal ${!item.amount ? 'text-red-500' : 'text-blue-gray-500'}`}>
                                        {item.customer}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {item.create_date ? formatDate(item.create_date) : ''}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography className="text-xs font-normal text-blue-gray-600">
                                        {item.tuition_date ? moment(item.tuition_date, 'MMYYYY').format('MMMM - YYYY') : ''}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography className="text-xs font-semibold text-blue-gray-500">
                                        {/* {!item.amount ? formatNum(tuitionDefault, 0, 'price') : formatNum(tuitionDefault - item.amount, 0, 'price')} */}
                                        {formatNum(item.amount, 0, 'price')}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                        {item.explain}
                                    </Typography>
                                </td>
                            </tr>
                        );
                    },
                )}
            </tbody>
        </table>
    )
}