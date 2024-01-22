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

export function ModalAddStudent({ handleOpen, open}) {
    return (
        <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
        >
            <Card className="mx-auto w-full max-w-[32rem]">
                <CardBody className="flex flex-col gap-4">
                    <Typography variant="h4" color="blue-gray">
                        Add Student
                    </Typography>
                    <Typography
                        className="mb-3 font-normal"
                        variant="paragraph"
                        color="gray"
                    >
                        Enter student infomation.
                    </Typography>
                    <Typography className="-mb-2" variant="h6">
                        Student Name
                    </Typography>
                    <Input label="Name" size="lg" />
                    <Typography className="-mb-2" variant="h6">
                        Student Phone
                    </Typography>
                    <Input label="Phone" size="lg" />
                    {/* <div className="-ml-2.5 -mt-3">
                        <Checkbox label="Remember Me" />
                    </div> */}
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" onClick={handleOpen} fullWidth>
                        Add
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}