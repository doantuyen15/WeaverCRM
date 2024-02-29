import moment from "moment"
import formatNum from "../../utils/formatNumber/formatNum"

export default class StudentInfo {
    constructor(data) {
        this.id = data?.id || ''
        this.status_res = data?.status_res || 0
        this.dob = data?.dob || '',
            this.first_name = data?.first_name || '',
            this.last_name = data?.last_name || '',
            this.phone = data?.phone || '',
            this.parent_phone = data?.parent_phone || '',
            this.address = data?.address || '',
            this.email = data?.email || '',
            this.referrer = data?.referrer || '',
            this.advisor = data?.advisor || '',
            this.register_date = data?.register_date || moment().format('DD/MM/YYYY'),
            this.score_table = data?.score_table || []
            this.id_class_temp = data?.id_class_temp || '',
            this.note = data?.note || '',
            this.has_score = data?.has_score || false,
            this.full_name = data?.full_name || ''
            this.class_id = data?.class_id || []
    }
    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            if (key === 'last_name' || key === 'first_name') this.full_name = this.first_name + ' ' + this.last_name
        }
    }
    updateScore({classId, type, key, score}) {
        if (!classId || !score || !key) return
        // if (classId === 'test') {
        //     this.score_table[classId][key] = score
        //     this.score_table[classId]['class_id'] = 'test'
        //     this.score_table[classId]['total'] = formatNum((
        //         Number(this.score_table[classId].listening) +
        //         Number(this.score_table[classId].reading) +
        //         Number(this.score_table[classId].speaking) +
        //         Number(this.score_table[classId].writing)
        //     ) / 4, 1, 'overall')
        //     this.score_table[classId]['update_time'] = moment().format('DDMMYYYYHHmmss')
        // }
        // else {
        // this.score_table = [
        //     ...this.score_table[classId],
        //     {
        //         class_id: classId,
        //         listening: '',
        //         speaking: '',
        //         reading: '',
        //         writing: '',
        //         total: '',
        //         update_time: '',
        //     }
        // ]
        let scoreUpdate = this.score_table.find(item => item?.class_id === classId && item?.term === type)
        if (!scoreUpdate) {
            scoreUpdate = {
                class_id: classId,
                listening: '',
                speaking: '',
                reading: '',
                writing: '',
                total: '',
                grammar: '',
                update_time: moment().format('DDMMYYYYHHmmss'),
                term: type
            }
            this.score_table.push(scoreUpdate)
        }
        scoreUpdate[key] = score;
        scoreUpdate['total'] = formatNum((
            Number(scoreUpdate.listening) +
            Number(scoreUpdate.reading) +
            Number(scoreUpdate.speaking) +
            Number(scoreUpdate.writing)
        ) / 4, 1, 'overall')
        this.score_table['update_time'] = moment().format('DDMMYYYYHHmmss')
        this.has_score = true
        // this.score_table[classId][type][key] = score
        // this.score_table[classId][type]['class_id'] = classId
        // this.score_table[classId][type]['total'] = formatNum((
        //     Number(this.score_table[classId][type].listening) +
        //     Number(this.score_table[classId][type].reading) +
        //     Number(this.score_table[classId][type].speaking) +
        //     Number(this.score_table[classId][type].writing)
        // ) / 4, 1, 'overall')
        // this.score_table[classId][type]['update_time'] = moment().format('DDMMYYYYHHmmss')
        // }
    }
}
