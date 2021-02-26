import fetch from "node-fetch"
import React, { useEffect, useRef, useState } from "react"
import "./searchFilm.css"
import { useParams } from "react-router-dom"
import Navbar from "../Navbar.js"
import Footer from "../Footer.js"

const SearchedFilm = ({ token, setToken }) => {
  const [data, setData] = useState()
  const [isRendered, setIsRendered] = useState(false)
  const { title } = useParams()
  const likeButton = useRef()
  const dislikeButton = useRef()
  const sectionFilm = useRef()

  useEffect(() => {
    const url = encodeURI(`/film/${title}`)

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then((res) => res.json())
      .then(({ data, found }) => {
        if (found) {
          setData(data)
        }
        setIsRendered(true)
      })
  }, [])

  const onLikeClick = (rating) => {
    fetch("/vote", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ title, rating }),
      method: "PUT"
    })
      .then((response) => {
        return response.json()
      })
      .then(({ auth, vote }) => {
        if (auth && vote) {
          if (rating) {
            likeButton.current.style.color = "green"
            dislikeButton.current.style.color = "black"
          } else {
            dislikeButton.current.style.color = "red"
            likeButton.current.style.color = "black"
          }
        }
      })
  }

  if (isRendered) {
    return (
      <React.Fragment>
        <Navbar token={token} setToken={setToken} />
        {data !== undefined ? (
          <section id="specificFilm" ref={sectionFilm}>
            <img src={data.Poster} alt="" />
            <div id="filmInformation">
              <h1 id="title">{data.Title}</h1>
              <h5 id="plot">{data.Plot}</h5>
              <h5 id="genre">{data.Genre}</h5>
              <h5 id="runtime">{data.Runtime}</h5>
              <h5 id="released">{data.Released}</h5>
              <h5 id="director">Director: {data.Director}</h5>
              <h5 id="actors">Actors: {data.Actors}</h5>
              <h5 id="awards">{data.Awards}</h5>
              <h5 id="imdbRating">
                {data.imdbRating} <i className="far fa-star"></i> |{" "}
                {data.imdbVotes} <i className="fas fa-vote-yea"></i> IMDb
                ratings
              </h5>
              {token && (
                <div id="vote">
                  <h5 id="textRating">Rate the film</h5>
                  <i
                    className="fas fa-thumbs-up"
                    onClick={() => onLikeClick(1)}
                    ref={likeButton}></i>
                  <i
                    className="fas fa-thumbs-down"
                    onClick={() => onLikeClick(0)}
                    ref={dislikeButton}></i>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div id="filmNotFound">
            <h1>
              FILM <span>NOT FOUND</span> TRY ANOTHER NAME
            </h1>
          </div>
        )}
        <Footer />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <Navbar token={token} />
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>{" "}
        <Footer />
      </React.Fragment>
    )
  }
}

export default SearchedFilm
