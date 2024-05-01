import { getDoc, getDocs } from "firebase/firestore"
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
        this.class_code = data?.class_code || '',
        this.textbooks = data?.textbooks ||'',
        this.tuition = data?.tuition || {}
        this.end_date_stamp = data?.end_date_stamp || ''
        // this.attendance = data?.attendance || [],
        this.lesson_diary_note = '* Teachers are required to complete Lesson Diary within 24hrs after each lesson has finished.'
        this.timetable = data?.timetable || [{
            session: 1,
            status: 0, //0 active, 1 nghỉ, 2 lý do khác
            reason: '',
            day: '',
            // lesson_diary: {
            //     lesson_id: 1,
            //     day: '',
            //     teacher: '',
            //     teacher_id: '',
            //     unit: '',
            //     unit_lesson: '',
            //     content: '',
            //     homework: '',
            //     performance: '',
            //     checked: false,
            //     admin_note: ''
            // },
            attendance: {}
        }]
        this.lesson_diary = data?.lesson_diary || [{ name: 'Sheet1', column: 10, celldata: [{ r: 0, c: 0, v: null }] }]
        this.student = data?.student || ''
        this.student_id = data?.student_id || ''
    }

    getStudentList() {
        return new Promise((resolve, reject) => {
            if (this.converted) resolve(this.student_list)
            else if (this.student_list.length === 0) resolve([])
            else if (this.student_list.length > 0) {
                // this.student_list.forEach(async doc => {
                //     const student = await getDoc(doc)
                //     studentList.push(student.data())
                // })
                Promise.all(this.student_list.map(docRef => getDoc(docRef)))
                    .then((res) => {
                        const items = []
                        res.forEach(i => {
                            if (i.data()) {
                                items.push(
                                    new StudentInfo({
                                        ...i.data(),
                                        id: i.id
                                    })
                                )
                            }
                        })
                        this.student_list = items
                        this.converted = true
                        resolve(items)
                    })
                    .catch(err => console.log('err', err))
            }
        })
    }

    // getTuitionTable(month) {
    //     return new Promise((resolve, reject) => {
    //         if (this.tuition[month]) resolve(this.tuition[month])
    //         // else if (this.student_list.length === 0) resolve([])
    //         else {
    //             getDocs(this.tuition)
    //                 .then(snap => snap.docs.forEach(item => {
    //                     this.tuition[item.id] = item.data()
    //                 }))
    //             resolve(this.tuition[month])
    //         }
    //     })
    // }

    updateInfo(key, value) {
        if (this[key] !== undefined) {
            this[key] = value
            if (this.program === 'EXTRA') {
                this.id = this.program?.toUpperCase() + '_' + this.level?.toUpperCase() + '_' + this.student?.normalize('NFD').replace(/[\u0300-\u036f\s]/g, '')?.toUpperCase() + '_' + formatDate(this.start_date, 'DDMMYY')
            } else if (key === 'program' || key === 'level' || key === 'start_date') 
                this.id = this.program?.toUpperCase() + '_' + this.level?.toUpperCase() + '_' + formatDate(this.start_date, 'DDMMYY')
        }
    }

    // updateDiary(index, key, value) {
    //     if (key === 'class_code' || key === 'textbooks') {
    //         this.timetable[key] = value
    //     } else {
    //         this.timetable[index].lesson_diary[key] = value
    //     }
    // }

    updateDairy(data) {
        this.lesson_diary = data
    }

    addDiary() {
        // console.log('this.timetable.lesson_diary', this.timetable.lesson_diary);
        this.timetable.push({
            session: this.timetable.length + 1,
            status: 0, //0 active, 1 nghỉ, 2 lý do khác
            reason: '',
            day: formatDate(moment()),
            // lesson_diary: {
            //     lesson_id: this.timetable.length + 1,
            //     day: formatDate(moment()),
            //     teacher: '',
            //     unit: '',
            //     unit_lesson: '',
            //     content: '',
            //     homework: '',
            //     performance: '',
            //     checked: false,
            //     admin_note: ''
            // },
            attendance: {}
        })
    }
}
