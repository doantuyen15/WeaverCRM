import ExcelJS from 'exceljs'
import { glb_sv } from '../../service';
const exportExcelScore = (dataStudent) => {
    console.log('dataStudent', dataStudent);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Điểm');
    // Create sheets for each unique class_id
    dataStudent.score_table.forEach((score, index) => {
        if(score.class_id !== 'test') {
            const startRow = 4*index + 1
            worksheet.addRow([score.class_id + ' - ' + glb_sv.semester.MAP[score.term]])
            worksheet.mergeCells(startRow, 1, startRow, 5);
            worksheet.addRow(['speaking', 'reading', 'writing', 'listening', 'total'])
            worksheet.addRow([score.speaking, score.reading, score.writing, score.listening, score.total])
            worksheet.addRow([''])
        }
    })



    
    // sheet.getRow(1).border = {
    //   top: { style: "thick", color: { argb: "FFFF0000" } },
    //   left: { style: "thick", color: { argb: "000000FF" } },
    //   bottom: { style: "thick", color: { argb: "F08080" } },
    //   right: { style: "thick", color: { argb: "FF00FF00" } },
    // };

    // sheet.getRow(1).fill = {
    //   type: "pattern",
    //   pattern: "darkVertical",
    // //   fgColor: { argb: "FFFF00" },
    // };

    // sheet.getRow(1).font = {
    //   name: "Arial",
    //   size: 15,
    //   bold: true,
    // };

    // sheet.columns = [
    //   {
    //     header: "Id",
    //     key: "id",
    //     width: 10,
    //   },
    //   { header: "Title", key: "title", width: 32 },
    //   {
    //     header: "Brand",
    //     key: "brand",
    //     width: 20,
    //   },
    //   {
    //     header: "Category",
    //     key: "category",
    //     width: 20,
    //   },
    //   {
    //     header: "Price",
    //     key: "price",
    //     width: 15,
    //   },
    //   {
    //     header: "Rating",
    //     key: "rating",
    //     width: 10,
    //   },
    //   {
    //     header: "Photo",
    //     key: "thumbnail",
    //     width: 30,
    //   },
    // ];

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
}

export default exportExcelScore