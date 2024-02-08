import { toast } from "react-toastify";
import { getDocs, collection, getFirestore, doc, getDoc, query } from "firebase/firestore";
import glb_sv from '../../service/global-service'

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);
var db = glb_sv.database
var userInfo = glb_sv.userInfo

export function useQuery(service) {
    if (!db) db = glb_sv.database
    if (!userInfo) userInfo = glb_sv.userInfo
    switch (service) {
        case 'get_student': return getStudent()
        case 'add_student': return addStudent()
        case 'get_account_info': return getAccountInfo()
        default:
            break;
    }
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
    headers = {...headers, "content-type": "application/json"}
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