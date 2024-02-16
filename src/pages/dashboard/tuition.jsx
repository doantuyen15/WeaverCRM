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
  AccordionHeader,
  List,
  ListItem,
  AccordionBody,
  Accordion,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { orderBy } from 'lodash';
import { useFetch, useFirebase } from "../../utils/api/request";
import { useController } from "../../context";
import { ArrowPathIcon, PlusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import formatNum from "../../utils/formatNumber/formatNum";
import formatDate from "../../utils/formatNumber/formatDate";

const Header = ['Mã HS', 'Tên', 'Ngày đóng', 'Số tiền', 'Ghi chú']
const tempData = [
  {
    name: 'Toan',
    class_id: 'LIFE_A2B1_200523',
    date: Date.now()
  },
  {
    name: 'Tuyen',
    class_id: 'LIFE_A1A2_070823',
    date: Date.now()
  },
  {
    name: 'Test',
    class_id: 'LIFE_A2B1_200523',
    date: Date.now()
  }
]

export function Tuition() {
  const [list, setList] = useState([])
  const listRef = useRef(tempData)
  const [controller] = useController();
  const { userInfo } = controller;
  const [openPayment, setOpenPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const tableRef = useRef([])
  const [classList, setClassList] = useState([])
  const [openList, setOpenList] = useState([])

  useEffect(() => {
    const studentList = useStorage('get', 'studentInfo', [])
    if (studentList?.length === 0) getStudentList()
    else {
      tableRef.current = studentList
    }
    const classListRef = useStorage('get', 'classList', [])
    if (classListRef?.length === 0) getClassList()
    else {
      tableRef.current = classListRef
      setClassList(classListRef)
    }
  }, [])

  const getStudentList = () => {
    setLoading(true)
    useFirebase('get_student')
      .then(data => {
        setLoading(false)
        tableRef.current = data
        // setStudentList(data)
        // handleSort(1)
        useStorage('set', 'studentInfo', data)
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const getClassList = () => {
    setLoading(true)
    useFirebase('get_class_list')
      .then(data => {
        setLoading(false)
        tableRef.current = data
        setClassList(data)
        useStorage('set', 'classList', data)
        console.log('get_class_list', data);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const handleMakePayment = (ok, listPayment = []) => {
    console.log('handleMakePayment', ok, listPayment);
    setLoading(true)

    if (ok) {
      //
    }
    setOpenPayment(false)
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
              DANH SÁCH ĐÓNG HỌC PHÍ - Tháng {moment().format('MM')}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[60vh]">
          <div className="flex justify-end pr-4 gap-2">
            <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenPayment(true)}>
              <PriceCheckIcon style={{ fontSize: '1rem' }} /> Make a tuition payment
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
                  open={!openList.includes(index)}
                >
                  <AccordionHeader
                    onClick={() => handleOpenTable(index)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <Typography variant="h6" color="blue-gray">
                        {item.id}
                      </Typography>
                      <div className="flex gap-4">
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold text-blue-gray-400"
                        >
                          Create at: {formatDate(item.start_date)}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold text-blue-gray-400"
                        >
                          Teacher: {item.teacher}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold text-blue-gray-400"
                        >
                          Total student: {item.student_list?.length || 0}
                        </Typography>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <TuitionTable list={item.student_list} />
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
      <PaymentPopup studentList={tableRef.current} open={openPayment} handleCallback={handleMakePayment} />
    </div>
  );
}

export default Tuition;

export const TuitionTable = ({ list }) => {
  return (
    <>
      <table className="w-full min-w-[640px] table-auto" >
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
          {list?.map(({ id, full_name, tuition_fee, tuition_date, note }, index) => {
            const className = `py-3 px-5 ${index === authorsTableData.length - 1
              ? ""
              : "border-b border-blue-gray-50"
              }`;
            return (
              <tr key={index}>
                <td className={className}>
                  <Typography className="text-xs font-normal text-blue-gray-500">
                    {id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography className={`text-xs font-normal ${!tuition_fee ? 'text-red-500' : 'text-blue-gray-500'}`}>
                    {full_name}
                  </Typography>
                </td>
                {/* <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'LIFE'}
                            </Typography>
                          </td> */}
                <td className={className}>
                  <Typography className="text-xs font-normal text-blue-gray-600">
                    {formatDate(tuition_date)}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography className="text-xs font-semibold text-blue-gray-500">
                    {formatNum(tuition_fee, 0, 'price')}
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
      </table>
    </>
  )
}