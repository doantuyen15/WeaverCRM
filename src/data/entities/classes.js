import { getDoc } from "firebase/firestore"
import moment from "moment"

export default class ClassInfo {
    constructor(data) {
        this.id = data?.id || '',
        this.start_date = data?.start_date || '',
        this.end_date = data?.end_date || '',
        this.student_list = data?.student_list || [],
        this.teacher = data?.teacher || '',
        this.teacher_phone = data?.teacher_phone || ''
        this.sub_teacher = data?.sub_teacher || '',
        this.sub_teacher_phone = data?.sub_teacher_phone || ''
        this.ta_teacher_phone = data?.ta_teacher_phone || ''
        this.ta_teacher = data?.ta_teacher || '',
        this.cs_staff = data?.cs_staff || '',
        this.class_schedule = data?.class_schedule || ''
        this.converted = false
        this.getStudentList = new Promise((resolve, reject) => {
            try {
                if (this.converted) return this.student_list
                const studentList = []
                if (this.student_list.length === 0) return []
                else if (this.student_list.length > 0) {
                    this.student_list.forEach(async doc => {
                        const student = await getDoc(doc)
                        studentList.push(student.data())
                    })
                    resolve()
                    this.converted = true
                    // return studentList
                }
                this.student_list = studentList
            } catch (error) {
                reject(error)
            }
        })
    }

    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            // if (key === 'last_name' || key === 'first_name') this.full_name = this.first_name + ' ' + this.last_name
        }
    }
}
