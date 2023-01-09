import React, { useState } from 'react'

const App = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingData, setPendingData] = useState([])
  const [savedData, setSavedData] = useState([])
  const [dataLimit, setDataLimit] = useState(20)
  const [fromTime, setFromTime] = useState(new Date("2022-01-01 00:00:00").toLocaleString("it-IT", {}))


  const sumbmit = async (e) => {
    e.preventDefault()

    let formData = new FormData();
    formData.append("data", selectedFile)

    let response = await fetch(`http://localhost:4000/importDataFromFile`, {
      method: 'POST',
      body: formData

    })


    // if (response.status === 200) {
    //
    //   alert("Invio eseguito")
    // } else {
    //   alert("Invio fallito")
    // }

  }

  const getPendingData = async () => {
    clearData()
    await fetch('http://localhost:4000/pendingData', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => setPendingData(response))
  }

  const getData = async () => {

    let unix_timestamp = Date.parse(fromTime).toString();

    console.log(unix_timestamp)

    console.log(`http://localhost:4000/data?limit=${dataLimit}&from=${unix_timestamp}`)
    clearData()
    await fetch(`http://localhost:4000/data?limit=${dataLimit}&from=${unix_timestamp}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => setSavedData(response))
  }


  const clearData = () => {
    setSavedData([])
    setPendingData([])
  }

  return (
    <div>
      <div className="w-[100vw] h-[60vh] flex flex-col justify-center items-center ">

        <form onSubmit={sumbmit} className="w-[50vw] flex flex-col justify-center items-center">
          <input type="file" name="data" accept="text/plain" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-[50vw] bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2 rounded h-[5vh]" />
          <button type="submit" className="w-[50vw] h-[5vh] bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2 rounded">Import data from file</button>
        </form>

        <div className="flex flex-col justify-center items-center">
          <p>From date: {fromTime}</p>
          <input type="date" placeholder="from" className="w-[50vw] h-[5vh] border-2 text-gray-700 border-blue-500 p-2 m-2" value={fromTime} onChange={event => {
            setFromTime(event.target.value)
          }} />
          <p>Limit: {dataLimit}</p>
          <input type="text" placeholder="limit" className="w-[50vw] h-[5vh] border-2 text-gray-700 border-blue-500 p-2 m-2" value={dataLimit} onChange={event => { setDataLimit(event.target.value) }} />
          <button type="button" onClick={getPendingData} className="w-[50vw] h-[5vh] bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2 rounded">Pending data</button>
          <button type="button" onClick={getData} className="w-[50vw] h-[5vh] bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2 rounded">Saved data</button>
          <button type="button" onClick={clearData} className="w-[50vw] h-[5vh] bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2 rounded">Clear page</button>
        </div>

      </div>

      <div className="p-2 m-2">
        <ol className="list-decimal">
          {savedData.map((item, index) => {
            return <li className="border-2 border-blue-500 p-2 m-2" key={index}>{item.D}</li>
          })}
        </ol>
        <ol className="list-decimal">
          {pendingData.map((item, index) => {
            return <li className="border-2 border-blue-500 p-2 m-2" key={index}>{item.D}</li>
          })}
        </ol>

      </div>
    </div>
  )
}

export default App
