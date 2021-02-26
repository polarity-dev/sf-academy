import React, { useState, useEffect, useRef } from "react"
import Sidebar from "./Sidebar.js"
import Catalog from "./Catalog.js"
import Navbar from "../Navbar.js"
import Footer from "../Footer.js"
import "./index.css"

const Home = ({ token, setToken }) => {
  const [currentGenre, setCurrentGenre] = useState("Action")
  const genres = useRef([])
  const [isRendered, setIsRendered] = useState()

  useEffect(() => {
    fetch("/genres")
      .then((response) => response.json())
      .then((data) => {
        genres.current = data
        setCurrentGenre(data[0].name)
      })
  }, [])

  return (
    <React.Fragment>
      <Navbar token={token} setToken={setToken} />
      <main className="main-homepage">
        <Sidebar
          genres={genres.current}
          currentGenre={currentGenre} // viene eliminato dalla lista il genere corrente
          setCurrentGenre={setCurrentGenre} // nel momento in cui un genere viene cliccato, diventa il corrente
          setIsRendered={setIsRendered} // con un nuovo genere è necessario un nuovo caricamento
        />
        <Catalog
          currentGenre={currentGenre} // per il titolo della section
          setCurrentGenre={setCurrentGenre} // con le mq il menù dei generi passa nel Catalog
          genres={genres.current}
          setIsRendered={setIsRendered} // con un nuovo genere è necessario un nuovo caricamento
          isRendered={isRendered} // effetto loading
        />
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Home
