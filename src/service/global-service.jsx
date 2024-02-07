import { Subject } from 'rxjs'

class globalService {
    constructor() {
        this.userInfo = {
            roles: '',
            token: ''
        }
        this.commonEvent = new Subject()
        this.database = null
    }
}

const theInstance = new globalService()
window.global = theInstance
export default theInstance