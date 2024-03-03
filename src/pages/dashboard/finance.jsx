import React, { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, UserPlusIcon, ArrowUpTrayIcon, BackwardIcon, ArrowUturnLeftIcon, ArrowUturnDownIcon, ArrowPathIcon, PlusIcon, DocumentTextIcon, TableCellsIcon, RectangleGroupIcon, BanknotesIcon, PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
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
import { FinancePopup } from "../../widgets/modal/finance-popup";
import formatNum from "../../utils/formatNumber/formatNum";

const TABLE_HEAD = [
  'STT',
  'Mã phiếu',
  'Loại phiếu',
  'Diễn giải',
  'Quỹ',
  'Giá trị',
  'Người xét duyệt'
];

const BillType = [
  'Phiếu thu',
  'Phiếu chi'
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

export default function Finance() {
  const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
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
  const [mod, setMod] = useState('month')
  const [financeTable, setFinanceTable] = useState([])
  const financeTableRef = useRef([])
  const currentMonth = moment().format('MMYYYY')
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMYYYY'))
  const [openModal, setOpenModal] = useState(false)
  const [isPayment, setIsPayment] = useState(false)
  const [totalPay, setTotalPay] = useState(0)
  const [totalReceive, setTotalReceive] = useState(0)

  useEffect(() => {
    // getStudentList()
    getFinanceTable()
  }, [])

  const getFinanceTable = (date = '') => {
    setLoading(true)
    useFirebase('get_finance_table', currentMonth)
      .then(data => {
        setLoading(false)
        if (data) {
          const convert =
            Object.values(data)
              .reduce((acc, x) =>  acc.concat(Object.values(x)), [])
          financeTable.current = convert
          convert.forEach(item => {
            if (item.type_id) setTotalPay(prev => prev += Number(item.amount || 0))
            else setTotalReceive(prev => prev += Number(item.amount || 0))
          })
          setFinanceTable(convert)
          console.log('getFinanceTable', convert);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  // const getStudentList = () => {
  //   setLoading(true)
  //   useFirebase('get_student')
  //     .then(data => {
  //       console.log('getStudentList', data);
  //       tableRef.current = data
  //       setStudentList(data)
  //       // useStorage('set', 'studentInfo', data)
  //     })
  //     .catch(err => console.log(err))
  //     .finally(() => setLoading(false))
  // }

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

  const changeMode = (mode) => {
    setMod(mode)
  }

  const handleFinanceCallback = (ok, data) => {
    if (!ok) {
      setOpenModal(false)
    } else {
      setLoading(true)
      useFirebase('make_finance', data)
      .then(() => {
        setOpenModal(false)
        toast.success("Nhập dữ liệu tài chính thành công! Yêu cầu đang chờ duyệt")
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Nhập dữ liệu tài chính thất bại! Lỗi: ${err}`)
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }

  const handleOpenModal = (isPayment) => {
    setIsPayment(isPayment)
    setOpenModal(true)
  }

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none pb-2">
          <div className="mb-4 flex flex-col items-center justify-center py-4">
            <Typography variant="h5" color="blue-gray">
              {moment(selectedMonth, 'MMYYYY').format(`MMMM - [Q]Q - YYYY`)}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Tổng thu: {formatNum(totalReceive)} &emsp; | &emsp; Tổng chi: {formatNum(totalPay)}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-0 px-0 overflow-auto max-h-[65vh]">
          <div className="flex right-5 top-30 absolute items-center justify-end gap-4">
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={() => getFinanceTable()}
            >
              <ArrowPathIcon strokeWidth={2} className={`${loading ? 'animate-spin' : ''} w-4 h-4 text-white`} />
            </Button>
          </div>
          <Tabs value={mod}>
            <TabsHeader className="max-w-max mx-auto">
              <Tab value="month" onClick={() => changeMode('month')} className="w-48 h-10">
                Month
              </Tab>
              <Tab onClick={() => changeMode('quarter')} value="quarter" className="w-48 h-10">
                Quarter
              </Tab>
              <Tab onClick={() => changeMode('year')} value="year" className="w-48 h-10">
                Year
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={mod} value={mod}>
                <FinanceTable
                  // handleRemove={handleRemove}
                  financeData={financeTable}
                />
              </TabPanel>
              {/* <TabPanel key={'treemap'} value={'treemap'}>
               
              </TabPanel> */}
            </TabsBody>
          </Tabs>
        </CardBody>
        <CardFooter className="flex justify-end items-center border-t border-blue-gray-50 p-4">
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {/* <Button
              className="flex items-center gap-3" size="sm" onClick={() => {}}>
              <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> 
              Confirm & Request
            </Button> */}
            <Button variant="gradient" color="deep-orange" className="flex items-center gap-3" size="sm"
              onClick={() => handleOpenModal(false)}
            >
              <PlusCircleIcon strokeWidth={2} className="h-5 w-5" /> 
              Make a receipt
            </Button>
            <Button variant="gradient" color="blue-gray" className="flex items-center gap-3" size="sm"
              onClick={() => handleOpenModal(true)}
            >
              <MinusCircleIcon strokeWidth={2} className="h-5 w-5" />
              Make a payment
            </Button>
          </div>
        </CardFooter>
      </Card>
      <FinancePopup open={openModal} handleCallback={handleFinanceCallback} isPayment={isPayment}/>
    </>
  );
}

const FinanceTable = ({ financeData = [] }) => {
  const [controller] = useController();
  const { userInfo } = controller;
  const [keySort, setKeySort] = useState('')
  const [isAsc, setIsAsc] = useState(true)

  const TableScore = ({ scoreTable = [] }) => {
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

  return (
    <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
      <thead>
        <tr>
          {TABLE_HEAD.map((head, index) => (
            <th
              // onClick={() => handleSort(index)}
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
        {financeData?.map(
          (item, index) => {
            const isLast = index === financeData.length - 1
            const classes = isLast
              ? "py-2 px-4"
              : "py-2 px-4 border-b border-blue-gray-50";
            return (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className={classes}>
                  <div className="flex flex-col">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {index}
                    </Typography>
                  </div>
                </td>
                <td className={classes}>
                  <div className="flex flex-col">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item.code}
                    </Typography>
                  </div>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {BillType[item.type_id]}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item.explain}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item.account_type}
                  </Typography>
                </td>
                <td className={classes}>
                  <div className="flex flex-col">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formatNum(item.amount, 0, 'price')}
                    </Typography>
                  </div>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item.approver}
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