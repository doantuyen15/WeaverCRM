import moment from "moment";
const FormatDate = (date, type = 'DD.MM.YYYY') => {
    return moment(date).format(type)
}
export default FormatDate