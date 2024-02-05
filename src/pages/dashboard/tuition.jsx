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
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { orderBy } from 'lodash';

const Header = ['Mã HS', 'Tên', 'Khóa', 'Ngày đóng', 'Số tiền', 'Ghi chú']
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

export function Tables() {
  const [list, setList] = useState([])
  const listRef = useRef(tempData)

  useEffect(() => {
    const groupedData = tempData.reduce((acc, item) => {
      acc[item.class_id] = acc[item.class_id] || [];
      acc[item.class_id].push(item);
      return acc;
    }, {});
    console.log('groupedData', groupedData);
    setList(groupedData)
  }, [])


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between">
            <Typography variant="h6" color="white">
              DANH SÁCH LỚP & HỌC PHÍ - Tháng 2
            </Typography>
            <Switch 
              color="amber" ripple={true} 
              label={
                <Typography color="white" className="font-medium">
                  Đã đóng
                </Typography>
              }
            />
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
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
              {Object.keys(list)?.map(
                (item, key) => {
                  const className = `py-3 px-5 ${key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                    }`;
                  return (
                    <>
                      <tr>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold pt-4 pl-4"
                        >
                          {item}
                        </Typography>
                      </tr>
                      {list[item].map(({ name, date }, index) => (
                        <tr key={index}>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'WE00000'}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {name}
                            </Typography>
                          </td>
                          {/* <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {class_id}
                            </Typography>
                          </td> */}
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'LIFE'}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {moment(date).format('DD/MM/YYYY')}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {700.000}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'ghi chú'}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
