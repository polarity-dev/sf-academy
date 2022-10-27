type Row = {
  firstNumber: number
  secondNumber: number
  dummyData?: string
}

type Rows = { [key: number]: Row }

export {
  Row,
  Rows
}
