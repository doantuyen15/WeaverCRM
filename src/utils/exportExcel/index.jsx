import ExcelJS from 'exceljs'
import { cloneDeep } from 'lodash'
import moment from 'moment';
const exportExcel = ({ reportName = '', data = {} }) => {
    switch (reportName) {
        case 'score':
            exportScore(data)
            break;

        default:
            break;
    }
}

const exportScore = async (data) => {
    try {
        // Create a new Workbook object
        const workbook = new ExcelJS.Workbook();
        const resp = await fetch('./assets/reports/score.xlsx')
        const buffer = await resp.arrayBuffer()
        const sheet = await workbook.xlsx.load(buffer)

        const sheetClone = sheet.getWorksheet(1)
        

        data.score_table?.forEach((item, index) => {
            let currentSheet

            if (index === 0) {
                currentSheet = sheet.getWorksheet(1)
                currentSheet.name = item.term || 'TEST';
            } else {
                
                var newWorkSheet = workbook.addWorksheet(`Sheet ${index + 1}`)
                newWorkSheet.model = { 
                    ...sheetClone.model,
                    name: item.term || 'TEST',
                };
                sheetClone.model.merges.forEach(merge => newWorkSheet.mergeCellsWithoutStyle(merge));

                // newWorkSheet.properties = sheetClone.properties
                // newWorkSheet.name = item.term || 'TEST';

                
                // newWorkSheet.name = 
            }

            currentSheet?.eachRow((row, rowIndex) => {
                row.eachCell(cell => {
                    switch (cell.value) {
                        case 'term':
                            cell.value = item.term || 'TEST'
                            break;
                        case 'date':
                            cell.value = moment(item.update_time, 'DDMMYYYYHHmmSS').format('DD/MM/YYYY')
                            break;
                        case 'class_name':
                            cell.value = item.class_id
                            break;
                        case 'student_name':
                            cell.value = data.full_name
                            break;
                        case 'dob':
                            cell.value = moment(data.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            break;
                        case 'teacher':
                            cell.value = item.teacher || ''
                            break;
                        case 'score1':
                            cell.value = item.listening || ''
                            break;
                        case 'score2':
                            cell.value = item.reading || ''
                            break;
                        case 'score3':
                            cell.value = item.writing || ''
                            break;
                        case 'score4':
                            cell.value = item.grammar || ''
                            break;
                        case 'score5':
                            cell.value = item.speaking || ''
                            break;
                        case 'score_total':
                            cell.value = item.total || ''
                            break;
                        default:
                            break;
                    }
                })
                console.log(row.values);

            })
            console.log(currentSheet, 'sheetClone');
            // currentSheet.eachSheet((sheet, id) => {
            //     sheet.eachRow((row, rowIndex) => {
            //         row.eachCell(cell => {
            //             switch (cell.value) {
            //                 case 'term':
            //                     cell.value = item.term || 'TEST'
            //                     break;
            //                 case 'date':
            //                     cell.value = moment(item.update_time, 'DDMMYYYYHHmmSS').format('DDMMYYYY')
            //                     break;
            //                 case 'class_name':
            //                     cell.value = item.class_id
            //                     break;
            //                 case 'student_name':
            //                     cell.value = data.full_name
            //                     break;
            //                 case 'dob':
            //                     cell.value = moment(item.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
            //                     break;
            //                 case 'teacher':
            //                     cell.value = item.teacher
            //                     break;
            //                 case 'score1':
            //                     cell.value = item.listening
            //                     break;
            //                 case 'score2':
            //                     cell.value = item.reading
            //                     break;
            //                 case 'score3':
            //                     cell.value = item.writing
            //                     break;
            //                 case 'score4':
            //                     cell.value = item.grammar
            //                     break;
            //                 case 'score5':
            //                     cell.value = item.speaking
            //                     break;
            //                 case 'score_total':
            //                     cell.value = item.total
            //                     break;
            //                 default:
            //                     break;
            //             }
            //         })
            //     })
            // })
        })

        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "download.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

export default exportExcel