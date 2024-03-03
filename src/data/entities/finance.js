import moment from "moment"

export default class Finance {
    constructor(info) {
        this.isPayment = info?.isPayment || false
        this.create_date = info?.create_date || moment().format('DDMMYYYY')
        this.type_id = info?.type_id || 0
        this.code = info?.code || (this.isPayment ? 'C' : 'T') + this.type_id + '-' + moment().format('DDMMYY-HHmmSS')
        this.type = info?.type || ''
        this.amount = info?.amount || 0
        this.account_type = info?.account_type || ''
        this.account_type_id = info?.account_type_id || 0
        this.department = info?.department || ''
        this.department_id = info?.department_id || -1
        this.staff_name = info?.staff_name || ''
        this.staff_id = info?.staff_id || -1
        this.explain = info?.explain || '',
        this.approver = info?.approver || '',
        this.id_student = info?.id_student || ""
    }
    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            if (key === 'department') {
                this.staff_id = -1
                this.staff_name = ''
            }
            if (['create_date', 'type_id'].includes(key)) this.code = (this.isPayment ? 'C' : 'T') + this.type_id + '-' + moment(this.create_date, 'DDMMYY').format('DDMMYY') + moment().format('-HHmmSS')
        }
    }
}
