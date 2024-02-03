export default function useFetch(requestInfo) {
    let { method, headers, body, service, callback, handleError } = requestInfo
    headers = {...headers, "content-type": "application/json"}
    body = JSON.stringify(body)
    console.log('fetch...', method, headers, body);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch(`https://wearver-uat.onrender.com/api/${service}`, { method, headers, body, signal: controller.signal })
        .then((response) => response.json())
        .then((data) => {
            // Gọi hàm callback
            timeout && clearTimeout(timeout)
            let resData = data.Data
            if (typeof data.Data === 'string') resData = JSON.parse(data.Data)
            if (data.success || data.status == 'success' || data.status == 'succes') callback(resData || []);
            else handleError(data.message)
        })
        .catch(error => {
            console.log('error', error.name);
            timeout && clearTimeout(timeout)
            handleError(error)
        });
}