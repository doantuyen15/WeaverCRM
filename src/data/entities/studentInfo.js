import moment from "moment"

export default class StudentInfo {
    constructor() {
        this.status_res = '1'
        this.dob = '',
            this.first_name = '',
            this.last_name = '',
            this.phone = '',
            this.parent_phone = '',
            this.address = '',
            this.email = '',
            this.referrer = '',
            this.advisor = '',
            this.register_date = moment(Date.now()).format('DD/MM/YYYY'),
            this.listening = '',
            this.speaking = '',
            this.reading = '',
            this.writing = '',
            this.grammar = '',
            this.vocabulary = '',
            this.test_input_score = '',
            this.id_class_temp = '',
            this.note = '',
            this.has_score = false,
            this.full_name = ''
    }
    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            if (key === 'last_name' || key === 'first_name') this.full_name = this.first_name + ' ' + this.last_name
        }
    }
}
