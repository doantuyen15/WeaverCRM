import { Subject } from 'rxjs'

class globalService {
    constructor() {
        this.userInfo = {
            'uid': '',
            'email': '',
            'emailVerified': '',
            'isAnonymous': '',
            'providerData': '',
            'stsTokenManager': '',
            'createdAt': '',
            'lastLoginAt': '',
            'apiKey': '',
            'appName': '',
            'username': '',
            'roles': '',
            'cert': {}
        }
        this.commonEvent = new Subject()
        this.database = null
        this.auth = null
        this.app = null
        this.functions = null
        this.showAlert = ({content, handleCallback}) => {
            this.commonEvent.next({ type: 'SHOW_ALERT', params: {content: content, handleCallback: handleCallback} })
        }
    }
}

const theInstance = new globalService()
window.glb_sv = theInstance
export default theInstance