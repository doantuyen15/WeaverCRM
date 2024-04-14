import ExcelJS from 'exceljs'
import moment from 'moment';
import { glb_sv } from '../../service';
import StudentInfo from '../../data/entities/studentInfo';

const importExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const resp = await fetch('./assets/reports/import_student.xlsx')
    const buffer = await resp.arrayBuffer()
    const excel = await workbook.xlsx.load(buffer)
    const worksheet = excel.getWorksheet(1)
    
    return worksheet.getRows(4, 86).map(row => {
        const data = new StudentInfo({})
        data.updateInfo('first_name', row.getCell(3)?.value?.trimEnd()?.trimStart())
        data.updateInfo('last_name', row.getCell(4)?.value?.trimEnd()?.trimStart())
        try {
            Object.assign(data, {
                "status_res": glb_sv.ListStatus.find(item => item.status === row.getCell(1)?.value)?.type || 0,
                "phone": row.getCell(2)?.value?.replace(/[^0-9]+/g, "") || '',
                "dob": row.getCell(5)?.value ? moment(row.getCell(5)?.value, 'DD/MM/YYYY').valueOf() : '',
                "parent_phone": row.getCell(6)?.value?.replace(/[^0-9]+/g, "") || '',
                "address": row.getCell(7)?.value || '',
                "email": row.getCell(8)?.value ? row.getCell(8)?.value?.replace(/(?:\r\n|\r|\n)/g, ' ') : '',
                "referrer": row.getCell(9)?.value || '',
                "register_date": row.getCell(11)?.value || '',
                "note": row.getCell(20)?.value || '',
            }) 
            data.updateScore({ key: 'listening', score: Number(row.getCell(12)?.value) || 0, classId: 'test', type: '' })
            data.updateScore({ key: 'speaking', score: Number(row.getCell(13)?.value) || 0, classId: 'test', type: '' })
            data.updateScore({ key: 'reading', score: Number(row.getCell(14)?.value) || 0, classId: 'test', type: '' })
            data.updateScore({ key: 'writing', score: Number(row.getCell(15)?.value) || 0, classId: 'test', type: '' })
            data.updateScore({ key: 'grammar', score: Number(row.getCell(16)?.value) || 0, classId: 'test', type: '' })
        } catch (error) {
            console.log(error);
        }

        // indexL.forEach(index => {
        //     console.log(row.getCell(index)?.value); 
        // })
        return {...data}
    })
}



export default importExcel