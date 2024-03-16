const FormatPhone = (phone = '') => {
    if (phone) {
        if (phone.length <= 4) {
            return phone;
        } else if (phone.length > 4 && phone.length <= 7) {
            const x = phone.match(/(\d{0,4})(\d{0,3})/);
            return `${x[1]}.${x[2]}` || phone;
        } else if (phone.length > 7) {
            const x = phone.match(/(\d{0,4})(\d{0,3})(\d{0,3})/);
            return `${x[1]}.${x[2]}.${x[3]}` || phone;
        }
    }
    return phone
}
export default FormatPhone