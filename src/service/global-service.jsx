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
            'cert': {},
            'displayName': '',
            'staff_id': '',
            'staff_name': ''
        }
        this.database = null
        this.auth = null
        this.app = null
        this.functions = null
        this.commonEvent = new Subject()
        this.showAlert = ({ content, handleCallback }) => {
            this.commonEvent.next({ type: 'SHOW_ALERT', params: { content: content, handleCallback: handleCallback } })
        }
        this.roles = [
            'CEO',
            'Kế toán',
            'Giáo Vụ',
            'Giáo viên',
            'Trợ giảng',
            'Nhân viên'
        ]
        this.department = [
            "All",
            "Đào tạo",
            "Kế toán",
            "Marketing",
            "Sale"
        ]
        this.academic = [
            'Chưa',
            'Cao đẳng',
            'Đại học',
            'Cử nhân',
            'Thạc sĩ',
            'Tiến sĩ',
            'Giáo sư'
        ]
        this.programs = [
            'LIFE',
            'IELTS',
            'TEENS'
        ]
        this.classSchedule = [
            'Thứ 2 - 4',
            'Thứ 3 - 5',
            'Thứ 7 - CN',
            'Thứ 6',
        ]
        this.offday = [
            '05/02', '06/02', '07/02', '08/02', '09/02', '10/02', '11/02', '12/02', '13/02', '14/02', '15/02', '16/02', '17/02', '18/02', //nghỉ tết
            '30/04', '01/05',
        ]
        this.getTuitionFee = {
            'LIFE': [
                { key: 'Monthly', value: 700000 }
            ],
            'IELTS': [
                { key: 'Full', value: 4000000 },
                { key: 'Half', value: 2000000 }
            ],
            'TEENS': [
                { key: 'Monthly', value: 700000 }
            ]
        }
        this.semester = {
            LIFE: [
                'Kỳ I',
                'Kỳ II',
                'Kỳ III'
            ],
            NORMAL: [
                'Giữa kỳ',
                'Cuối Kỳ'
            ],
            VALUE: {
                LIFE: [
                    'mid_i',
                    'mid_ii',
                    'mid_iii'
                ],
                NORMAL: [
                    'mid',
                    'final'
                ],
            },
            MAP: {
                'mid_i': 'Kỳ I',
                'mid_ii': 'Kỳ II',
                'mid_iii': 'Kỳ III',
                'mid': 'Giữa kỳ',
                'final': 'Cuối Kỳ'
            }
        }
        this.HEADER_STUDENT = [
            "Tình trạng đăng ký",
            "ID",
            "Họ",
            "Tên",
            "Ngày đăng ký",
            "Chương trình học/lớp",
            "Điểm",
            "Số điện thoại",
            "Ngày sinh",
            "Số điện thoại phụ",
            "Địa chỉ",
            "Email",
            "Người giới thiệu",
            "Advisor",
            "Note"
        ]
        this.ListStatus = [
            {
                type: 0,
                status: 'Đã đăng ký',
                color: 'green'
            },
            {
                type: 1,
                status: 'Chưa đăng ký',
                color: 'red'
            },
            {
                type: 2,
                status: 'Đã nghỉ',
                color: 'gray'
            },
            {
                type: 3,
                status: 'Đang chờ lớp',
                color: 'orange'
            }
        ]
    }
}

const theInstance = new globalService()
window.glb_sv = theInstance
export default theInstance