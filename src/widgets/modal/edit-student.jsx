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
    List,
    ListItem,
} from "@material-tailwind/react";
import StudentInfo from "../../data/entities/studentInfo";

export function ModalEditStudent({ handleOpen, open, objectEdit = new StudentInfo() }) {
    return (
        <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
        >

            <Card className="mx-auto w-full max-w-[32rem]">
                <CardHeader className="m-0 rounded-none border-b py-6 border-white/10 text-center">
                    <Typography variant="h4" color="blue-gray">
                        Edit Student Info
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">

                    <Typography
                        className="mb-3 font-normal"
                        variant="paragraph"
                        color="gray"
                    >
                        Confirm list edited student's infomation.
                    </Typography>
                    <List>
                        {objectEdit.map(({ firstname, lastname, status }) => (
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {firstname + ' ' + lastname}
                            </Typography>
                        ))}
                    </List>

                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" onClick={handleOpen} fullWidth>
                        Request Edit
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}