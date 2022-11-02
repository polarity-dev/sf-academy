import { Rows } from "./index"
import Debug from "debug"


const debug = Debug("splitter")
Debug.enable("*")

const splitter = async function(rawData: string): Promise<Rows> {
  const rows: Rows = {}
  const data = rawData.slice(0, -1).split("\n")
  for (let i = 0; i < data.length; i++) {
    const row = data[i].split(" ")
    if (row.length === 2) {
      rows[i + 1] = {
        firstNumber: Number(row[0]),
        secondNumber: Number(row[1])
      }
    } else if (row.length === 3) {
      rows[i + 1] = {
        firstNumber: Number(row[0]),
        secondNumber: Number(row[1]),
        dummyData: row[2].split("_").join(" ")
      }
    } else {
      debug("Error in the for and if loop in the splitter function")
    }
  }
  return rows
}

export {
  splitter
}