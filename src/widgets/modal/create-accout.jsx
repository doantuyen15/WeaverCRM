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
} from "@material-tailwind/react";

const Roles = [
    'Admin',
	'Operational management',
	'Financial management',
	'Sale',
	'Quality control',
	'Teacher'
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
                                    size="lg"
                                    containerProps={{
                                        className: 'min-w-[0px]'
                                    }}
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
                                    size="lg"
                                    containerProps={{
                                        className: 'min-w-[0px]'
                                    }}
                                    value={account.phone}
                                    onChange={e => setAccount({ 
                                        ...account, 
                                        phone: e.target.value 
                                    })}
                                />
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={() => handleCallback(true, account)} fullWidth>
                            Create Account
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}

