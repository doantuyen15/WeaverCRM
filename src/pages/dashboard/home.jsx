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
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Amethyst from "../../assets/amethyst.png";
import useStorage from "../../utils/localStorageHook";
import { useNavigate } from "react-router-dom";
import { glb_sv } from "../../service";
import moment from "moment";
import { useFirebase } from "../../utils/api/request";

const calendar = glb_sv.calenderWeek()

export function Home() {
  const navigate = useNavigate();
  const [classList, setClassList] = useState([])

  useEffect(() => {
    queryClassList()
  }, [])

  const queryClassList = () => {
    const current = moment().valueOf()
    useFirebase('query_class_list', {end_date: current})
    .then(data => {
      console.log('query_class_list', data);
      setClassList(data.filter(item => item.start_date > current))
    })
    .catch(err => console.log(err))
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
        <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Bảng thông tin
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
            <table className="w-full pt-6 min-w-max table-auto text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className={`z-10 sticky top-0 border-blue-gray-100 p-4 transition-colors
                      `}
                  >
                  </th>
                  {calendar.map((day, index) => (
                    <th
                      rowSpan={2}
                      key={day.date}
                      className={`z-10 sticky top-0 border-blue-gray-100 p-4 transition-colors
                        ${index === calendar.length - 1 ? 'border-l' : 'border-x'} 
                      `}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="text-center gap-2 font-normal leading-none opacity-70"
                      >
                        {day.weekDay}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="text-center gap-2 font-normal leading-none opacity-70"
                      >
                        {day.date}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classList.map(item => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Task
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
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
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
      </div>
    </div>
  );
}

export default Home;
