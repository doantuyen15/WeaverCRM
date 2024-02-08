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
import config from '../configs/config.json';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import glb_sv from './global-service'
import { NotificationDialog } from "../widgets/modal/alert-popup";

export function BackgroundService() {
    const [showAlert, setShowAlert] = useState(false)
    const [alertParams, setAlertParams] = useState({});

    useEffect(() => {
        readConfigInfo()
        const commonEvent = glb_sv.commonEvent.subscribe((msg) => {
            if (msg.type === 'ALERT_MODAL') {
                setAlertParams({...msg.params, open: true})
            }
        })

        return () => {
            commonEvent.unsubscribe()
        }
    }, [])

    const readConfigInfo = async () => {
        console.log('readConfigInfo', config);
        const firebaseConfig = config.firebaseConfig
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        // await signInWithEmailAndPassword(auth, 'admin@weaver.edu.vn', 'hello1')
        // .then((userCredential) => {
        //     // Signed in
        //     const user = userCredential.user;
        //     console.log('signInWithEmailAndPassword', user);
        //     // navigate("/login")
        //     // ...
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log(errorCode, errorMessage);
        // });

        const db = getFirestore(app);
        glb_sv.database = db;
        console.log('background', db);

        // const usersRef = collection(db, "student");
        // const querySnapshot = await getDocs(usersRef);
        // querySnapshot.forEach((doc) => {
        //   console.log(doc.id, "=>", doc.data());
        // });

        try {
            // const docRef = doc(db, "student");
            // const docSnap = await getDocs(collection(db, "student"))
            // .then(function (querySnapshot) {

            //     console.log('student', querySnapshot.data());
            // })

            // await getDocs(collection('student'))
            // .then((querySnapshot) => {

            //     console.log('doc_refs', querySnapshot);
            // })
            // .catch((error) => {
            //     const errorCode = error.code;
            //     const errorMessage = error.message;
            //     console.log(errorCode, errorMessage);
            // })
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    return (
        <>
            <NotificationDialog open={alertParams.open} message={alertParams.content} handleCallback={alertParams.handleCallback} />
        </>
    );
}