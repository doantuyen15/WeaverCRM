import { toast } from "react-toastify";
import { getDocs, collection, getFirestore, doc, getDoc, query, deleteDoc, Firestore, updateDoc, addDoc, DocumentReference, writeBatch, setDoc, arrayUnion, collectionGroup, where, increment } from "firebase/firestore";
import glb_sv from '../../service/global-service'
import { Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken, updateProfile, Auth } from "firebase/auth";
import useStorage from "../localStorageHook";
import useRequest from './promise'
import moment from "moment";
import ClassInfo from "../../data/entities/classesInfo";
import StudentInfo from "../../data/entities/studentInfo";
import formatDate from "../formatNumber/formatDate";
import StaffInfo from "../../data/entities/staffInfo";
import Finance from "../../data/entities/finance";

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
        case 'get_staff_attendance': return getStaffAttendance()
        case 'get_all_course': return getAllCourse(params)
        case 'query_finance_table': return queryFinanceTable(params)
        case 'query_tuition': return queryTuition(params)
        case 'query_class_list': return queryClassList(params)
        case 'add_student': return addStudent(params)
        case 'update_student': return updateStudent(params)
        case 'delete_student': return deleteStudent(params)
        case 'create_staff': return createStaff(params)
        case 'update_staff': return updateStaff(params)
        case 'delete_staff': return deleteStaff(params)
        case 'add_classes': return addClasses(params)
        case 'update_class_info': return updateClassInfo(params)
        case 'delete_class_info': return deleteClassInfo(params)
        case 'add_student_classes': return addStudentClasses(params)
        case 'create_user': return createUser(params)
        case 'delete_user': return deleteUser(params)
        case 'update_user': return updateUser(params)
        case 'change_password': return changePassword(params)
        case 'update_student_attendance': return updateStudentAttendance(params)
        case 'update_staff_attendance': return updateStaffAttendance(params)
        case 'update_lessondiary': return updateLessonDiary(params)
        case 'update_student_score': return updateStudentScore(params)
        case 'update_course_info': return updateCourseInfo(params)
        case 'make_tuition': return makeTuition(params)
        case 'make_refunds': return makeRefunds(params)
        case 'make_finance': return makeFinance(params)
        case 'staff_checkin': return staffCheckin(params)
        case 'update_approval': return updateApproval(params)
        default:
            return Promise.reject('Request rejected!');
    }
}

const queryClassList = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        let queryDate
        if (!params.start_date) queryDate = where("end_date", ">=", params.end_date)
        else queryDate = where("start_date", "<=", params.start_date)    
        const q = query(
            collection(db, 'classes'),
            queryDate
        );
        getDocs(q)
            .then(
                (snap) => {
                    try {
                        resolve(snap.docs.map(item => item.data()));
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
    });
}

const queryTuition = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        let queryMonth
        if (params.class_id.includes('IELTS')) queryMonth = where("tuition_date", "!=", '')
        else queryMonth = where("tuition_date", "==", params.month)    
        const q = query(
            collectionGroup(db, 'tuition'),
            where('customer_id', '==', params.customer_id),
            queryMonth,
            where("class_id", "==", params.class_id)
        );
        getDocs(q)
            .then(
                (snap) => {
                    try {
                        resolve(snap.docs.map(item => item.data()));
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
    });
}

const queryFinanceTable = (params: string[]) => {
    return new useRequest((resolve: any, reject: any) => {
        const q = query(collectionGroup(db, 'tuition'), where('month', 'in', params));
        getDocs(q)
            .then(
                (snap) => {
                    try {
                        resolve(snap.docs.map(item => item.data()));
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
    });
}

const makeFinance = (finance: any) => {
    return new useRequest((resolve: any, reject: any) => {
        addDoc(collection(db, 'approval'), {
            make_finance: {
                'data': {...finance},
                'requesting_username': userInfo.displayName,
                'created_at': moment().toString()
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const updateCourseInfo = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        const listUpdate: any[] = Object.values(params)
        
        const batch = writeBatch(db);
        listUpdate.forEach(item => {
            const coursesRef = doc(db, 'courses', item.course_id)
            batch.update(coursesRef, {
                [item.level_id?.replace(' ','')]: item
            })
        })
        batch.commit()
            .then(resolve)
            .catch(reject)
    });
}

const getAllCourse = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        getDocs(collection(db, 'courses'))
            .then(
                (snap) => {
                    try {
                        if (params?.getId) {
                            resolve(snap.docs)
                        } else {
                            resolve(snap.docs.map((doc => doc.data())) || [])
                        }
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
    });
}

const deleteStaff = (staff: StaffInfo) => {
    return new useRequest((resolve: any, reject: any) => {
        deleteDoc(doc(db, 'staff', staff.id))
            .then(res => {
                resolve(res)
            })
            .catch((error: any) => {
                console.log('error', error);
                reject(error)
            })
    })
}

const deleteStudent = (student: StudentInfo) => {
    return new useRequest((resolve: any, reject: any) => {
        deleteDoc(doc(db, 'student', student.id))
            .then(res => {
                resolve(res)
            })
            .catch((error: any) => {
                console.log('error', error);
                reject(error)
            })
    })
}

const deleteClassInfo = (classInfo: ClassInfo) => {
    return new useRequest((resolve: any, reject: any) => {
        console.log('data', classInfo);

        deleteDoc(doc(db, 'classes', classInfo.id))
            .then(res => {
                resolve(res)
            })
            .catch((error: any) => {
                console.log('error', error);
                reject(error)
            })
    })
}

const updateClassInfo = (classInfo: ClassInfo) => {
    return new useRequest((resolve: any, reject: any) => {
        console.log('data', classInfo);

        updateDoc(doc(db, 'classes', classInfo.id), {...classInfo})
            .then(res => {
                resolve(res)
            })
            .catch((error: any) => {
                console.log('error', error);
                reject(error)
            })
    })
}

const staffCheckin = (params: any) => {
    console.log('params', {...params});
    
    return new useRequest((resolve: any, reject: any) => {
        addDoc(collection(db, 'approval'), {
            staff_checkin: {
                'data': {...params},
                'requesting_username': userInfo.displayName,
                'created_at': moment().toString()
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const updateStaffAttendance = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        console.log('data', params);

        setDoc(doc(db, 'staff', 'timetable'), {
            [params.month]: {
                ...params.calendar
            }
        })
            .then(res => {
                resolve(res)
            })
            .catch((error: any) => {
                console.log('error', error);
                
                reject(error)
                // An error occurred
                // ...
            })
    })
}

const getStaffAttendance = () => {
    return new useRequest((resolve: any, reject: any) => {
        getDoc(doc(db, 'staff', 'timetable'))
            .then(
                (snap) => {
                    try {
                        resolve(snap.data() || [])
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
    });
}

const changePassword = (params: any) => {
    return new useRequest((resolve: any, reject: any) => {
        reject('Tính năng đang phát triển!')
        // const getToken = httpsCallable(functions, 'getToken');
        // getToken({ params: params })
        //     .then((result: any) => {
        //         updateDoc(doc(db, `account/${account.username}`), { ...account })
        //         .then(res => {
        //             resolve(res)
        //         })
        //         .catch((error) => {
        //             reject(error)
        //         })
        //     })
        //     .catch((error) => {
        //         resolve(error)
        //     })
    })
}

const makeTuition = (list: any) => {
    return new useRequest((resolve: any, reject: any) => {
        addDoc(collection(db, 'approval'), {
            make_tuition: {
                'data': {...list},
                'requesting_username': userInfo.displayName,
                'created_at': moment().toString()
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const makeRefunds = (list: any) => {
    return new useRequest((resolve: any, reject: any) => {
        addDoc(collection(db, 'approval'), {
            make_refunds: {
                'data': {...list},
                'requesting_username': userInfo.displayName,
                'created_at': moment().toString()
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const getTuitionTable = (params: any) => {
    console.log('getTuitionTable', params);
    return new useRequest((resolve: any, reject: any) => {
        const q = query(
            collectionGroup(db, 'tuition'),
            where("tuition_date", "in", params),
            where("class_id", "!=", '')
        );
        getDocs(q)
            .then(
                (snap) => {
                    try {
                        resolve(snap.docs.map(item => item.data()));
                    } catch (error) {
                        reject(error)
                    }
                }
            )
            .catch(reject)
    });
    // getDocs(collection(db, `finance/${params}/tuition`))
    //     .then(
    //         (snap) => {
    //             try {
    //                 resolve(snap.docs.map(item => item.data()))
    //             } catch (error) {
    //                 reject(error)
    //             }
    //         }
    //     )
    //     .catch(reject)
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
                score_table: arrayUnion(...student.score_table)
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
                'created_at': moment().toString()
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const updateStudentAttendance = (data: any) => {
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
        const batch = writeBatch(db);
        updateList.forEach((classes) => {
            console.log('classes.id', classes);
            const classRef = doc(db, `classes/${classes.id}`);
            classes.student.forEach((student: any) => {
                const studentRef = doc(db, `student/${student.id}`);
                batch.update(studentRef, {
                    class_id: arrayUnion(classes.id)
                })
                batch.update(classRef, {
                    student_list: arrayUnion(studentRef)
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
                'created_at': moment().toString()
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
                let id: any = 0
                await getDocs(collection(db, 'student')).then(snap => {
                    const lastID = (snap.docs || [])?.at(-1)?.id || '';
                    id = Number(lastID?.slice(2))
                });
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
            } else if (approval.type === 'add_classes') {
                const classInfo = approval?.data[0] || {}
                let docId = classInfo.id
                let classRef = doc(db, 'classes', docId)
                const isExists = (await getDoc(classRef)).exists()
                if (isExists) {
                    docId = classInfo.id + '_' + moment().format('SS')
                    classInfo.id = docId
                    classRef = doc(db, 'classes', docId)
                }

                batch.set(classRef, {...classInfo})
                batch.update(classRef, {
                    tuition: doc(db, `classes/${docId}`),
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
            } else if (approval.type === 'make_tuition' || approval.type === 'make_refunds') {
                const { amount, class_id, customer_id, code, tuition_date, create_date, explain } =  approval?.data
                const financeRef = doc(db, `finance/${tuition_date}/tuition`, code)
                const classRef = doc(db, 'classes', class_id)
                let currentTuition = 0
                if (class_id.split('_')[0] === 'IELTS') {
                    const snap = await getDoc(classRef)
                    currentTuition = snap.data()?.tuition?.[tuition_date]?.[customer_id]?.amount || 0
                }

                if (approval.type === 'make_refunds' && currentTuition < amount) {
                    reject('Số tiền refunds vượt quá số tiền đã đóng!')
                }
                // let id = 0
                // await getDocs(collection(db, 'classes')).then(snap => id = snap.docs.length);

                // approval?.data?.forEach((tuition: any) => {
                //     const classId = tuition.id_class
                //     const studentId = tuition.id_student
                //     const date = tuition.month
                //     const tuitionRef = doc(db, 'tuition', date)
                //     const financeRef = doc(db, 'finance', 'timetable')
                //     const month = formatDate(tuition.create_date, date)
                //     const time = formatDate(tuition.date_ii || tuition.date, 'DDMMYYYY-HHmmSS')
                //     const financeInfo = new Finance({
                //         create_date: time,
                //         type_id: 0,
                //         type: glb_sv.billType['receive'][1],
                //         id_student: tuition.id_student,
                //         staff_name: tuition.requesting_username,
                //         explain: 'Thu tiền học phí',
                //         account_type_id: tuition.method_id,
                //         amount: tuition['tuition'],
                //         approver: userInfo.displayName
                //     })


                //     batch.update(tuitionRef, {
                //         [`${classId}.${studentId}`]: tuition
                //     })

                //     batch.update(financeRef, {
                //         [`${month}.${date}`]: {
                //             [financeInfo.code]: {...financeInfo}
                //         }
                //     })
                // })

                batch.set(financeRef, {
                    ...approval.data,
                    approver: userInfo.displayName,
                    approver_id: userInfo.uid
                })
                batch.update(classRef, {
                    tuition: {
                        [tuition_date]: {
                            [customer_id]: {
                                class_id,
                                customer_id,
                                code,
                                create_date,
                                explain,
                                amount: approval.type === 'make_tuition' ? (currentTuition + amount) : (currentTuition - amount)
                            }
                        }
                    }
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
                    // .catch((err) => {
                    //     if (err.code === 'not-found') {
                    //         const newBatch = writeBatch(db)
                    //         approval?.data?.forEach((tuition: any, index: number) => {
                    //             const classId = tuition.id_class
                    //             const studentId = tuition.id_student
                    //             const date = tuition.month
                    //             const tuitionRef = doc(db, 'tuition', date)
                    //             if (index === 0) {
                    //                 newBatch.set(tuitionRef, {
                    //                     [classId]: {
                    //                         [studentId]: tuition
                    //                     }
                    //                 })
                    //             } else {
                    //                 newBatch.update(tuitionRef, {
                    //                     [classId]: {
                    //                         [studentId]: tuition
                    //                     }
                    //                 })
                    //             }
                    //         })
                    //         newBatch.delete(approvalRef)
                    //         newBatch.commit()
                    //             .then(resolve)
                    //             .catch(reject)
                    //     } else {
                    //         reject(err)
                    //     }
                    // })
            } else if (approval.type === 'staff_checkin') {
                if (!approval.data) reject('Không xác định được nhân viên')
                const staffRef = doc(db, 'staff', 'timetable')
                const month = formatDate(approval.created_at, 'MMYYYY')
                const date = formatDate(approval.created_at, 'DDMMYYYY')
                
                batch.update(staffRef, {
                    [`${month}.${date}`]: {
                        [approval.data.id]: approval.data.status
                    }
                })
                batch.delete(approvalRef)
                batch.commit()
                    .then(resolve)
                    .catch(reject)
            } else if (approval.type === 'make_finance') {
                const month = formatDate(approval.data?.create_date, 'MMYYYY')
                const code = approval.data?.code
                const financeRef = doc(db, `finance/${month}/tuition`, code)
                
                batch.set(financeRef, {
                    ...approval.data,
                    approver: userInfo.displayName,
                    approver_id: userInfo.uid
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
                console.log('getTokenLogin', error);
                reject(error)
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
    });
}

const createUser = (account: Account) => {
    return new useRequest((resolve: any, reject: any) => {
        const createUser = httpsCallable(functions, 'createUser');
        try {
            createUser({ params: {...account} })
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
                    const data: Array<StaffInfo> = []
                    snap.docs.forEach(doc => {
                        if (doc.id !== 'timetable') {
                            const map = new StaffInfo(doc.data())
                            data.push(map)
                        }
                    })
                    resolve(data)
                }
            )
            .catch(reject)
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
    });
}


const deleteUser = (account: Account) => {
    return new useRequest((resolve: any, reject: any) => {
        deleteDoc(doc(db, "account", String(account.username)))
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
                'created_at': moment().toString()
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