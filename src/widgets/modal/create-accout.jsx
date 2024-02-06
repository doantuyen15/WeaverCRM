import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Card,
    CardBody,
    Input,
    CardFooter,
    Select,
    Option,
} from "@material-tailwind/react";

const Roles = [
    'Admin',
	'Quản lý vận hành',
	'Quản lý tài chính',
	'Sale',
	'Kiểm soát chất lượng',
	'Giáo Viên'
]

export function CreateAccount({ open, handleOpen, handleCallback }) {
    const [account, setAccount] = useState({
        'fullname': '', 
        'username': '', 
        'password': '', 
        'id_card': '', 
        'id_card_date': '',
        'issued_by': '', 
        'address': '', 
        'mail': '', 
        'phone': '', 
        'id_department': '', 
        'act_no_bank': '', 
        'bank_brch': '', 
        'academic_lv': '', 
        'college_graduation': '', 
        'working_status': '', 
        'dt_start': '', 
        'dt_end': '', 
        'note': ''
    })

    const checkInfo = () => {
        if (!account.username || !account.password || !account.id_department) return true
        else return false
    }

    return (
        <>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[40rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Create Account
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Enter username & password to Create.
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                            Username
                        </Typography>
                        <Input 
                            required
                            label="Username" 
                            size="lg"
                            value={account.username}
                            onChange={e => setAccount({ 
                                ...account, 
                                username: e.target.value 
                            })}
                        />
                        <Typography className="-mb-2" variant="h6">
                            Password
                        </Typography>
                        <Input
                            required
                            label="Password"
                            size="lg" 
                            value={account.password}
                            onChange={e => setAccount({ 
                                ...account, 
                                password: e.target.value
                            })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Typography className="mb-2" variant="h6">
                                    Full Name
                                </Typography>
                                <Input
                                    label="Full Name"
                                    value={account.fullname}
                                    onChange={e => setAccount({ 
                                        ...account, 
                                        fullname: e.target.value 
                                    })}
                                />
                            </div>
                            <div>
                                <Typography className="mb-2" variant="h6">
                                    Phone Number
                                </Typography>
                                <Input
                                    label="Phone Number"
                                    value={account.phone}
                                    onChange={e => setAccount({ 
                                        ...account, 
                                        phone: e.target.value 
                                    })}
                                />
                            </div>
                        </div>
                        <Select
                            label="Select Roles"
                            selected={(element) =>
                                element &&
                                React.cloneElement(element, {
                                    disabled: true,
                                    className:
                                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                })
                            }
                        >
                            {Roles?.map((item, index) => (
                                <Option 
                                    onClick={() => setAccount({
                                        ...account,
                                        id_department: index+1
                                    })}
                                    key={item} value={item} className="flex items-center gap-2">
                                    {item}
                                </Option>
                            ))}
                        </Select>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button disabled={checkInfo()} variant="gradient" onClick={() => handleCallback(true, account)} fullWidth>
                            Create Account
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}

