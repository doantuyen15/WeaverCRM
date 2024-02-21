import { getDoc } from "firebase/firestore"
import moment from "moment"
import StudentInfo from "./studentInfo"
import formatDate from "../../utils/formatNumber/formatDate"

export default class ClassInfo {
    constructor(data) {
        this.id = data?.id || '',
        this.program = data?.program || '',
        this.level = data?.level || '',
        this.start_date = data?.start_date || '',
        this.end_date = data?.end_date || '',
        this.student_list = data?.student_list || [],
        this.teacher = data?.teacher || '',
        this.teacher_phone = data?.teacher_phone || '',
        this.sub_teacher = data?.sub_teacher || '',
        this.sub_teacher_phone = data?.sub_teacher_phone || '',
        this.ta_teacher_phone = data?.ta_teacher_phone || '',
        this.ta_teacher = data?.ta_teacher || '',
        this.cs_staff = data?.cs_staff || '',
        this.class_schedule = data?.class_schedule || '',
        this.class_schedule_id = data?.class_schedule_id || 0,
        this.converted = false,
        this.teacher_id = data?.teacher_id || '',
        this.sub_teacher_id = data?.sub_teacher_id || '',
        this.ta_teacher_id = data?.ta_teacher_id || '',
        this.cs_staff_id = data?.cs_staff_id || '',
        this.attendance = data?.attendance || [],
            this.lesson_diary = data?.lesson_diary || [{
                lesson_id: '',
                day: '',
                teacher: '',
                unit: '',
                unit_lesson: '',
                content: '',
                homeword: '',
                performance: '',
                checked: false,
            }]
    }

    getStudentList() {
        return new Promise((resolve, reject) => {
            if (this.converted) resolve(this.student_list)
            if (this.student_list.length === 0) resolve([])
            else if (this.student_list.length > 0) {
                // this.student_list.forEach(async doc => {
                //     const student = await getDoc(doc)
                //     studentList.push(student.data())
                // })
                Promise.all(this.student_list.map(docRef => getDoc(docRef)))
                    .then((res) => {
                        const items = res.map(i => {
                            return new StudentInfo ({
                                ...i.data(),
                                id: i.id
                            })
                        })
                        this.student_list = items
                        this.converted = true
                        resolve(items)
                    })
                    .catch(err => console.log('err', err))
            }
        })
    }

    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            if (key === 'program' || key === 'level') 
                this.id = this.program.toUpperCase() + '_' + this.level.toUpperCase() + '_' + formatDate(this.start_date, 'DDMMYY')
        }
    }

    updateDiary(index, key, value) {
        this.lesson_diary[index][key] = value
        console.log('info', this.lesson_diary[index]);
    }

    addDiary() {
        this.lesson_diary.push({
            lesson_id: '',
            day: '',
            teacher: '',
            unit: '',
            unit_lesson: '',
            content: '',
            homeword: '',
            performance: '',
            checked: false,
        })
    }
}
