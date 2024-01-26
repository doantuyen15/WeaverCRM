import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

const DayPickerInput = ({date, onChange}) => {
	return (
		<DatePicker selected={date} onChange={onChange}  />
	)
}

export default DayPickerInput