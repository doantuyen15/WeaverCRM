import { toast } from "react-toastify";
import { getDocs, collection, getFirestore, doc, getDoc, query, deleteDoc } from "firebase/firestore";
import glb_sv from '../../service/global-service'
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from "firebase/auth";
import useStorage from "../localStorageHook";

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);
var db = glb_sv.database
var userInfo = glb_sv.userInfo
var functions = glb_sv.functions;

export function useFirebase(service, params = {}) {
    if (!db) db = glb_sv.database
    if (!userInfo) userInfo = glb_sv.userInfo
    if (!functions) functions = glb_sv.functions;
    switch (service) {
        case 'get_token': return getTokenLogin(params)
        case 'get_student': return getStudent()
        case 'add_student': return addStudent()
        case 'get_account_info': return getAccountInfo()
        case 'create_user': return createUser(params)
        case 'get_staff_list': return getStaffList()
        case 'update_user': return updateUser(params)
        default:
            break;
    }
}

const getTokenLogin = (params) => {
    const auth = glb_sv.auth
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
        const getToken = httpsCallable(functions, 'getToken');
        getToken({ params: params })
            .then(async (result) => {
                const token = result.data.token;
                const roles = result.data.roles;
                const displayName = result.data.displayName;
                await signInWithCustomToken(auth, token)
                    .then(user => {
                        const userInfoRef = {...user.user, roles: roles, displayName: displayName}
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

const createUser = (account) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
        const createUser = httpsCallable(functions, 'createUser');
        try {
            createUser({ params: account })
                .then((result) => {
                    resolve()
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
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
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

const updateUser = ({type, account}) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
        deleteDoc(doc(db, "account", account.username))
            .then(() => {
                toast.success(`Delete account ${account.username} successful!`)
                resolve()
            })
            .catch((err) => {
                toast.error(`error: ${err}`)
                reject()
            })
            .finally(() => clearTimeout(timeoutId))
    });
}

const getStudent = () => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
        getDocs(collection(db, "student"))
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

const getAccountInfo = () => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
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

const addStudent = () => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
        getDocs(collection(db, "approval"))
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

const addToApproval = () => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000);
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

export function useFetch(requestInfo) {
    let { method, headers, body, service, callback, handleError, handleTimeout, showToast } = requestInfo
    headers = { ...headers, "content-type": "application/json" }
    body = JSON.stringify(body)
    console.log('fetch...', method, headers, body);
    fetch(`https://wearver-uat.onrender.com/api/${service}`, { method, headers, body, signal: controller.signal })
        .then((response) => response.json())
        .then((data) => {
            // Gọi hàm callback
            timeout && clearTimeout(timeout)
            let resData = data.Data
            if (typeof data.Data === 'string') resData = JSON.parse(data.Data)
            if (data.status == 'success' || data.status == 'succes' || data.success == 'true') {
                callback(resData || []);
                if (showToast) toast.success(data?.message);
            }
            else {
                toast.error(data?.message);
            }
        })
        .catch(error => {
            console.log('error', error.name);
            timeout && clearTimeout(timeout)
            if (error.name === 'AbortError') handleTimeout && handleTimeout()
            else {
                handleError(error)
            }
        });
}