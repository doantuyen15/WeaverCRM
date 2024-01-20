const useStorage = (type, key, value = '') => {
    if (type == 'get') {
        if (key === 'config') {
            if (!JSON.parse(localStorage.getItem(key))) return value
            return JSON.parse(localStorage.getItem(key))
        }
        else {
            if (!JSON.parse(localStorage.getItem(key))) return value
            return JSON.parse(localStorage.getItem(key))
        }
    } else if (type === 'set') {
        if (key === 'config') {
            if (localStorage.getItem('config') !== value)
                // window.ipcRenderer?.send('ipc_event', {
                //     type: 'update_config',
                //     value: newConfig
                // })
                localStorage.setItem(key, value)
        }
        else localStorage.setItem(key, JSON.stringify(value))
    }
}

export default useStorage