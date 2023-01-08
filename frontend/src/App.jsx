import React, { useState } from 'react'

const App = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingData, setPendingData] = useState([])
  const [data, setData] = useState([])


  const sumbmit = async (e) => {
    e.preventDefault()

    let formData = new FormData();
    formData.append("data", selectedFile)

    let response = await fetch(`http://localhost:4000/importDataFromFile`, {
      method: 'POST',
      body: formData

    })


    if (response.status === 200) {

      alert("Invio eseguito")
    } else {
      alert("Invio fallito")
    }

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
    clearData()
    await fetch('http://localhost:4000/data', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => setData(response))
  }


  const clearData = () => {
    setData([])
    setPendingData([])
  }

  return (
    <div>
      <form onSubmit={sumbmit}>
        <input type="file" name="data" accept="text/plain" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button type="submit">Import data from file</button>
      </form>


      <button type="button" onClick={getPendingData}>Pending data</button>
      <button type="button" onClick={getData}>Data</button>
      <button type="button" onClick={clearData}>Clear page</button>

      <ul>
        {data.map((item, index) => {
          return <li> key={index}{item}</li>
        })}
      </ul>
      <ul>
        {pendingData.map((item, index) => {
          return <li key={index}>{item.D}</li>
        })}
      </ul>

    </div>
  )
}

export default App
