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
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { PaymentPopup } from "../../widgets/modal/payment";
import useStorage from "../../utils/localStorageHook";
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import formatNum from "../../utils/formatNumber/formatNum";
import formatDate from "../../utils/formatNumber/formatDate";
import { glb_sv } from "../../service";
import { toast } from "react-toastify";

const Header = ['Mã HS', 'Tên', 'Ngày đóng', 'Số tiền còn lại', 'Ghi chú']

export function Tuition() {
  const [list, setList] = useState([])
  const [controller] = useController();
  const { userInfo } = controller;
  const [openPayment, setOpenPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const tableRef = useRef([])
  const [classList, setClassList] = useState([])
  // const [studentList, setStudentList] = useState([])
  const [openList, setOpenList] = useState([])
  const [openSubList, setOpenSubList] = useState([])
  const currentMonth = moment().format('MMYYYY')
  const [tuitionTable, setTuitionTable] = useState([])
  const [filterTuition, setFilterTuition] = useState(false)

  useEffect(() => {
    getClassList()
  }, [])

  const getClassList = () => {
    setLoading(true)
    useFirebase('get_class_list')
      .then(data => {
        setLoading(false)
        tableRef.current = data
        setClassList(data)
        useStorage('set', 'classList', data)
        getTuitionTable()
        console.log('get_class_list', data);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const getTuitionTable = (month = '') => {
    setLoading(true)
    useFirebase('get_tuition_table', month || currentMonth)
      .then(data => {
        setLoading(false)
        setTuitionTable(data)
        // useStorage('set', 'classList', data)
        console.log('getTuitionTable', data);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const handleMakePayment = (ok, listPayment = []) => {
    console.log('handleMakePayment', ok, listPayment);
    if (ok) {
      setLoading(true)
      useFirebase('make_tuition', listPayment)
        .then(() => {
          setLoading(false)
          toast.success('Đóng tiền thành công, yêu cầu đang chờ duyệt!')
        })
    } else {
      setOpenPayment(false)
    }
  }

  const handleOpenList = (index) => {
    if (openList.includes(index)) setOpenList([...openList.filter(i => i !== index)])
    else {
      openList.push(index)
      setOpenList([...openList])
    }
  }

  const handleOpenSubList = (index) => {
    if (openSubList.includes(index)) setOpenSubList([...openSubList.filter(i => i !== index)])
    else {
      openSubList.push(index)
      setOpenSubList([...openSubList])
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
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[65vh]">
          <div className="flex justify-between pr-4">
            <div className="flex items-center py-2">
              <Typography className="text-xs px-3 font-normal text-blue-gray-500">
                Ẩn đã đóng
              </Typography>
              <Switch
                key={'filter'}
                ripple={false}
                checked={!filterTuition}
                onClick={() => setFilterTuition(prev => !prev)}
                className="h-full w-full checked:bg-[#fd5f00] py-2"
                containerProps={{
                  className: "w-10 h-5",
                }}
                circleProps={{
                  className: "before:hidden h-4 w-4 left-1 border-none",
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button disabled={loading} className="flex items-center gap-3" size="sm" onClick={() => setOpenPayment(true)}>
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
          </div>
          {glb_sv.programs.map((item, index) => (
            <ListItem ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
              <Accordion
                open={!openList.includes(index)}
              >
                <AccordionHeader
                  onClick={() => handleOpenList(index)}
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
                  <List>
                    {classList.map((classInfo, index) => {
                      const isPayAll = (Object.values(tuitionTable[classInfo.id] || {})?.length === classInfo.student_list?.length)
                      return (
                        classInfo.id.includes(item) ? (
                          <ListItem ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
                            <Accordion
                              open={!openSubList.includes(index)}
                            >
                              <AccordionHeader
                                onClick={() => (!isPayAll || filterTuition) && handleOpenSubList(index)}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex gap-2 items-center justify-between">
                                    <Typography variant="h6" color="blue-gray">
                                      {classInfo.id}
                                    </Typography>
                                    {(!isPayAll || filterTuition) ? (openSubList.includes(index) ? (
                                      <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                                    ) : (
                                      <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                                    )) : <></>}
                                  </div>
                                  <div className="flex gap-4 items-center">
                                    <Typography
                                      variant="small"
                                      className="text-[11px] font-bold text-blue-gray-400"
                                    >
                                      Start at: {formatDate(classInfo.start_date)}
                                    </Typography>
                                    <Typography
                                      variant="small"
                                      className="text-[11px] font-bold text-blue-gray-400"
                                    >
                                      Teacher: {classInfo.teacher}
                                    </Typography>
                                    <Typography
                                      variant="small"
                                      className="text-[11px] font-bold text-blue-gray-400"
                                    >
                                      Total student: {classInfo.student_list?.length || 0}
                                    </Typography>
                                    {isPayAll ? (
                                        <DoneAllIcon style={{ fontSize: '1.5rem', color: '#fd5f00' }}/>
                                      ) : <></>}
                                  </div>
                                </div>
                              </AccordionHeader>
                              <AccordionBody>
                                {moment(classInfo.start_date, 'DD/MM/YYYY').diff(moment(), 'hours') <= 24 ? (
                                  <TuitionTable filterTuition={filterTuition} classInfo={classInfo} tuitionList={tuitionTable} />
                                ) : null}
                                {/* {!isPayAll || !filterTuition ?
                                } */}
                              </AccordionBody>
                            </Accordion>
                          </ListItem>
                        ) : null
                      )
                    })}
                  </List>
                </AccordionBody>
              </Accordion>
            </ListItem>
          ))}

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
      <PaymentPopup classList={classList} open={openPayment} handleCallback={handleMakePayment} loading={loading} tuitionTable={tuitionTable}/>
    </div>
  );
}

export default Tuition;

export const TuitionTable = ({ filterTuition, classInfo, tuitionList }) => {
  const [classStudentList, setClassStudentList] = useState([])
  const classStudentListRef = useRef([])
  const tuitionDefault = glb_sv.getTuitionFee[classInfo.id.split('_')[0]][0].value

  useEffect(() => {
    const classTuition = tuitionList[classInfo.id] || {}
    classInfo.getStudentList()
      .then((list) => {
        setClassStudentList(list.map(item => {
          return {
            ...item,
            ...classTuition[item.id]
          }
        }))
        // classStudentListRef.current = list
        // if (!tuiList?.length) {
        //   setClassStudentList(list)
        // } else {
        //   // list = list.filter(item => tuiList?.[item.id] === undefined)
        //   setClassStudentList(list.map(item => {
        //     return {
        //       ...item,
        //       ...tuiList.find(info => info.id_student === item.id)
        //     }
        //   }))

        //   // setClassStudentList(list)
        // }
      })
      .catch(err => console.log(err))
  //   if (!filterTuition) {
      
  //     // const listFilter = classStudentListRef.current.filter(student => tuitionDefault - (classTuition[student.id]?.tuition || 0) === 0)
  //     // console.log('classTuition[student.id]?.tuition ', classTuition, classStudentListRef.current.map(student => classTuition[student.id]?.tuition) );
  //     setClassStudentList(listFilter)
  //   } else {
  //     setClassStudentList(classStudentListRef.current)
  //   }
  }, [tuitionList])

  const filterNopay = (tuition) => {
    if (typeof tuition !== 'number') return true
    return tuitionDefault - tuition
  }

  // if (tuiList.length === 0 && !filterTuition) return <></>
  
  return (
    <table className="w-full min-w-[640px] table-auto mt-4" >
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
        {classStudentList?.map(({ id, full_name, tuition, date, note }, index) => {
          // const { tuition, date, note } = (tuiList || []).find(item => item.id_student === id) || {};
          const className = `py-3 px-5 ${index === authorsTableData.length - 1
            ? ""
            : "border-b border-blue-gray-50"
            }`;
          if ((tuitionDefault - tuition === 0) && !filterTuition) return (<></>)
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
    </table>
  )
}