import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "./../../widgets/cards";
import { StatisticsChart } from "./../../widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "../../data";
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, PresentationChartBarIcon } from "@heroicons/react/24/solid";
import Amethyst from "../../assets/amethyst.png";
import useStorage from "../../utils/localStorageHook";
import { useNavigate } from "react-router-dom";
import { glb_sv } from "../../service";
import moment from "moment";
import { useFirebase } from "../../utils/api/request";
import { ClassInfo } from "./classes";
import { ModalClassInfo } from "../../widgets/modal/class-info";

const calendar = glb_sv.calenderWeek()

export function Home() {
  const navigate = useNavigate();
  const [classList, setClassList] = useState([])
  const [openModalClass, setOpenModalClass] = useState(false)
  const [selectedClass, setSelectedClass] = useState({})

  useEffect(() => {
    queryClassList()
  }, [])

  const queryClassList = () => {
    const current = moment().valueOf()
    useFirebase('query_class_list', {end_date: current})
    .then(data => {
      console.log('query_class_list', data);
      setClassList(data.filter(item => item.start_date < current))
    })
    .catch(err => console.log(err))
  }

  const getClassDay = (schedule, index) => {
    if (schedule === 0 && (index === 0 || index === 2)) return true
    if (schedule === 1 && (index === 1 || index === 3)) return true
    if (schedule === 2 && (index === 5 || index === 6)) return true
    if (schedule === 3 && (index === 4)) return true
  }

  const handleOpenClassInfo = (item) => {
    setSelectedClass(item)
    setOpenModalClass(true)
  }

  return (
    <div className="mt-12">
      {/* <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}
      <div className="mb-4 grid grid-cols-1 gap-6">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Bảng thông tin
            </Typography>
            {/* <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography> */}
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                      }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
        <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Danh sách lớp
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <PresentationChartBarIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{classList.length} Lớp</strong>
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-2 pt-0 pb-2 cursor-pointer">
            {classList.map(item =>
              <ClassInfo openModal={() => handleOpenClassInfo(item)} item={item} />
            )}
          </CardBody>
        </Card>
        <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Thời khóa biểu
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CalendarDaysIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>Lịch dạy</strong>
              </Typography>
            </div>
            
            {/* <Menu placement="left-start">
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
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu> */}
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-max table-auto text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className={`z-10 sticky top-0 border-r border-blue-gray-100 p-4 transition-colors
                      `}
                  >
                  </th>
                  {calendar.map((day, index) => (
                    <th
                      rowSpan={2}
                      key={day.date}
                      className={`z-10 sticky top-0 border-blue-gray-100 p-2 transition-colors
                        ${index === calendar.length - 1 ? 'border-l' : 'border-x'} 
                      `}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`text-center pb-1 ${day.date === moment().format('DD/MM/YYYY') ? 'font-bold' : 'font-normal'} leading-none opacity-70`}
                      >
                        {day.weekDay}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`text-center pb-1 ${day.date === moment().format('DD/MM/YYYY') ? 'font-bold' : 'font-normal'} leading-none opacity-70`}
                      >
                        {day.date}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classList.map((item, key) => {
                  return (
                    <tr key={key} className="hover:bg-blue-gray-50/50">
                      <td className={"py-2 px-4 border-t border-r border-blue-gray-100 hover:bg-blue-gray-50/50"}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.id}
                        </Typography>
                      </td>
                      {calendar.map((day, index) => {
                        const isClassDay = getClassDay(item.class_schedule_id, index)
                        const isLast = index === calendar.length - 1;
                        const classes = isLast
                          ? "py-2 px-4 border-t border-l border-blue-gray-100"
                          : "py-2 px-4 border-t border-x border-blue-gray-100";
                        return (
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold text-center"
                            >
                              {isClassDay ? 'X' : ''}
                            </Typography>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
      {openModalClass ? <ModalClassInfo getClassList={queryClassList} classList={classList} handleOpen={setOpenModalClass} open={openModalClass} data={selectedClass} /> : null}
    </div>
  );
}

export default Home;
