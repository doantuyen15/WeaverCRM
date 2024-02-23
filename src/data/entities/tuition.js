import moment from "moment"

export default class Tuition {
    constructor(info) {
        this.id = info?.id || ''
        this.phone = info?.phone || '', 
        this.full_name = info?.full_name || '', 
        this.id_number = info?.id_number || '', 
        this.id_date = info?.id_date || ''
    }

    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            // if (!this.id) this.id = this.first_name + ' ' + this.last_name
        }
    }
}
