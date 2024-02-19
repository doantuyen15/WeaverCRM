import moment from "moment"

export default class StudentInfo {
    constructor(data) {
        this.id = data?.id || ''
        this.status_res = data?.status_res || '1'
        this.dob = data?.dob || '',
            this.first_name = data?.first_name || '',
            this.last_name = data?.last_name || '',
            this.phone = data?.phone || '',
            this.parent_phone = data?.parent_phone || '',
            this.address = data?.address || '',
            this.email = data?.email || '',
            this.referrer = data?.referrer || '',
            this.advisor = data?.advisor || '',
            this.register_date = data?.register_date || moment(Date.now()).format('DD/MM/YYYY'),
            this.score_table = data?.score_table || {
                test: {
                    listening: '',
                    speaking: '',
                    reading: '',
                    writing: '',
                    total: '',
                }
            }
        this.id_class_temp = data?.id_class_temp || '',
            this.note = data?.note || '',
            this.has_score = data?.has_score || false,
            this.full_name = data?.full_name || ''
    }
    updateInfo(key, value) {
        if (['listening', 'speaking', 'reading', 'writing'].includes(key)) {
            this.score_table.test[key] = value
            // this.score_table?.test?.total = this.score_table?.test?
        } else if (this[key] !== undefined) {
            this[key] = value
            if (key === 'last_name' || key === 'first_name') this.full_name = this.first_name + ' ' + this.last_name
        }
    }
}
