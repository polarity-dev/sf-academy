import { Dispatch, SetStateAction, useState } from "react"
import Datepicker from "tailwind-datepicker-react"

const options = {
  title: "Choose date to start from",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-gray-50 dark:bg-gray-800",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "text-gray-300",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2023-09-01"),
  language: "en",
}

const CustomPicker = ({ setFromTime }: { setFromTime: Dispatch<SetStateAction<string>> }) => {
  const [show, setShow] = useState<boolean>(false);
  const handleChange = (selectedDate: Date) => {
    setFromTime(selectedDate.toISOString())
  }
  const handleClose = (state: boolean) => {
    setShow(state)
  }

  return (
    <div>
      <Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
    </div>
  )
}

export default CustomPicker;
