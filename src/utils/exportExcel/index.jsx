import ExcelJS from 'exceljs'
import moment from 'moment';
import docx from 'docx';
import PizZip from 'pizzip';
import Docxtemplater from "docxtemplater";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import formatDate from '../formatNumber/formatDate';

import ScoreTemplate from "./reports/report_score.docx";
import ScoreTemplateTest from "./reports/report_score_test.docx";
import FinanceTemplateDoc from "./reports/report_finance.docx";
import FinanceTemplateExcel from "./reports/mau-so-quy-tm.xlsx";
import formatNum from '../formatNumber/formatNum';
import { glb_sv } from '../../service';

const exportExcel = ({ reportName = '', data = {}, info = {} }) => {
    switch (reportName) {
        case 'score':
            exportScore(data, info)
            break;
        case 'score_test':
            exportScoreTest(data, info)
            break;
        case 'tuition':
            exportTuition(data, info)
            break;
        case 'finance':
            exportFinance(data, info)
            break;
        default:
            break;
    }
}

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

const exportScore = (data, info) => {
    try {
        loadFile(ScoreTemplate, function (error, content) {
            if (error) {
              throw error;
            }
            var zip = new PizZip(content);
            var doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true
            });
            doc.setData({
                class_id: data.class_id,
                first_name: info.first_name,
                last_name: info.last_name,
                term: data.term,
                dob: formatDate(info.dob),
                test_date: formatDate(info.update_time),
                teachers: '',
                correct1: data._listening || '',
                correct2: data._reading || '',
                correct3: data._writing || '',
                correct4: data._speaking || '',
                listening: data.listening || '',
                reading: data.reading || '',
                writing: data.writing || '',
                speaking: data.speaking || '',
                total_score: data.total,
                attended: '',
                total_day: '',
            })
            doc.render();
            saveDocFile(doc)
        })
    } catch (error) {
        console.error('Error:', error);
    }
}

const exportScoreTest = (data, info) => {
    try {
        loadFile(ScoreTemplateTest, function (error, content) {
            if (error) {
              throw error;
            }
            var zip = new PizZip(content);
            var doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true
            });
            doc.setData({
                class_id: data.class_id,
                full_name: info.full_name,
                term: data.term,
                dob: formatDate(info.dob),
                test_date: formatDate(info.update_time),
                teachers: '',
                correct1: data._listening || '',
                correct2: data._reading || '',
                correct3: data._writing || '',
                correct4: data._speaking || '',
                correct5: data._grammar || '',
                listening: data.listening || '',
                reading: data.reading || '',
                writing: data.writing || '',
                speaking: data.speaking || '',
                grammar: data.grammar || '',
                total_score: data.total,
            })
            doc.render();
            saveDocFile(doc)
        })
    } catch (error) {
        console.error('Error:', error);
    }
}

const exportFinance = async (data, info) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const resp = await fetch('./assets/reports/mau-so-quy-tm.xlsx')
        const buffer = await resp.arrayBuffer()
        const excel = await workbook.xlsx.load(buffer)
        const worksheet = excel.getWorksheet(1)
        let total = 0
        data.forEach((item, index) => {
            item.isPayment ? total -= Number(item.amount) : total += Number(item.amount)
            worksheet.insertRow(index + 6, [
                formatDate(item.create_date),
                item.code,
                item.explain || ' ',
                item.isPayment ? ' ' : formatNum(item.amount),
                !item.isPayment ? ' ' : formatNum(item.amount),
                item.note
            ])
            const row = worksheet.getRow(index + 6)
            for(var indexCell = 1; indexCell <= 6; indexCell++) {
                const cell = row.getCell(indexCell)
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                if (indexCell == 4 || indexCell == 5) {
                    cell.alignment = { horizontal: 'right' }
                }
            }
        })
        const lastCell = worksheet.getRow(data?.length + 6).getCell(4)
        lastCell.value = formatNum(total)
        lastCell.alignment = { horizontal: 'right' }
        
        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `Finance report - ${info.time}`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

const exportTuition = async (data, info) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const resp = await fetch('./assets/reports/report_tuition.xlsx')
        const buffer = await resp.arrayBuffer()
        const excel = await workbook.xlsx.load(buffer)
        const worksheet = excel.getWorksheet(1)
        let total = 0
        data.forEach((item, index) => {
            item.isPayment ? total -= Number(item.amount) : total += Number(item.amount)
            worksheet.insertRow(index + 5, [
                item.customer_id,
                item.customer,
                formatDate(item.create_date),
                moment(item.tuition_date, 'MMYYYY').format('MMMM - YYYY'),
                !item.isPayment ? formatNum(item.amount, 0, 'price') : ('-' + formatNum(item.amount, 0, 'price')),
                item.explain
            ])
            const rowTitle = worksheet.getRow(2)
            const timeTitle = rowTitle.getCell(1).value
            rowTitle.getCell(1).value = timeTitle.replace('{time}', info.time)

            const row = worksheet.getRow(index + 5)
            for(var indexCell = 1; indexCell <= 6; indexCell++) {
                const cell = row.getCell(indexCell)
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                if (indexCell == 5) {
                    cell.alignment = { horizontal: 'right' }
                }
            }
        })
        const lastCell = worksheet.getRow(data?.length + 5).getCell(5)
        lastCell.value = formatNum(total)
        lastCell.alignment = { horizontal: 'right' }
        
        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `Tuition reports - ${info.time}`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export const createLessonDairy = async (item, teacherList) => {
    const classInfo = item.data[0]
    const workbook = new ExcelJS.Workbook();
    const resp = await fetch(classInfo.program === 'IELTS' ? './assets/reports/template_ielts.xlsx' : './assets/reports/template_life.xlsx')
    const buffer = await resp.arrayBuffer()
    const excel = await workbook.xlsx.load(buffer)
    const worksheet = excel.getWorksheet(1)

    const startDate = moment(classInfo.start_date);
    const endDate = moment(classInfo.end_date);
    // Lấy mảng các ngày trong tháng
    const days = [];

    for (let i = 0; i <= endDate.diff(startDate, 'days'); i++) {
        days.push(startDate.clone().add(i, 'days'));
    }
    const timetable = []
    // let offDay = 0
    days.forEach(day => {
        if (glb_sv.offday.includes(moment(day).format('DD/MM'))) {
            // nghỉ
        } else if (
            (classInfo.class_schedule_id === 0 && (day.day() === 1 || day.day() === 3)) || // thú 2 4
            (classInfo.class_schedule_id === 1 && (day.day() === 2 || day.day() === 4)) || // thú 3 5
            (classInfo.class_schedule_id === 2 && (day.day() === 6 || day.day() === 7)) || // thú 7 cn
            (classInfo.class_schedule_id === 3 && (day.day() === 5)) // thú 6
        ) {
            timetable.push(formatDate(day))
        }
    })

    if (classInfo.program === 'IELTS') {
        timetable.forEach((day, index) => {
            worksheet.insertRow(index + 6, [
                index + 1,
                day,
                '',
            ])
            const row = worksheet.getRow(index + 6)
            for(var indexCell = 1; indexCell <= 9; indexCell++) {
                const cell = row.getCell(indexCell)
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.font = {
                    name: 'Arial'
                }
                cell.alignment = { horizontal: 'center', vertical: 'middle' }
                if (indexCell == 3) {
                    cell.font = {
                        color: {argb: "ffed7d31"},
                        name: 'Arial',
                        bold: true
                    }
                    cell.dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${teacherList?.filter(staff => [1, 3, 4, 7].includes(staff.roles_id))?.map(item => item.short_name)}"`]
                    };
                }
            }
        })
    } else { //LIFE
        worksheet.getCell('B2').value = classInfo.program + ' ' + classInfo.level
        worksheet.getCell('B3').value = classInfo.class_schedule
        worksheet.getCell('B4').value = classInfo.teacher + ' - ' + classInfo.sub_teacher
        worksheet.getCell('F3').value = formatDate(classInfo.start_date)
    
        timetable.forEach((day, index) => {
            worksheet.insertRow(index + 7, [
                index + 1,
                moment(day, 'DD/MM/YYYY').format('M'),
                day,
                '',
            ])
            const row = worksheet.getRow(index + 7)
            for(var indexCell = 1; indexCell <= 11; indexCell++) {
                const cell = row.getCell(indexCell)
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.font = {
                    name: 'Arial'
                }
                cell.alignment = { horizontal: 'center', vertical: 'middle' }
                if (indexCell == 4) {
                    cell.font = {
                        color: {argb: "ffed7d31"},
                        name: 'Arial',
                        bold: true
                    }
                    cell.dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${teacherList?.filter(staff => [1, 3, 4, 7].includes(staff.roles_id))?.map(item => item.short_name)}"`]
                    };
                }
            }
        })
    }



    const newBuffer = await workbook.xlsx.writeBuffer()
    return newBuffer
}

const saveDocFile = (doc) => {
    var out = doc.getZip().generate({
        type: "blob",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }); //Output the document using Data-URI
    saveAs(out, "test.docx");
}

// const exportScoreOld = async (data) => {
//     try {
//         // Create a new Workbook object
//         const workbook = new ExcelJS.Workbook();
//         const resp = await fetch('./assets/reports/score.xlsx')
//         const buffer = await resp.arrayBuffer()
//         const sheet = await workbook.xlsx.load(buffer)

//         const sheetClone = sheet.getWorksheet(1)


//         data.score_table?.forEach((item, index) => {
//             let currentSheet = sheet.getWorksheet(2)

//             if (index > 2) {
//                 currentSheet.name = item.term || `Mid${index+1}`;
//                 var newWorkSheet = workbook.addWorksheet(`Mid${index+1}`)
//                 newWorkSheet.model = { 
//                     ...sheetClone.model,
//                     name: item.term || `Mid${index+1}`,
//                 };
//                 currentSheet.eachRow((row, rowNumber) => {
//                     var newRow = newWorkSheet.getRow(rowNumber);
//                     row.eachCell((cell, colNumber) => {
//                         var newCell = newRow.getCell(colNumber)
//                         for (var prop in cell) {
//                             newCell[prop] = cell[prop];
//                         }
//                     })
//                 })
//             }

//             currentSheet?.eachRow((row, rowIndex) => {
//                 row.eachCell(cell => {
//                     switch (cell.value) {
//                         case 'term':
//                             cell.value = item.term || 'TEST'
//                             break;
//                         case 'date':
//                             cell.value = moment(item.update_time, 'DDMMYYYYHHmmSS').format('DD/MM/YYYY')
//                             break;
//                         case 'class_name':
//                             cell.value = item.class_id
//                             break;
//                         case 'student_name':
//                             cell.value = data.full_name
//                             break;
//                         case 'dob':
//                             cell.value = moment(data.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
//                             break;
//                         case 'teacher':
//                             cell.value = item.teacher || ''
//                             break;
//                         case 'score1':
//                             cell.value = item.listening || ''
//                             break;
//                         case 'score2':
//                             cell.value = item.reading || ''
//                             break;
//                         case 'score3':
//                             cell.value = item.writing || ''
//                             break;
//                         case 'score4':
//                             cell.value = item.grammar || ''
//                             break;
//                         case 'score5':
//                             cell.value = item.speaking || ''
//                             break;
//                         case 'score_total':
//                             cell.value = item.total || ''
//                             break;
//                         default:
//                             break;
//                     }
//                 })
//                 console.log(row.values);

//             })
//             // console.log(currentSheet, 'sheetClone');
//             // currentSheet.eachSheet((sheet, id) => {
//             //     sheet.eachRow((row, rowIndex) => {
//             //         row.eachCell(cell => {
//             //             switch (cell.value) {
//             //                 case 'term':
//             //                     cell.value = item.term || 'TEST'
//             //                     break;
//             //                 case 'date':
//             //                     cell.value = moment(item.update_time, 'DDMMYYYYHHmmSS').format('DDMMYYYY')
//             //                     break;
//             //                 case 'class_name':
//             //                     cell.value = item.class_id
//             //                     break;
//             //                 case 'student_name':
//             //                     cell.value = data.full_name
//             //                     break;
//             //                 case 'dob':
//             //                     cell.value = moment(item.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
//             //                     break;
//             //                 case 'teacher':
//             //                     cell.value = item.teacher
//             //                     break;
//             //                 case 'score1':
//             //                     cell.value = item.listening
//             //                     break;
//             //                 case 'score2':
//             //                     cell.value = item.reading
//             //                     break;
//             //                 case 'score3':
//             //                     cell.value = item.writing
//             //                     break;
//             //                 case 'score4':
//             //                     cell.value = item.grammar
//             //                     break;
//             //                 case 'score5':
//             //                     cell.value = item.speaking
//             //                     break;
//             //                 case 'score_total':
//             //                     cell.value = item.total
//             //                     break;
//             //                 default:
//             //                     break;
//             //             }
//             //         })
//             //     })
//             // })
//         })

//         workbook.xlsx.writeBuffer().then(function (data) {
//             const blob = new Blob([data], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             const url = window.URL.createObjectURL(blob);
//             const anchor = document.createElement("a");
//             anchor.href = url;
//             anchor.download = "download.xlsx";
//             anchor.click();
//             window.URL.revokeObjectURL(url);
//         });

//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

export default exportExcel