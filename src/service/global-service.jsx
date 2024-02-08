import { Subject } from 'rxjs'

class globalService {
    constructor() {
        this.userInfo = {
            roles: '',
            token: ''
        }
        this.commonEvent = new Subject()
        this.database = null
        this.showAlert = (params) => {
            this.commonEvent.next({ type: 'SHOW_ALERT', params })
        }
    }
}

const theInstance = new globalService()
window.global = theInstance
export default theInstance