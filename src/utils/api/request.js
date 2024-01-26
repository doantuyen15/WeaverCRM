export default function useFetch(requestInfo) {
    let { method, headers, body, service, callback, handleError } = requestInfo
    headers = {...headers, "content-type": "application/json"}
    body = JSON.stringify(body)
    console.log(method, headers, body, typeof body);
    fetch(`https://wearver-uat.onrender.com/api/${service}`, { method, headers, body })
        .then((response) => response.json())
        .then((data) => {
            // Gọi hàm callback
            console.log('callback', data);
            if (data.success || data.status == 'success') callback(data.Data || []);
            else handleError(data.message)
        })
        .catch((error) => {
            console.log('error', error);
            handleError(error)
        });
}