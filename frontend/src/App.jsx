import React, { useState } from 'react'




const App = () => {

  const [selectedFile, setSelectedFile] = useState(null);


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

  const getPendingData = () => {

  }

  const getData = () => {

  }

  return (
    <div>
      <form onSubmit={sumbmit}>
        <input type="file" name="data" accept="text/plain" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button type="submit">Import data from file</button>
      </form>


    <button type="button" onClick={getPendingData}>Pending data</button>
    <button type="button" onClick={getData}>Data</button>
    </div>
  )
}

export default App
