import React from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";

export function PaymentPopup({ open, handleCallback }) {
    return (
        <>
            <Dialog
                size="xs"
                open={open}
                handler={() => handleCallback(false)}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Sign In
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Enter your email and password to Sign In.
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                            Your Email
                        </Typography>
                        <Input label="Email" size="lg" />
                        <Typography className="-mb-2" variant="h6">
                            Your Password
                        </Typography>
                        <Input label="Password" size="lg" />
                        <div className="-ml-2.5 -mt-3">
                            <Checkbox label="Remember Me" />
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                            Close
                        </Button>
                        <Button variant="gradient" onClick={() => handleCallback(true)}>
                            Confirm
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}