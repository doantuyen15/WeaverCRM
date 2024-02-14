import { toast } from "react-toastify";
import { getDocs, collection, getFirestore, doc, getDoc, query, deleteDoc, Firestore, updateDoc, addDoc, DocumentReference, writeBatch, setDoc } from "firebase/firestore";
import glb_sv from '../../service/global-service'
import { Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken, updateProfile, Auth } from "firebase/auth";
import useStorage from "../localStorageHook";
import useRequest from './promise'
import moment from "moment";

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
        case 'get_approval_list': return getApprovalList()
        case 'add_student': return addStudent(params)
        case 'create_user': return createUser(params)
        case 'delete_user': return deleteUser(params)
        case 'update_user': return updateUser(params)
        case 'update_approval': return updateApproval(params)
        default:
            break;
    }
}

const updateApproval = (approval: any) => {
    return new useRequest(async (resolve: any, reject: any) => {
        if (approval.type === 'add_student') {
            const batch = writeBatch(db);
            if (approval?.data?.length === 0) {
                reject(('No data provided'));
                return
            }
            const listUpdate: any = {}
            let id = 0
            await getDoc(doc(db, 'student', 'table')).then((list) => console.log('getDoc', id = (Object.keys(list.data() as any)?.length-1 || 0)));
            approval?.data?.forEach((student: any) => {
                id += 1
                listUpdate['WE' + ('00000' + id).slice(-5)] = student
            })
            const studentRef = doc(db, 'student', 'table')
            batch.update(studentRef, listUpdate)
            batch.delete(doc(db, 'approval', approval?.id))
            batch.commit()
                .then(resolve)
                .catch(reject)
        }


        // updateDoc(doc(db, "student", "table"), 'approval')
        //     .then(res => {
        //         resolve(res)
        //     })
        //     .catch((error) => {
        //         reject(error)
        //         // An error occurred
        //         // ...
        //     })
        //     .finally(() => {
        //         console.log('updateUser clear tm', timeoutId);
        //         clearTimeout(timeoutId)
        //     }
        // deleteDoc(doc(db, `approval/${account.username}`), { ...account })
        //     .then(res => {
        //         resolve(res)
        //     })
        //     .catch((error) => {
        //         reject(error)
        //         // An error occurred
        //         // ...
        //     })
        //     .finally(() => {
        //         console.log('updateUser clear tm', timeoutId);
        //         clearTimeout(timeoutId)
        //     }
        //     );
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
                        console.log(snap);
                        
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
                    const res: any = snap.docs[0].data()
                    const version = res.version
                    delete res['version']
                    const map = Object.values(res).map((student: any, index) => {
                        return { ...student, id: Object.keys(res)[index] }
                    })
                    if (version) useStorage('set', 'studentTable', JSON.stringify({length: map?.length, ver: version}))
                    resolve(map)
                    // snap.forEach((doc) => {
                    //     console.log(doc.id, "=>", doc.data());
                    // });
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
        addDoc(collection(db, 'approval'), {
            add_student: {
                'data': list,
                'requesting_username': userInfo.displayName,
                'created_at': moment(Date.now()).format('DD.MM.YYYY')
            }
        })
            .then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
        // getDocs(collection(db, "approval"))
        //     .then(
        //         (snap) => {
        //             resolve(snap.docs.map(doc => doc.data()))
        //             // snap.forEach((doc) => {
        //             //     console.log(doc.id, "=>", doc.data());
        //             // });
        //         }
        //     )
        //     .catch(reject)
        //     .finally(() => clearTimeout(timeoutId));
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