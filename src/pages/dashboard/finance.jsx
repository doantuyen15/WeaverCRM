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
  TabPanel,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter
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
  'Phiếu chi',
  'Phiếu thu'
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
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [objectDetail, setObjectDetail] = useState({})
  const selectDate = useRef([currentMonth])

  useEffect(() => {
    getFinanceTable()
  }, [])

  const getFinanceTable = () => {
    setLoading(true)
    console.log('selectDate.current', selectDate.current);
    useFirebase('query_finance_table', [].concat(selectDate.current))
      .then(data => {
        setTotalReceive(0)
        setLoading(false)
        // if (data) {
        //   const convert =
        //     Object.values(data)
        //       .reduce((acc, x) =>  acc.concat(Object.values(x)), [])
        //   financeTable.current = convert
        //   convert.forEach(item => {
        //     if (item.type_id) setTotalPay(prev => prev += Number(item.amount || 0))
        //     else setTotalReceive(prev => prev += Number(item.amount || 0))
        //   })
        //   setFinanceTable(convert)
        //   console.log('getFinanceTable', convert);
        // }
        console.log('query_finance_table', data);
        setFinanceTable(data)
        data?.forEach(item => {
          if (item.type_id) setTotalReceive(prev => prev += Number(item.amount || 0))
          else setTotalPay(prev => prev += Number(item.amount || 0))
        })
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const changeMode = (mode) => {
    setMod(mode)
    selectDate.current = []
    if (mode === 'quarter') {
      const currentMonth = moment();
      const currentQuarter = currentMonth.quarter();
      for (let i = 0; i < 3; i++) {
        selectDate.current.push(moment().quarter(currentQuarter).month(i).format('MMYYYY'));
      }
    } else if (mode === 'year') {
      for (let i = 0; i < 12; i++) {
        selectDate.current.push(moment().month(i).format('MMYYYY'))
      }
    } else selectDate.current = [currentMonth]
    getFinanceTable()
  }

  const handleFinanceCallback = (ok, data) => {
    if (!ok) {
      setOpenModal(false)
    } else {
      setLoading(true)
      let service = 'make_finance'
      if (data.type_id === 1 && !data.isPayment) service = 'make_tuition'
      useFirebase(service, data)
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

  const handleOpenModalDetail = (item) => {
    setOpenModalDetail(true)
    setObjectDetail(item)
  }

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none pb-2">
          <div className="mb-4 flex flex-col items-center justify-center py-4">
            <Typography variant="h5" color="blue-gray">
              {moment(selectedMonth, 'MMYYYY').locale('vi').format(`MMMM - [Q]Q - YYYY`).toLocaleUpperCase()}
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
                Tháng
              </Tab>
              <Tab onClick={() => changeMode('quarter')} value="quarter" className="w-48 h-10">
                Quý
              </Tab>
              <Tab onClick={() => changeMode('year')} value="year" className="w-48 h-10">
                Năm
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key={mod} value={mod}>
                <FinanceTable
                  // handleRemove={handleRemove}
                  openModalDetail={handleOpenModalDetail}
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
              Lập phiếu thu
            </Button>
            <Button variant="gradient" color="blue-gray" className="flex items-center gap-3" size="sm"
              onClick={() => handleOpenModal(true)}
            >
              <MinusCircleIcon strokeWidth={2} className="h-5 w-5" />
              Lập phiếu chi
            </Button>
          </div>
        </CardFooter>
      </Card>
      <FinancePopup open={openModal} handleCallback={handleFinanceCallback} isPayment={isPayment}/>
      <ModalFinanceDetail open={openModalDetail} handleOpen={setOpenModalDetail} data={objectDetail}/>
    </>
  );
}

export const ModalFinanceDetail = ({open, handleOpen, data}) => {
  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleOpen}
      className="max-w-[80%]"
    >
      <DialogHeader className="justify-center">{`Chi tiết ${BillType[data.type_id]}`}</DialogHeader>
      <DialogBody>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Mã phiếu (tự tạo)
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {data.code}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Ngày lập phiếu
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {formatDate(data.create_date, 'YYYY-MM-DD')}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Loại
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {data.type}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Số tiền
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {formatNum(data.amount, 0, 'price')}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Quỹ
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {data.account_type}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Mã lớp học
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {data.class_id}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Khách hàng
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {data.customer}
          </Typography>
        </div>
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Số tiền
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {formatNum(data.amount, 0, 'price')}
          </Typography>
        </div>
        {data.tuition_date && (
          <div className="p-4 border-b border-blue-gray-100 flex justify-between">
            <Typography variant="small" color="black">
              Học phí tháng
            </Typography>
            <Typography variant="small" color="black" className="font-bold">
              {moment(data.tuition_date, 'MMYYYY').format('MM')}
            </Typography>
          </div>
        )}
        <div className="p-4 border-b border-blue-gray-100 flex justify-between">
          <Typography variant="small" color="black">
            Người duyệt
          </Typography>
          <Typography variant="small" color="black" className="font-bold">
            {data.approver}
          </Typography>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="gradient" color="deep-orange" onClick={() => handleOpen(prev => !prev)}>
          confirm
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

const FinanceTable = ({ financeData = [], openModalDetail }) => {
  const [controller] = useController();
  const { userInfo } = controller;
  const [keySort, setKeySort] = useState('')
  const [isAsc, setIsAsc] = useState(true)

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
                      as={"a"}
                      onClick={() => openModalDetail(item)}
                      variant="small"
                      color="blue-gray"
                      className="py-0.5 px-1 font-normal text-inherit transition-colors text-blue-500 cursor-pointer"
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