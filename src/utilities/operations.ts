import Debug from "debug"
import { splitter } from "./splitter"
import { insertIntoProcessedData, insertIntoPendingData, partialSelectFromPendingData, deleteFromPendingData } from "./db"


const debug = Debug("operations")
Debug.enable("*")

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const processData = async function(ctx: string): Promise<void> {
  const rawData = await splitter(ctx)
  for (let i = rawData[1].firstNumber; i <= rawData[1].secondNumber; i++) {
    const timestamp = new Date()
    void insertIntoPendingData(rawData[i].firstNumber, rawData[i].secondNumber, rawData[i].dummyData!, timestamp)
  }
  const condition = true
  while (condition) {
    const data = await partialSelectFromPendingData()
    if (data) {
      const timestamp = new Date()
      for (let i = 0; i < data.length; i++) {
        void insertIntoProcessedData(data[i].int_k, data[i].str_d, timestamp)
        void deleteFromPendingData(data[i].id)
      }
    }
    debug(`${data.length} rows processed`)
    await delay(10000)
  }
}

export {
  processData
}
