import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { initializeApp } from "firebase/app";
import { getDocs, collection, getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NotificationDialog } from "../widgets/modal/alert-popup";
import useStorage from "../utils/localStorageHook";
import { Navigate } from "react-router-dom";
import { glb_sv } from "./index";
import config from '../configs/config.json';
import { getFunctions } from 'firebase/functions';
import { useController, setUserInfo, setFirebase } from "../context";
const ipcRenderer = window.ipcRenderer

export function BackgroundService() {
    const [showAlert, setShowAlert] = useState(false)
    const [alertParams, setAlertParams] = useState({});
    const [controller, dispatch] = useController();

    useEffect(() => {
        readConfigInfo()


        const commonEvent = glb_sv.commonEvent.subscribe((msg) => {
            if (msg.type === 'ALERT_MODAL') {
                setAlertParams({ ...msg.params, open: true })
            }
        })

        return () => {
            commonEvent.unsubscribe()
        }
    }, [])

    const readConfigInfo = async () => {
        const firebaseConfig = config.firebaseConfig
        const app = initializeApp(firebaseConfig);
        // const auth = getAuth(app);
        // const db = getFirestore(app);
        // const functions = getFunctions(app);
        // glb_sv.database = db;
        // glb_sv.auth = auth
        // glb_sv.functions = functions
        glb_sv.app = app

        const userInfo = useStorage('get', 'userInfo')
        console.log('readConfigInfo', userInfo);
        if (userInfo.uid) {
            console.log('userInfo', userInfo);
            glb_sv.userInfo = userInfo
            setUserInfo(dispatch, userInfo)
        }



        // const usersRef = collection(db, "student");
        // const querySnapshot = await getDocs(usersRef);
        // querySnapshot.forEach((doc) => {
        //   console.log(doc.id, "=>", doc.data());
        // });

        // try {
        //     // const docRef = doc(db, "student");
        //     // const docSnap = await getDocs(collection(db, "student"))
        //     // .then(function (querySnapshot) {

        //     //     console.log('student', querySnapshot.data());
        //     // })

        //     // await getDocs(collection('student'))
        //     // .then((querySnapshot) => {

        //     //     console.log('doc_refs', querySnapshot);
        //     // })
        //     // .catch((error) => {
        //     //     const errorCode = error.code;
        //     //     const errorMessage = error.message;
        //     //     console.log(errorCode, errorMessage);
        //     // })
        // } catch (error) {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log(errorCode, errorMessage);
        // }
    }

    return (
        <>
            <NotificationDialog open={alertParams.open} message={alertParams.content} handleCallback={alertParams.handleCallback} />
        </>
    );
}