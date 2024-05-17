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
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Input,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
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
import { FinancePopup } from "../../widgets/modal/finance-popup";
import ClassInfo from "../../data/entities/classesInfo";

const Header = glb_sv.HEADER_TUITION

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
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMYYYY'))
  const [selectedStudent, setSelectedStudent] = useState({})
  const [filterTuition, setFilterTuition] = useState(false)
  const [isTuitionDate, setIsTuitionDate] = useState(true)
  const [courseList, setCourseList] = useState(glb_sv.programs)
  const courseTuition = useRef({})

  useEffect(() => {
    getClassList()
    getAllCourse()
  }, [])

  const getAllCourse = () => {
    useFirebase('get_all_course', {getId: true})
      .then(data => {
        console.log('get_all_course', data.map(item => item.id));
        setCourseList(data.map(item => item.id))
        data.map(item => courseTuition.current[item.id] = item.data())
        // useStorage('set', 'programs', data.map(item => item.data()))
      })
      .catch(err => console.log(err))
    // .finally(() => setLoading(false))
  }

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
    // setLoading(true)
    // tableRef.current.forEach(classInfo => {
    //   const classTemp = new ClassInfo(classInfo)
    //   if (moment(classTemp.end_date, 'DD/MM/YYYY').diff(moment(), 'days') >= -5) {
    //     // classTemp.getTuitionTable(currentMonth)
    //       // .then(table => {
    //       //   setTuitionTable
    //       // })
    //   }
    // })
    // useFirebase('get_tuition_table', month || currentMonth)
    //   .then(data => {
    //     setLoading(false)
    //     setTuitionTable(data)
    //     // useStorage('set', 'classList', data)
    //     console.log('getTuitionTable', data);
    //   })
    //   .catch(err => console.log(err))
    //   .finally(() => setLoading(false))
  }

  const handleMakePayment = (ok, listPayment = {}) => {
    console.log('handleMakePayment', ok, listPayment);
    if (ok) {
      setLoading(true)
      useFirebase('make_tuition', listPayment)
        .then(() => {
          setLoading(false)
          toast.success('Đóng tiền thành công, yêu cầu đang chờ duyệt!')
        })
        .catch((error) => toast.error(error))
        .finally(() => {
          setOpenPayment(false)
          setLoading(false)
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

  const changeMonth = (month) => {
    setSelectedMonth(month)
    getTuitionTable(moment().month(month).format('MMYYYY'))
  }

  const handleSelectStudent = (param) => {
    setSelectedStudent(param)
    setOpenPayment(true)
  }

  const filterTuitionDate = (classInfo) => {
    const tuitiondate = formatDate(classInfo.start_date).slice(0, 2)
    if (classInfo.level == 'DIAMONDPLUS') {
      moment(selectedMonth, 'MMYYYY').isBetween(moment(classInfo.start_date).startOf('month').subtract(1, 'day'), moment(classInfo.end_date))
    }
    const isShow = isTuitionDate || classInfo.program === 'IELTS' ?
      moment(selectedMonth, 'MMYYYY').isBetween(moment(classInfo.start_date).startOf('month').subtract(1, 'day'), moment(classInfo.end_date)) :
      moment(tuitiondate + selectedMonth, 'DDMMYYYY').diff(moment(), 'day') <= 5
      return isShow
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between">
            <Typography variant="h6" color="white">
              DANH SÁCH ĐÓNG HỌC PHÍ - Tháng {moment(selectedMonth, 'MMYYYY').format('MM')}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[65vh]">
          <div className="flex justify-between pr-4">
            <div className="flex">
              <div className="flex items-center pr-2 border-r">
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
              <div className="flex items-center pr-2 border-r">
                <Typography className="text-xs px-3 font-normal text-blue-gray-500">
                  Lọc chưa đến hạn
                </Typography>
                <Switch
                  key={'filter'}
                  ripple={false}
                  checked={isTuitionDate}
                  onClick={() => setIsTuitionDate(prev => !prev)}
                  className="h-full w-full checked:bg-[#fd5f00] py-2"
                  containerProps={{
                    className: "w-10 h-5",
                  }}
                  circleProps={{
                    className: "before:hidden h-4 w-4 left-1 border-none",
                  }}
                />
              </div>
              <div className="pl-2 flex items-center grow">
                <Typography className="text-xs pr-2 min-w-max font-normal text-blue-gray-500">
                  Chuyển tháng
                </Typography>
                <Input
                  variant="static"
                  type="month"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  containerProps={{
                    className: 'h-7'
                  }}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={moment(selectedMonth, 'MMYYYY').format('YYYY-MM')}
                  onChange={(e) => {
                    if (!e.target.value) setSelectedMonth(moment().format('MMYYYY'))
                    else setSelectedMonth(moment(e.target.value, 'YYYY-MM').format('MMYYYY'))
                    getTuitionTable(moment(e.target.value, 'YYYY-MM').format('MMYYYY'))
                  }}
                />
              </div>
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
          {(courseList).map((item, index) => (
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
                      const isShow = filterTuitionDate(classInfo)
                      // const isPayAll = (Object.values(tuitionTable[classInfo.id] || {})?.length === classInfo.student_list?.length)
                      return (
                        classInfo.id.includes(item) && isShow ? (
                          <ListItem ripple={false} className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
                            <Accordion
                              open={!openSubList.includes(index)}
                            >
                              <AccordionHeader
                                onClick={() => handleOpenSubList(index)}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex gap-2 items-center justify-between">
                                    <Typography variant="h6" color="blue-gray">
                                      {classInfo.id}
                                    </Typography>
                                    {(openSubList.includes(index) ? (
                                      <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                                    ) : (
                                      <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                                    ))}
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
                                      End at: {formatDate(classInfo.end_date)}
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
                                    {/* {isPayAll ? (
                                        <DoneAllIcon style={{ fontSize: '1.5rem', color: '#fd5f00' }}/>
                                      ) : <></>} */}
                                  </div>
                                </div>
                              </AccordionHeader>
                              <AccordionBody>
                                  <TuitionTable courseTuition={courseTuition.current} handleSelectStudent={handleSelectStudent} filterTuition={filterTuition} classInfo={classInfo} selectedMonth={selectedMonth} />
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
      {/* <PaymentPopup selectedMonth={selectedMonth} classList={classList} open={openPayment} handleCallback={handleMakePayment} loading={loading} tuitionTable={tuitionTable}/> */}
      <FinancePopup open={openPayment} handleCallback={handleMakePayment} dataClass={classList} dataStudent={selectedStudent}/>
    </div>
  );
}

export default Tuition;

export const TuitionTable = ({ courseTuition = {}, filterTuition, classInfo, selectedMonth, handleSelectStudent }) => {
  const [studentTuitionList, setStudentTuitionList] = useState([])
  const classStudentListRef = useRef([])
  const tuitionDefault = Number(courseTuition[classInfo.program]?.[classInfo.level?.trim()]?.['tuition']) || 0
  // const tuitionDefault = glb_sv.getTuitionFee[classInfo.id.split('_')[0]][0].value

  useEffect(() => {
    // const classTuition = tuitionList[classInfo.id] || {}
    const classTuition = classInfo.tuition
    classInfo.getStudentList()
      .then((list) => {
        if (classInfo.program === 'IELTS') { // need update tag monthly
          setStudentTuitionList(list.map(item => {
            let amount = 0
            Object.values(classTuition).forEach(tuition => {
              if (tuition[item.id]) amount += tuition[item.id]['amount']
            })
            console.log('classTuition', amount);

            return {
              ...item,
              amount: amount
            }
          }))
        } else {
          setStudentTuitionList(list.map(item => {
            return {
              ...item,
              ...classTuition[selectedMonth]?.[item.id]
            }
          }))
        }
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
  }, [selectedMonth])

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
        {studentTuitionList?.map(({ id, full_name, amount, create_date, explain }, index) => {
          // const { tuition, date, note } = (tuiList || []).find(item => item.id_student === id) || {};
          const className = `py-3 px-5 ${index === authorsTableData.length - 1
            ? ""
            : "border-b border-blue-gray-50"
            }`;
          if ((tuitionDefault - amount === 0) && !filterTuition) return (<></>)
          return (
            <tr key={index} onDoubleClick={() => handleSelectStudent({id_student: id, id_class: classInfo.id, full_name, month: selectedMonth, tuition_date: moment().format('MMYYYY')})}>
              <td className={className}>
                <Typography className="text-xs font-normal text-blue-gray-500">
                  {id}
                </Typography>
              </td>
              <td className={className}>
                <Typography className={`text-xs font-normal ${!amount ? 'text-red-500' : 'text-blue-gray-500'}`}>
                  {full_name}
                </Typography>
              </td>
              <td className={className}>
                <Typography className="text-xs font-normal text-blue-gray-600">
                  {create_date ? formatDate(create_date) : ''}
                </Typography>
              </td>
              <td className={className}>
                <Typography className="text-xs font-semibold text-blue-gray-500">
                  {!amount ? formatNum(tuitionDefault, 0, 'price') : formatNum(tuitionDefault - amount, 0, 'price')}
                  {/* {typeof tuition === 'number' ? formatNum(tuitionDefault - tuition, 0, 'price') : formatNum(tuitionDefault, 0, 'price')} */}
                </Typography>
              </td>
              <td className={className}>
                <Typography className="text-xs font-normal text-blue-gray-500">
                  {explain}
                </Typography>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}