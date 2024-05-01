// import LuckyExcel from "luckyexcel";

// export async function loadExcelTemplate() {
//     const res = await fetch('./assets/reports/Lesson_diary_LIFE.xlsx');
//     const data = await res.arrayBuffer();
//     const [exportJson] = await new Promise((resolve, reject) => {
//         LuckyExcel.transformExcelToLucky(
//             data,
//             (a, b) => {
//                 resolve([a, b]);
//             },
//             reject
//         );
//     });
//     return exportJson.sheets;
// }