import { Routes, Route } from "react-router-dom";
import {
    ChartPieIcon,
    UserIcon,
    UserPlusIcon,
    ArrowRightOnRectangleIcon,
    ChevronDoubleDownIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { routes } from "./../router";
import { Progress, Spinner, Typography } from "@material-tailwind/react";
import LogoDark from "../assets/logo/we_logo_dark80.png"
import { useState, useEffect } from "react";
import {useFetch} from "../utils/api/request";
const ipcRenderer = window.ipcRenderer
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDoc, getFirestore } from "firebase/firestore";
import { glb_sv } from "../service";
export function SplashScreen() {
    const [event, setEvent] = useState('Checking connect to server...')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [percentDownload, setPercentDownload] = useState(0)

    useEffect(() => {
        ipcRenderer?.on("update_not_available", () => {
            setStep(prev => prev += 1)
            ipcRenderer?.removeAllListeners("update_not_available");
        });

        ipcRenderer?.on("update_available", () => {
            setEvent('Updating new version...')
            setLoading(false)
            setOpenUpdate(true)
            ipcRenderer?.removeAllListeners("update_available");
        });

        ipcRenderer?.on("update_downloaded", () => {
            ipcRenderer?.removeAllListeners("update_downloaded");
            setEvent('App will be restart to install a new version!')
            setTimeout(() => {
                ipcRenderer.send("restart_app");
            }, 2000);
        });

        ipcRenderer?.on("download_progress", (event, msg) => {
            setPercentDownload(Number(Number(msg.event.percent).toFixed(2)))
        });
    
      return () => {
        ipcRenderer.removeAllListeners("splash_screen");
      }
    }, [])
    

    useEffect(() => {
        if (step === 1) fetchServer()
        else if (step === 2) checkUpdate()
        else if (step === 3) finished()
    }, [step])

    const fetchServer = () => {
        // const getUserInfo = async () => {
        //     console.log('checkRoles');

        //     await getDoc(doc(db, "account", glb_sv.userInfo.uid))
        //         .then(info => {
        //             const userRef = info.data()
        //             glb_sv.userInfo = {
        //                 ...glb_sv.userInfo,
        //                 ...userRef
        //             }
        //             navigate("/dashboard/home")
        //         });
        //     // const querySnapshot = await getDocs(usersRef);
        //     // querySnapshot.forEach((doc) => {
        //     //   console.log(doc.id, "=>", doc.data());
        //     // });
        // }
        setStep(2)
    }

    const checkUpdate = () => {
        setEvent('Checking for new version...')
        ipcRenderer?.send("check_update");
    }

    const finished = () => {
        setEvent('Finishing initialize app...')
        ipcRenderer?.send("finish_init_app");
    }
    
    return (
        <div className="h-screen w-screen grid place-items-center bg-transparent">
            <div className="bg-white rounded-3xl border-slate-200 border drop-shadow-lg grid place-items-center" style={{ height: '90%', width: '95%' }}>
                <img src={LogoDark}/>
                <div className="flex items-center">
                    {loading === 'error' ?
                        <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin"  />
                        : loading === false ?
                            <Spinner className="h-4 w-4 mr-2" />
                            : null
                    }
                    <Typography color="blue-gray" variant="h6">
                        {event}
                    </Typography>
                </div>
                {openUpdate && <div className="grid place-items-center w-[90%]">
                    <div className="mb-1 flex items-center justify-between w-full px-1">
                        <Typography variant="small" color="blue-gray" >
                            Completed
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                            {percentDownload}%
                        </Typography>
                    </div>
                    <div className="flex flex-start bg-blue-gray-50 overflow-hidden w-full font-sans rounded-full text-xs font-medium h-2.5">
                        <div class="flex justify-center items-center h-full overflow-hidden break-all rounded-full bg-gray-900 text-white transition-all duration-800"
                            style={{ width: `${percentDownload}%` }} />
                    </div>
                </div>}
            </div>
        </div>
    );
}

SplashScreen.displayName = "/src/layout/Splash.jsx";

export default SplashScreen;
