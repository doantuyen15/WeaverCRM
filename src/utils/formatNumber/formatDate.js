import moment from "moment";
const formatDate = (dateInput = '', type = 'DD/MM/YYYY') => {
    let outputDate = dateInput || moment()
    // if (moment(dateInput).isValid()) {
        // return moment(dateInput).format(type);
    // }
    // else if (moment(dateInput, 'DDMMYYYYHHmmSS').isValid()) return moment(dateInput, 'DDMMYYYYHHmmSS').format(type);
    if (typeof dateInput === 'number') outputDate = moment(dateInput);
    else if (moment(dateInput, "DD/MM/YYYY").isValid()) outputDate = moment(dateInput, 'DD/MM/YYYY');
    else if (moment(dateInput, 'YYYY-MM-DD').isValid()) outputDate = moment(dateInput, 'YYYY-MM-DD');
    else if (moment(dateInput, 'DDMMYYYY').isValid()) outputDate = moment(dateInput, 'DDMMYYYY');
    else if (moment(dateInput, 'YYYYMMDD').isValid()) outputDate = moment(dateInput, 'YYYYMMDD');

    if (type === 'moment') {
        outputDate = outputDate.valueOf()
        console.log('outputDate', outputDate, type);
    } else {
        outputDate = outputDate.format(type)
    }
    return outputDate
    // // console.log('dateInput', dateInput, String(dateInput?.lenght));
    // if (!dateInput) return
    // const date = String(dateInput)?.slice(10)
    // const [day, month, year] = String(dateInput)?.slice(0,10)?.split('/')
    // console.log(String(parseInt(month)), String(parseInt(day))?.length === 1, String(parseInt(year))?.length);

    // // if (String(dateInput)?.length === 1) return `${dateInput}D/MM/YYYY`;
    // // // else if (String(parseInt(year) || '')?.length === 3) return `${day}/${month}/${year + date}`;
    // // // else if (String(parseInt(year) || '')?.length === 2) return `${day}/${month}/${year + date}Y`;
    // // else if (String(parseInt(year) || '')?.length > 3) return day + '/' + month + '/' + year;
    // // else if (String(parseInt(year) || '')?.length > 0) return `${day}/${month}/${String(parseInt(year) || '') + date + 'YYYY'.slice(4 - String(parseInt(year) || '')?.length)}`;
    // // else if (String(parseInt(month)|| '')?.length === 2) return `${day}/${month}/${date}YYY`;
    // // else if (String(parseInt(month)|| '')?.length === 1) return `${day}/${month[0] + date}/YYYY`;
    // // else if (String(parseInt(day))?.length === 2) return `${day}/${date}M/YYYY`;
    // // else if (String(parseInt(day))?.length == 1){ 
    // //     return `${day[0] + date}/MM/YYYY`;
    // // }
    // if (String(dateInput)?.length === 1) return `${dateInput}D/MM/YYYY`
    // else if (String(dateInput)?.length === 2) return `${dateInput}/MM/YYYY`
    // else if (String(dateInput)?.length === 3) return `${dateInput.slice(0,2)}/${dateInput[2]}M/YYYY`
    // else if (String(dateInput)?.length === 4) return `${dateInput.slice(0,2)}/${dateInput.slice(2,4)}/YYYY`
    // else if (String(dateInput)?.length === 5) return `${dateInput.slice(0,2)}/${dateInput.slice(2,4)}/${dateInput[4]}YYY`
    // else if (String(dateInput)?.length === 6) return `${dateInput.slice(0,2)}/${dateInput.slice(2,4)}/${dateInput.slice(4,6)}YY`
    // else if (String(dateInput)?.length === 7) return `${dateInput.slice(0,2)}/${dateInput.slice(2,4)}/${dateInput.slice(4,7)}Y`
    // else if (String(dateInput)?.length > 7) return `${dateInput.slice(0,2)}/${dateInput.slice(2,4)}/${dateInput.slice(4,8)}`
    // else if (String(dateInput)?.length > 8) return `${dateInput.slice(0,2)}/${dateInput.slice(2,4)}/${dateInput.slice(4,8)}`
}
export default formatDate