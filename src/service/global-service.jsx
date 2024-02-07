import { Subject } from 'rxjs'

class globalService {
    constructor() {
        this.userInfo = {
            roles: '',
            token: ''
        }
        this.commonEvent = new Subject()
    }
}

const theInstance = new globalService()
window.global = theInstance
export default theInstance