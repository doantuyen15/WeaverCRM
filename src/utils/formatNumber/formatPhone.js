const FormatPhone = (phone) => {
    const x = phone && phone.replace(/\D/g, '').match(/(\d{0,4})(\d{0,3})(\d{0,3})/);
    return `${x[1]}.${x[2]}.${x[3]}` || phone;
}
export default FormatPhone