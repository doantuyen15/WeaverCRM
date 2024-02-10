import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    TabPanel,
    Tab,
    Switch,
    Tooltip,
    Button,
    Chip,
    List,
    ListItem,
    ListItemPrefix
} from "@material-tailwind/react";
import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
    PencilIcon,
    TableCellsIcon,
    RectangleGroupIcon,
    PlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "./../../widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "./../../data";
import { authorsTableData, projectsTableData } from "./../../data";
import React, { useEffect, useState } from 'react'
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { CreateAccount } from "../../widgets/modal/create-accout";
import {useFetch} from "../../utils/api/request";
import { useController } from "../../context";
import encryptString from "../../utils/encode/DataCryption";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { glb_sv } from "../../service";

const Header = ["Tên", "Chức vụ", "Mật khẩu", "Số điện thoại", ""]
// ['full_name', 'user_name', 'password', 'id_staff', 'id_user', 'id_card', 'id_card_date', 'issued_by', 'address', 'mail', 'phone', 'id_department', 'act_no_bank', 'bank_brch', 'academic_lv', 'college_graduation', 'working_status', 'dt_start', 'dt_end', 'note']

export function Roles() {
    const [mod, setMod] = useState('table')
    const [showPassword, setShowPassword] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const [staffList, setStaffList] = useState([])
    const userInfo = glb_sv.userInfo
    const functions = getFunctions(glb_sv.app);
    

    useEffect(() => {
        getStaffList()
        
    }, [])

    const getStaffList = () => {
        console.log('getStaffList');
        // const functions = getFunctions();
        const createUser = httpsCallable(functions, 'createUser');
        try {
            const userInfo = {
                phoneNumber: "112233344",
                password: "hello1",
                displayName: "test1",
                disabled: false,
                // customClaims: { roleId: '01' },
                photoURL: '',
                email: 'test1@weaver.edu.vn',
                emailVerified: true,
                username: 'test2'
            }
            createUser({ params: userInfo })
            .then((result) => {
                const data = result.data;
                const sanitizedMessage = data.text;
                console.log('data', data, sanitizedMessage);
            })
            .catch((error) => {
                console.log('data', error);
            });
        // const admin = initializeApp({
        //     credential: credential.cert(userInfo.cert),
        //     databaseURL: "https://weavercrm.firebaseio.com"
        //   });
        // const requestInfo = {
        //     headers: {
        //         "authorization": `${userInfo.token}`,
        //     },
        //     method: 'get',
        //     service: 'getInfoStaff',
        //     callback: (data) => {
        //         console.log('staffs', data);
        //         setStaffList(data)
        //     },
        //     handleError: (error) => {
        //         console.log('error', error)
        //     }
        // }
        // useFetch(requestInfo)
        } catch (error) {
        console.log('getStaffList', error);
            
        }

    }

    const handleCancelCreate = () => {
        setOpenCreate(false)
    }

    const handleCreateCallback = (ok, account = {}) => {
        console.log('handleCreateCallback' , account);
        setOpenCreate(false)
        if (ok) {
            const requestInfo = {
                body: Object.values({...account, password: encryptString(account.password)}),
                headers: {
                    "authorization": `${userInfo.token}`,
                },
                method: 'post',
                service: 'registerUsers',
                callback: (data) => {
                    getStaffList()
                    // setLoading(false)
                    // setTable(data)
                    // tableRef.current = data
                },
                handleError: (error) => {
                    console.log('error', error)
                    // setLoading(false)
                },
                showToast: true
            }
            useFetch(requestInfo)
        }
    }

    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('../../assets/background-image.png')] bg-cover	bg-center">
                <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-3 -mt-32 mb-6 lg:mx-4 border border-blue-gray-100">
                <CardBody className="p-4">
                    <div className="flex items-center">
                        <div className="relative gird-cols-1 grid gap-12 px-4 w-full">
                            <div className="absolute flex right-5 z-40 bg-blue-gray-50 gap-2 justify-center bg-opacity-60 rounded-lg p-1 items-center">
                                <Button 
                                    className="flex items-center gap-3" 
                                    size="sm" 
                                    onClick={() => setOpenCreate(true)}
                                >
                                    <PlusIcon strokeWidth={2} className="w-4 h-4 text-white" /> Create
                                </Button>
                            </div>
                            <Tabs value={mod}>
                                <TabsHeader className="w-96 mx-auto">
                                    <Tab value={"table"}>
                                        <TableCellsIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                        Table
                                    </Tab>
                                    <Tab value="treemap">
                                        <RectangleGroupIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                        Tree map
                                    </Tab>
                                </TabsHeader>
                                <TabsBody>
                                    <TabPanel key={'table'} value={'table'}>
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
                                                {staffList.map(
                                                    ({ full_name, user_name, password, id_staff, id_user, id_card, id_card_date, issued_by, address, mail, phone, id_department, act_no_bank, bank_brch, academic_lv, college_graduation, working_status, dt_start, dt_end, note }, key) => {
                                                        const className = `py-3 px-5 ${key === staffList.length - 1
                                                            ? ""
                                                            : "border-b border-blue-gray-50"
                                                            }`;

                                                        return (
                                                            <tr key={name}>
                                                                <td className={className}>
                                                                    <div className="flex items-center gap-4">
                                                                        <div>
                                                                            <Typography
                                                                                variant="small"
                                                                                color="blue-gray"
                                                                                className="font-semibold"
                                                                            >
                                                                                {full_name}
                                                                            </Typography>
                                                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                                                {mail}
                                                                            </Typography>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                        {id_department}
                                                                    </Typography>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                        {showPassword ? password : '******'}
                                                                    </Typography>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                        {'0909.111.222'}
                                                                    </Typography>
                                                                </td>
                                                                <td className={className}>
                                                                    <Typography
                                                                        as="a"
                                                                        // href="#"
                                                                        className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                                                                    >
                                                                        Edit
                                                                    </Typography>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </TabPanel>
                                    <TabPanel key={'treemap'} value={'treemap'}>
                                        <Card className="w-96 relative mx-auto">
                                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 absolute top-0 left-0 right-0 p-3">
                                                <Typography variant="h3" color="white" className="font-bold text-center">
                                                    Giám đốc
                                                </Typography>
                                            </div>
                                            <List className="mt-16 overflow-auto max-h-40">
                                                <ListItem>
                                                    <ListItemPrefix>
                                                        <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" />
                                                    </ListItemPrefix>
                                                    <div>
                                                        <Typography variant="h6" color="blue-gray">
                                                            Tania Andrew
                                                        </Typography>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            Software Engineer @ Material Tailwind
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemPrefix>
                                                        <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" />
                                                    </ListItemPrefix>
                                                    <div>
                                                        <Typography variant="h6" color="blue-gray">
                                                            Alexander
                                                        </Typography>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            Backend Developer @ Material Tailwind
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemPrefix>
                                                        <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" />
                                                    </ListItemPrefix>
                                                    <div>
                                                        <Typography variant="h6" color="blue-gray">
                                                            Emma Willever
                                                        </Typography>
                                                        <Typography variant="small" color="gray" className="font-normal">
                                                            UI/UX Designer @ Material Tailwind
                                                        </Typography>
                                                    </div>
                                                </ListItem>
                                            </List>
                                        </Card>
                                        <div className="flex mt-4">
                                            <Card className="w-96 relative mx-auto">
                                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 absolute top-0 left-0 right-0 p-3">
                                                    <Typography variant="h3" color="white" className="font-bold text-center">
                                                        Học Vụ
                                                    </Typography>
                                                </div>
                                                <List className="mt-16 overflow-auto max-h-40">
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Tania Andrew
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Software Engineer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Alexander
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Backend Developer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Emma Willever
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                UI/UX Designer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                </List>
                                            </Card>
                                            <Card className="w-96 relative mx-auto">
                                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 absolute top-0 left-0 right-0 p-3">
                                                    <Typography variant="h3" color="white" className="font-bold text-center">
                                                        Kế Toán
                                                    </Typography>
                                                </div>
                                                <List className="mt-16 overflow-auto max-h-40">
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="candice" src="https://docs.material-tailwind.com/img/face-1.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Tania Andrew
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Software Engineer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="alexander" src="https://docs.material-tailwind.com/img/face-2.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Alexander
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                Backend Developer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemPrefix>
                                                            <Avatar variant="circular" alt="emma" src="https://docs.material-tailwind.com/img/face-3.jpg" />
                                                        </ListItemPrefix>
                                                        <div>
                                                            <Typography variant="h6" color="blue-gray">
                                                                Emma Willever
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal">
                                                                UI/UX Designer @ Material Tailwind
                                                            </Typography>
                                                        </div>
                                                    </ListItem>
                                                </List>
                                            </Card>
                                        </div>
                                    </TabPanel>
                                </TabsBody>
                            </Tabs>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <CreateAccount open={openCreate} handleOpen={handleCancelCreate} handleCallback={handleCreateCallback} />
        </>
    );
}

export default Roles;
