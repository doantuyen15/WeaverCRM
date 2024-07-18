import moment from 'moment'
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
            this.commonEvent.next({ type: 'ALERT_MODAL', params: { content: content, handleCallback: handleCallback } })
        }
        this.billType = {
            'pay': [
                'Loại khác',
                'Chi tiền vật tư / thiết bị',
                'Chi tiền lương',
            ],
            'receive': [
                'Loại khác',
                'Thu tiền học phí',
            ],
        }
        this.roles = [
            'Admin',
            'Quản lý vận hành',
            'Quản lý tài chính',
            'Sale',
            'Kiểm soát chất lượng',
            'Giáo Viên',
            // 'Nhân viên'
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
            '30/04', '01/05', '02/09'
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
            },
            {
                type: 4,
                status: 'Học thử',
                color: 'blue'
            }
        ]
        this.HEADER_TUITION = ['Mã HS', 'Tên', 'Ngày đóng', 'Số tiền còn lại', 'Ghi chú']
        this.FINANCE_HEAD = [
          "department",
          "code",
          "isPayment",
          "explain",
          "account_type",
          "amount",
          "approver",
          "tuition_date",
          "class_id",
          "department_id",
          "approver_id",
          "create_date",
          "staff_phone",
          "staff_name",
          "staff_id",
          "customer",
          "type",
          "type_id",
          "customer_id",
          "account_type_id",
        ];
        this.calenderWeek = () => {
            let dayArr = []
            for (let i = 1; i <= 7; i++) {
                const currentDay = {
                    weekDay: moment().day(i).format('dddd'),
                    date: moment().day(i).format('DD/MM/YYYY')
                }
                dayArr.push(currentDay)
            }
            return dayArr
        }
        this.all_course = {
            "EXTRA": {
                "SKILL": {
                    "course_id": "EXTRA",
                    "week": "5",
                    "hour": "1",
                    "tuition": "400000",
                    "level_id": "SKILL"
                },
                "IELST": {
                    "course_id": "EXTRA",
                    "hour": "1",
                    "level_id": "IELST",
                    "week": "10",
                    "tuition": "400000"
                }
            },
            "IELTS": {
                "DIAMONDA": {
                    "week": "12",
                    "course_id": "IELTS",
                    "tuition": "4600000",
                    "hour": "48",
                    "level_id": "DIAMOND A"
                },
                "SILVERB": {
                    "tuition": "4000000",
                    "hour": "48",
                    "course_id": "IELTS",
                    "level_id": "SILVER B",
                    "week": "12"
                },
                "MASTERA": {
                    "week": "12",
                    "course_id": "IELTS",
                    "hour": "48",
                    "level_id": "MASTER A",
                    "tuition": "4900000"
                },
                "GOLDA": {
                    "week": "12",
                    "level_id": "GOLD A",
                    "tuition": "4300000",
                    "hour": "48",
                    "course_id": "IELTS"
                },
                "GOLDB": {
                    "level_id": "GOLD B",
                    "hour": "48",
                    "course_id": "IELTS",
                    "tuition": "4300000",
                    "week": "12"
                },
                "MASTERB": {
                    "week": "12",
                    "hour": "48",
                    "level_id": "MASTER B",
                    "course_id": "IELTS",
                    "tuition": "4900000"
                },
                "SILVERA": {
                    "level_id": "SILVER A",
                    "tuition": "4000000",
                    "hour": "48",
                    "week": "12",
                    "course_id": "IELTS"
                },
                "DIAMONDB": {
                    "hour": "48",
                    "week": "12",
                    "course_id": "IELTS",
                    "level_id": "DIAMOND B",
                    "tuition": "4600000"
                }
            },
            "LIFE": {
                "A2B1": {
                    "week": "48",
                    "level_id": "A2B1",
                    "hour": "144",
                    "course_id": "LIFE",
                    "tuition": "700000"
                },
                "A1A2": {
                    "course_id": "LIFE",
                    "hour": "144",
                    "level_id": "A1A2",
                    "tuition": "700000",
                    "week": "48"
                }
            },
            "TEENS": {
                "1A": {
                    "tuition": "5000000",
                    "hour": "64",
                    "level_id": "1A",
                    "course_id": "TEENS",
                    "week": "16"
                },
                "2B": {
                    "level_id": "2B",
                    "tuition": "5400000",
                    "week": "14",
                    "course_id": "TEENS",
                    "hour": "64"
                },
                "2A": {
                    "tuition": "5300000",
                    "week": "14",
                    "level_id": "2A",
                    "course_id": "TEENS",
                    "hour": "64"
                },
                "3A": {
                    "week": "14",
                    "level_id": "3A",
                    "tuition": "5400000",
                    "course_id": "TEENS",
                    "hour": "64"
                },
                "3B": {
                    "tuition": "5300000",
                    "hour": "64",
                    "course_id": "TEENS",
                    "week": "14",
                    "level_id": "3B"
                },
                "1B": {
                    "week": "16",
                    "tuition": "5000000",
                    "level_id": "1B",
                    "hour": "64",
                    "course_id": "TEENS"
                }
            }
        }
        this.apiCredentials = null
    }
}

const theInstance = new globalService()
window.glb_sv = theInstance
export default theInstance