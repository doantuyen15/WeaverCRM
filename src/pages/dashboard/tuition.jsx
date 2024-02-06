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
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "../../data";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { orderBy } from 'lodash';
import useFetch from "../../utils/api/request";
import { useController } from "../../context";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { PaymentPopup } from "../../widgets/modal/payment";

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

export function Tables() {
  const [list, setList] = useState([])
  const listRef = useRef(tempData)
  const [controller] = useController();
  const { userInfo } = controller;
  const [openPayment, setOpenPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const tableRef = useRef([])

  useEffect(() => {
    getStudentList()
  }, [])

  const getStudentList = () => {
    // setLoading(true)
    const requestInfo = {
      headers: {
        "authorization": `${userInfo.token}`,
      },
      method: 'get',
      service: 'getAllStudentClass',
      callback: (data) => {
        const groupedData = data.reduce((acc, item) => {
          acc[item.code_class_room] = acc[item.code_class_room] || [];
          acc[item.code_class_room].push(item);
          return acc;
        }, {});
        setList(groupedData)
        console.log('getAllStudentClass', groupedData);

        // setLoading(false)
        tableRef.current = data
      },
      handleError: (error) => {
        console.log('error', error)
        // setLoading(false)
      }
    }
    useFetch(requestInfo)
  }

  const handleMakePayment = (ok, listPayment = []) => {
    console.log('handleMakePayment', ok, listPayment);
    setLoading(true)

    if (ok) {
      listPayment.forEach(item => {
        setTimeout(() => {
          const requestInfo = {
            body: [
              item.id_student,
              item.id_class,
              item.id_class_type,
              item.date,
              item.tuition,
              item.note
            ],
            headers: {
              "authorization": `${userInfo.token}`,
            },
            method: 'post',
            service: 'createTuition',
            callback: (data) => {
              setLoading(false)
              // setStudentList(data)
              // tableRef.current = data
            },
            handleError: (error) => {
              // console.log('error', error)
              setLoading(false)
            },
            showToast: true
          }
          useFetch(requestInfo)
        }, 300);
      })
    }
    setOpenPayment(false)
  }

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
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-[55vh]">
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
                      {list[item].map(({ id_we, full_name, date, note }, index) => (
                        <tr key={index}>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {id_we}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {full_name}
                            </Typography>
                          </td>
                          {/* <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'LIFE'}
                            </Typography>
                          </td> */}
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
                              {note}
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
        <CardFooter className="pt-0 flex justify-end">
          <Button className="flex items-center gap-3" size="sm" onClick={() => setOpenPayment(true)}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Make a tuition payment
          </Button>
        </CardFooter>
      </Card>
      <PaymentPopup studentList={tableRef.current} open={openPayment} handleCallback={handleMakePayment} />
    </div>
  );
}

export default Tables;
