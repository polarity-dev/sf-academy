type Row = {
  firstNumber: number
  secondNumber: number
  dummyData?: string
}

type Rows = { [key: number]: Row }

type ProcessedRow = {
  id: number
  int_k: number
  str_d: string
}

type ProcessedRows = [ProcessedRow]

export {
  Rows,
  ProcessedRows
}
