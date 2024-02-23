import { toast } from "react-toastify";
import { getDocs, collection, getFirestore, doc, getDoc, query, deleteDoc, Firestore, updateDoc, addDoc, DocumentReference, writeBatch, setDoc, arrayUnion } from "firebase/firestore";
import glb_sv from '../../service/global-service'
import { Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken, updateProfile, Auth } from "firebase/auth";
import useStorage from "../localStorageHook";
import useRequest from './promise'
import moment from "moment";
import ClassInfo from "../../data/entities/classesInfo";
import StudentInfo from "../../data/entities/studentInfo";
import formatDate from "../formatNumber/formatDate";

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);
// var db = glb_sv.database
// var functions = glb_sv.functions;
let userInfo = glb_sv.userInfo
let auth: Auth;
let db: Firestore;
let functions: Functions;
let timeoutId: NodeJS.Timeout;

export function useFirebase(service: string, params: any) {
    userInfo = glb_sv.userInfo
    auth = getAuth(glb_sv.app);
    db = getFirestore(glb_sv.app);
    functions = getFunctions(glb_sv.app);
    // timeoutId = setTimeout(() => {
    //     toast.error(`Query service ${service} timed out, auto retry!`);
    // }, 5000);
    // if (!db) db = glb_sv.database
    // if (!userInfo) userInfo = glb_sv.userInfo
    // if (!functions) functions = glb_sv.functions;
    switch (service) {
        case 'get_token': return getTokenLogin(params)
        case 'get_student': return getStudent()
        case 'get_account_info': return getAccountInfo()
        case 'get_staff_list': return getStaffList()
        case 'get_staff_account': return getStaffAccount()
        case 'get_approval_list': return getApprovalList()
        case 'get_class_list': return getClassList()
        case 'get_student_score': return getStudentScore()
        case 'get_tuition_table': return getTuitionTable(params)
        case 'add_student': return addStudent(params)
        case 'update_student': return updateStudent(params)
        case 'create_staff': return createStaff(params)
        case 'update_staff': return updateStaff(params)
        case 'add_classes': return addClasses(params)
        case 'add_student_classes': return addStudentClasses(params)
        case 'create_user': return createUser(params)
        case 'delete_user': return deleteUser(params)
        case 'update_user': return updateUser(params)
        case 'update_attendance': return updateAttendance(params)
        case 'update_lessondiary': return updateLessonDiary(params)
        case 'update_student_score': return updateStudentScore(params)
        case 'make_tuition': return makeTuition(params)
        case 'update_approval': return updateApproval(params)
        default:
            return Promise.reject('Request rejected!');
    }
}

const makeTuition = (list: any[]) => {
    return new useRequest((resolve: any, reject: any) => {
        addDoc(collection(db, 'approval'), {
            make_tuition: {
                'data': list,
                'requesting_username': userInfo.displayName,
                'created_at': moment(Date.now()).format('DD.MM.YYYY')
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const getTuitionTable = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, `cashflow/tuition/${params}`))
            .then(
                (snap) => {
                    try {
                        const tuition = snap.docs.map(doc => {
                            return (
                                doc.data()
                            )
                        })
                        resolve(tuition)
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const updateLessonDiary = (classdata: any) => {
    return new useRequest((resolve: any, reject: any) => {
        console.log('classdata', classdata);
        updateDoc(doc(db, `classes/${classdata.id}`), {
            'timetable': classdata.timetable
        })
            .then(res => {
                console.log('updateLessonDiary', res);
                resolve(res)
            })
            .catch((error) => {
                console.log('updateLessonDiary', error);
                reject(error)
                // An error occurred
                // ...
            })
    })
}

const updateStudentScore = (studentList: any[]) => {
    return new useRequest((resolve: any, reject: any) => {
        const batch = writeBatch(db);
        console.log('student.student_score', studentList);
        
        studentList.forEach(student => {
            const studentRef = doc(db, 'student', student.id)

            batch.update(studentRef, {
                score_table: student.score_table
            })
        })
        batch.commit()
            .then(resolve)
            .catch(reject)
    })
}

const updateStudent = (list: any[]) => {
    return new useRequest((resolve: any, reject: any) => {
        let studentList = []
        try {
            studentList = list.map(item => { return {...item}})
        } catch (error) {
            reject(error)
        }
        addDoc(collection(db, 'approval'), {
            update_student: {
                'data': studentList,
                'requesting_username': userInfo.displayName,
                'created_at': moment(Date.now()).format('DD.MM.YYYY')
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const updateAttendance = (data: any) => {
    return new useRequest((resolve: any, reject: any) => {
        console.log('data', data);
        
        updateDoc(doc(db, `classes/${data.id}`), {
            'attendance': {
                [data.month]: data.data
            }
        })
            .then(res => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
                // An error occurred
                // ...
            })
    })
}

const addStudentClasses = (updateList: any[]) => {
    return new useRequest((resolve: any, reject: any) => {
        console.log('classes.id', updateList);
        const batch = writeBatch(db);
        updateList.forEach((classes) => {
            console.log('classes.id', classes);
            const classRef = doc(db, `classes/${classes.id}`);
            classes.student.forEach((item: any) => {
                batch.update(classRef, {
                    student_list: arrayUnion(doc(db, `student/${item.id}`))
                })
            })
        })

        batch.commit()
            .then(res => {
                resolve(res)
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            })
    })
}

const createStaff = (staffInfo: any) => {
    return new useRequest((resolve: any, reject: any) => {
        const staffRef = doc(db, 'staff', staffInfo.id)
        setDoc(staffRef, staffInfo)
            .then(resolve)
            .catch(reject)
    });
}

const updateStaff = (staff: any) => {
    return new useRequest((resolve: any, reject: any) => {
        updateDoc(doc(db, `staff/${staff.id}`), { ...staff })
            .then(res => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
                // An error occurred
                // ...
            })
            .finally(() => {
                console.log('updateUser clear tm', timeoutId);
                clearTimeout(timeoutId)
            }
            );
    })
}

const addClasses = (list: any[]) => {
    return new useRequest((resolve: any, reject: any) => {
        let classList = []
        try {
            classList = list.map(item => { return {...item}})
        } catch (error) {
            reject(error)
        }
        addDoc(collection(db, 'approval'), {
            add_classes: {
                'data': classList,
                'requesting_username': userInfo.displayName,
                'created_at': moment(Date.now()).format('DD.MM.YYYY')
            }
        })
            .then(resolve)
            .catch(reject)
    });
}

const getStudentScore = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "classes"))
            .then(
                (snap) => {
                    try {
                        const classList = snap.docs.map(doc => {
                            return (
                                doc.data()
                            )
                        })
                        resolve(classList)
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const getClassList = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "classes"))
            .then(
                (snap) => {
                    try {
                        const classList: Array<ClassInfo> = []
                        snap.docs.forEach(doc => {
                            const classInfo = new ClassInfo(doc.data())
                            classList.push(classInfo)
                        })
                        resolve(classList)
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const updateApproval = ({approval, ok}: any) => {
    return new useRequest(async (resolve: any, reject: any) => {
        const approvalRef = doc(db, 'approval', approval?.id)
        const batch = writeBatch(db);
        if (!ok) {
            deleteDoc(approvalRef).then(resolve).catch(reject)
        }
        else {
            if (approval?.data?.length === 0) {
                reject(('No data provided'));
                return
            }
            if (approval.type === 'add_student') {
                let id = 0
                await getDocs(collection(db, 'student')).then(snap => id = snap.docs.length);
                approval?.data?.forEach((student: any) => {
                    id += 1
                    const docId = 'WE' + ('00000' + id).slice(-5)
                    const studentRef = doc(db, 'student', docId)
                    batch.set(studentRef, student)
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
            } else if (approval.type === 'update_student') {
                approval?.data?.forEach((student: any) => {
                    const studentRef = doc(db, 'student', student.id)
                    batch.update(studentRef, student)
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
            } 
            else if (approval.type === 'add_classes') {
                // let id = 0
                // await getDocs(collection(db, 'classes')).then(snap => id = snap.docs.length);
                approval?.data?.forEach((classInfo: ClassInfo) => {
                    const docId = classInfo.id
                    const studentRef = doc(db, 'classes', docId)
                    batch.set(studentRef, classInfo)
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
            } else if (approval.type === 'make_tuition') {
                // let id = 0
                // await getDocs(collection(db, 'classes')).then(snap => id = snap.docs.length);
                approval?.data?.forEach((tuition: any) => {
                    const docId = tuition.id_class
                    const date = formatDate(tuition.date, 'MMYYYY')
                    const studentRef = doc(db, `cashflow/tuition/${date}`, docId)
                    batch.set(studentRef, tuition)
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
            }
        }
    })
}

const getApprovalList = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "approval"))
            .then(
                (snap) => {
                    try {
                        const data: any[] = []
                        snap.docs.forEach(docRef => {
                            const item = docRef.data()
                            Object.values(item)[0].id = docRef.id
                            data.push(item)
                        })
                        resolve(data)
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const updateUser = (account: Account) => {
    return new useRequest((resolve: any, reject: any) => {
        updateDoc(doc(db, `account/${account.username}`), { ...account })
            .then(res => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
                // An error occurred
                // ...
            })
            .finally(() => {
                console.log('updateUser clear tm', timeoutId);
                clearTimeout(timeoutId)
            }
            );
        // .finally(() => clearTimeout(timeoutId));
        // updateProfile(auth.currentUser, account)
        // .then(() => {
        //     console.log('ok');
        //     resolve('ok')
        //     // Profile updated!
        //     // ...
        // })
        // .catch((error) => {
        //     reject(error)
        //     // An error occurred
        //     // ...
        // })
        // .finally(() => clearTimeout(timeoutId));

    })
}

const getTokenLogin = (params = {}) => {
    return new useRequest((resolve: any, reject: any) => {
        const getToken = httpsCallable(functions, 'getToken');
        getToken({ params: params })
            .then(async (result: any) => {
                const token = result.data?.token;
                const roles = result.data?.roles;
                const displayName = result.data?.displayName;
                await signInWithCustomToken(auth, token)
                    .then(user => {
                        const userInfoRef = { ...user.user, roles: roles, displayName: displayName }
                        resolve(userInfoRef)
                    })
                    .catch(error => {
                        console.log('signInError', error);
                        reject()
                    })
            })
            .catch((error) => {
                console.log('data', error);
            })
            .finally(() => clearTimeout(timeoutId))

        // getDocs(collection(db, "student"))
        // .then(
        //     (snap) => {
        //         resolve(snap.docs.map(doc => doc.data()))
        //         // snap.forEach((doc) => {
        //         //     console.log(doc.id, "=>", doc.data());
        //         // });
        //     }
        // )
        // .catch(reject)
        // .finally(() => clearTimeout(timeoutId));
    });
}

const createUser = (account: Account) => {
    return new useRequest((resolve: any, reject: any) => {
        const createUser = httpsCallable(functions, 'createUser');
        try {
            createUser({ params: account })
                .then((result: any) => {
                    resolve(result)
                    toast.success(result.data?.message);
                })
                .catch((error) => {
                    reject()
                    console.log('data', error);
                })
                .finally(() => clearTimeout(timeoutId))
        } catch (error) {
            console.log('createUser', error);
        }
    });
}

const getStaffList = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "staff"))
            .then(
                (snap) => {
                    resolve(snap.docs.map(doc => doc.data()))
                    // snap.forEach((doc) => {
                    //     console.log(doc.id, "=>", doc.data());
                    // });
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const getStaffAccount = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "account"))
            .then(
                (snap) => {
                    resolve(snap.docs.map(doc => doc.data()))
                    // snap.forEach((doc) => {
                    //     console.log(doc.id, "=>", doc.data());
                    // });
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}


const deleteUser = (account: Account) => {
    return new useRequest((resolve: any, reject: any) => {
        // @ts-expect-error: aaa
        deleteDoc(doc(db, "account", account.username))
            .then(() => {
                toast.success(`Delete account ${account.username} successful!`)
                resolve('success')
            })
            .catch((err) => {
                toast.error(`error: ${err}`)
                reject()
            })
            .finally(() => clearTimeout(timeoutId))
    });
}

const getStudent = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "student"))
            .then(
                (snap) => {
                    // const res: any = snap.docs[0].data()
                    // const version = res.version
                    // delete res['version']
                    // const map = Object.values(res).map((student: any, index) => {
                    //     return { ...student, id: Object.keys(res)[index] }
                    // })
                    // if (version) useStorage('set', 'studentTable', JSON.stringify({length: map?.length, ver: version}))
                    // resolve(map)
                    const data = snap.docs.map((doc) => {
                        const map = new StudentInfo(doc.data())
                        map.id = doc.id
                        return map
                    });
                    resolve(data)
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const getAccountInfo = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "account", userInfo.uid))
            .then(
                (snap) => {
                    resolve(snap.docs.map(doc => doc.data()))
                    // snap.forEach((doc) => {
                    //     console.log(doc.id, "=>", doc.data());
                    // });
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

const addStudent = (list: any[]) => {
    return new useRequest((resolve: any, reject: any) => {
        let studentList = []
        try {
            studentList = list.map(item => { return {...item}})
        } catch (error) {
            reject(error)
        }
        addDoc(collection(db, 'approval'), {
            add_student: {
                'data': studentList,
                'requesting_username': userInfo.displayName,
                'created_at': moment(Date.now()).format('DD.MM.YYYY')
            }
        })
            .then(resolve)
            .catch(reject)
    });
}

const addToApproval = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, "add_student"))
            .then(
                (snap) => {
                    resolve(snap.docs.map(doc => doc.data()))
                    // snap.forEach((doc) => {
                    //     console.log(doc.id, "=>", doc.data());
                    // });
                }
            )
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

export function useFetch(requestInfo: any) {
    console.log('useFetch');

    // let { method, headers, body, service, callback, handleError, handleTimeout, showToast } = requestInfo
    // headers = { ...headers, "content-type": "application/json" }
    // body = JSON.stringify(body)
    // console.log('fetch...', method, headers, body);
    // fetch(`https://wearver-uat.onrender.com/api/${service}`, { method, headers, body, signal: controller.signal })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         // Gọi hàm callback
    //         timeout && clearTimeout(timeout)
    //         let resData = data.Data
    //         if (typeof data.Data === 'string') resData = JSON.parse(data.Data)
    //         if (data.status == 'success' || data.status == 'succes' || data.success == 'true') {
    //             callback(resData || []);
    //             if (showToast) toast.success(data?.message);
    //         }
    //         else {
    //             toast.error(data?.message);
    //         }
    //     })
    //     .catch(error => {
    //         console.log('error', error.name);
    //         timeout && clearTimeout(timeout)
    //         if (error.name === 'AbortError') handleTimeout && handleTimeout()
    //         else {
    //             handleError(error)
    //         }
    //     });
}