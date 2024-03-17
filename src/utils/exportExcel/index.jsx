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

const exportExcel = ({ reportName = '', data = {}, info = {} }) => {
    switch (reportName) {
        case 'score':
            exportScore(data, info)
            break;
        case 'score_test':
            exportScoreTest(data, info)
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