import moment from "moment"
import Deburr from "../../utils/formatNumber/deburr"
export default class StaffInfo {
    constructor(info) {
        this.id = info?.id || ''
        this.phone = info?.phone || '', 
        this.full_name = info?.full_name || '', 
        this.short_name = info?.short_name || '', 
        this.id_number = info?.id_number || '', 
        this.id_date = info?.id_date || '', 
        this.id_place = info?.id_place || '', 
        this.dob = info?.dob || '', 
        this.address = info?.address || '', 
        this.email = info?.email || '', 
        this.roles = info?.roles || [],
        this.department = info?.department || '',
        this.bank_number = info?.bank_number || '',
        this.bank_branch = info?.bank_branch || '',
        this.academic = info?.academic || '',
        this.graduated_school = info?.graduated_school || '',
        this.working_status = info?.working_status || '',
        this.work_date = info?.work_date || '',
        this.end_date = info?.end_date || '',
        this.note = info?.note || '',
        this.isUpdate = info?.isUpdate || false
        this.roles_id = info?.roles_id || -1
        this.department_id = info?.department_id || -1
        this.academic_id = info?.academic_id || 0
        this.working_status_id = info?.working_status_id || 0
    }
    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            if (key === 'full_name') {
                const nameSplit = value.split(' ')
                this.short_name = Deburr(nameSplit[nameSplit.length - 1] + nameSplit[0][0])
            }
        }
    }
}
