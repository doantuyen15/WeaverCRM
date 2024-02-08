import { toast } from "react-toastify";
import { getDocs, collection, getFirestore, doc, getDoc, query } from "firebase/firestore";
import glb_sv from '../../service/global-service'

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

export async function useQuery(service) {
    const db = glb_sv.database
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject('Query timed out');
        }, 5000); // Set your desired timeout in milliseconds
        if (service === 'student') {
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
        }
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