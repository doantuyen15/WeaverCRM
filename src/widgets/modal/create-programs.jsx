import React, {useEffect, useRef, useState} from "react";
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
    Select,
    Option,
} from "@material-tailwind/react";
import { useController } from "../../context";
import formatNum from "../../utils/formatNumber/formatNum";
import { PlusIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import useStorage from "../../utils/localStorageHook";
import {useFetch, useFirebase} from "../../utils/api/request";
import moment from "moment";

export function CreatePrograms({ loading, open, handleCallback }) {
    const [controller] = useController();
    const { userInfo } = controller;
    // const [loading, setLoading] = useState(false)
    const [newProgram, setNewProgram] = useState({
        id: '',
        level: [{
            level_id: '',
            hour: '',
            week: '',
            tuition: ''
        }]
    })
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [errorMsg, setErrorMsg] = useState('')

    // useEffect(() => {
    //     if (!tuition?.length) getTuition()
    // }, [])

    useEffect(() => {
        if (open === true) {
            // getStudentList()
        } else {
            setNewProgram({
                id: '',
                level: [{
                    level_id: '',
                    hour: '',
                    week: '',
                    tuition: ''
                }]
            })
            setErrorMsg('')
        }
    }, [open])

    const handleAddLevel = () => {
        const update = {...newProgram}
        update['level'].push({
            course_id: newProgram.id,
            level_id: '',
            hour: '',
            week: '',
            tuition: ''
        })
        setNewProgram(update)
    }

    const handleUpdateProgram = ({ key, index, value }) => {
        const update = {...newProgram}
        if (key === 'id') {
            update.id = value
        } else {
            update['level'][index][key] = value
        }
        setNewProgram(update)
        forceUpdate()
    }

    const validate = () => {
        const checkProgram = {...newProgram}
        let error = false
        try {
            if (checkProgram.id === '') {
                setErrorMsg('Thông tin khoá học không được bỏ trống!')
                error = true
                return
            }
            checkProgram.level?.forEach(programInfo => {
                Object.values(programInfo).forEach(info => {
                    if (!info) {
                        setErrorMsg('Thông tin khoá học không được bỏ trống!')
                        error = true
                    }
                    return
                })
            })
            if (error) return
        } catch (error) {
            console.log('updateClass', error);
        }
        setErrorMsg('')
        // newProgram['level'].forEach(item => item.course_id = newProgram.id)
        const program = {...newProgram}
        const mapProgram = {
            id: newProgram.id,
            level: {}
        }
        program['level'].forEach(item => {
            item.course_id = newProgram.id
            mapProgram.level[item.level_id] = item
        })
        handleCallback(true, mapProgram)
    }
    
    return (
        <Dialog
            size="lg"
            open={open}
            onClick={() => console.log('click add student')}
            className="bg-transparent shadow-none w-max-w z-40"
        >
            <Card className="mx-auto w-full">
                <CardBody className="flex flex-col max-h-[50vh] overflow-y-auto">
                    <div className="w-full flex flex-col gap-y-6 justify-center">
                        <div className="flex gap-4 items-center border-b border-blue-gray-50 pb-3">
                            <div className="grow menu-fixed">
                                <Input
                                    error={!newProgram.id}
                                    variant="outlined"
                                    label="Program"
                                    value={newProgram.id}
                                    onChange={(e) => handleUpdateProgram({key: 'id', value: e.target.value})}
                                />
                            </div>
                            <div className="grid grow grid-col-1 gap-y-3 menu-fixed">
                                {newProgram.level?.map((programInfo, index) => (
                                    <div className="flex items-center gap-4">
                                        <Input
                                            error={!programInfo.level_id}
                                            variant="outlined"
                                            label="Level"
                                            value={programInfo.level}
                                            onChange={(e) => handleUpdateProgram({key: 'level_id', index: index, value: e.target.value})}
                                        />
                                        <Input
                                            error={!programInfo.hour}
                                            variant="outlined"
                                            label="Tổng số giờ"
                                            type='number'
                                            value={programInfo.hour}
                                            onChange={(e) => handleUpdateProgram({ key: 'hour', index: index, value: e.target.value })}
                                        />
                                        <Input
                                            error={!programInfo.week}
                                            variant="outlined"
                                            label="Tổng số tuần"
                                            type='number'
                                            value={programInfo.week}
                                            onChange={(e) => handleUpdateProgram({ key: 'week', index: index, value: e.target.value })}
                                        />
                                        <Input
                                            error={!programInfo.tuition}
                                            variant="outlined"
                                            label="Học phí"
                                            value={formatNum(programInfo.tuition, 0)}
                                            onChange={(e) => handleUpdateProgram({ key: 'tuition', index: index, value: e.target.value?.replace(/[^\d.-]+/g, '') })}
                                        />
                                        {newProgram.level?.length > 1 ? (
                                            <div className="grow-0">
                                                <MinusCircleIcon
                                                    style={{ visibility: index == 0 ? 'hidden' : 'visible' }}
                                                    className="w-7 h-7 ml-3 text-blue-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        console.log('index', index);
                                                        const level = { ...newProgram }
                                                        level.level = level.level?.filter((_, indexClass) => indexClass !== index)
                                                        setNewProgram(level)
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                            <div className="grow-0">
                                <Button
                                    className="flex items-center"
                                    variant="text" color="blue-gray"
                                    onClick={() => handleAddLevel()}
                                    size="sm"
                                >
                                    <PlusIcon className="w-3.5 h-3.5 mr-1" />
                                    Level
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="pt-2 flex justify-between items-center">
                    <div className="grow-0 pt-0">
                        {errorMsg ? (
                            <Typography variant="small" color="red">
                                {errorMsg}
                            </Typography>
                        ) : null}
                    </div>
                    <div className="grid grid-cols-2 gaps-2 min-w-max">
                        <Button variant="text" color="blue-gray" onClick={() => handleCallback(false)}>
                            Close
                        </Button>
                        <Button
                            // disabled={updateList.findIndex(item => item.class_name === '') > -1}
                            loading={loading}
                            variant="gradient"
                            onClick={validate}
                        >
                            Confirm
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Dialog>
    );
}