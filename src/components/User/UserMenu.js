import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../Navbar.js"
import Footer from "../Footer.js"
import UserSidebar from "./UserSidebar.js"
import "./userCatalog.css"
import UserCatalog from "./UserCatalog.js"

const UserFilms = ({ token, setToken }) => {
  const [currentGenre, setCurrentGenre] = useState("")
  const genres = useRef()
  const [isRendered, setIsRendered] = useState(false)
  const films = useRef()
  const { username } = useParams()
  const clicked = useRef(false)
  const allGenres = useRef()

  const onGenreClick = (e) => {
    setCurrentGenre(e.target.id)
  }

  const onButtonFilterClick = () => {
    if (clicked.current) {
      clicked.current = false
      allGenres.current.style.display = "none"
    } else {
      clicked.current = true
      allGenres.current.style.display = "block"
    }
  }

  useEffect(() => {
    if (token !== "") {
      fetch(`/user/${username}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + token
        }
      })
        .then((response) => response.json())
        .then(({ userGenres, userFilms, auth }) => {
          if (auth) {
            genres.current = userGenres
            films.current = userFilms
            setIsRendered(true)
          }
        })
    }
  }, [token])

  return (
    <React.Fragment>
      <Navbar token={token} setToken={setToken} />
      {isRendered ? (
        films.current.length > 0 ? (
          <React.Fragment>
            <div id="filterGenres" onClick={onButtonFilterClick}>
              <i className="fas fa-sort-down"></i> Filter by genre{" "}
              <i className="fas fa-sort-down"></i>
            </div>
            <div id="allGenres" ref={allGenres}>
              <ul>
                <li key="0" onClick={onGenreClick}>
                  All genres
                </li>
                {genres.current
                  .filter((genre) => genre !== currentGenre)
                  .map((genre, index) => (
                    <li key={index + 1} id={genre} onClick={onGenreClick}>
                      {genre}
                    </li>
                  ))}
              </ul>
            </div>
            <main>
              <React.Fragment>
                <UserSidebar
                  genres={genres.current}
                  currentGenre={currentGenre}
                  setCurrentGenre={setCurrentGenre}
                />
                <UserCatalog
                  films={films.current}
                  currentGenre={currentGenre}
                />
              </React.Fragment>
            </main>
          </React.Fragment>
        ) : (
          <div id="noFilm">
            <h1>
              you haven't <span>voted</span> any movie yet.
            </h1>
          </div>
        )
      ) : (
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <Footer />
    </React.Fragment>
  )
}

export default UserFilms
