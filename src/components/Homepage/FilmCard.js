import React from "react"

const Card = ({ film }) => {
  return (
    <li className="card">
      <a href={`/film/${film.Title}`}>
        <img className="card-img-top" src={film.Poster} alt="Cardcap" />
      </a>
      <div className="card-body">
        <h5 className="card-title">{film.Title}</h5>
        <hr />
        <p className="card-text" id="plot">
          {film.Plot}
        </p>
        <h6 className="card-label">GENRE</h6>
        <p className="card-text" id="filmGenre">
          {film.Genre}
        </p>
        <h6 className="card-label">IMDB RATING</h6>
        <p className="card-text">
          {film.imdbRating}
          <i className="far fa-star"></i> | {film.imdbVotes}
          <i className="fas fa-vote-yea"></i>
        </p>
      </div>
    </li>
  )
}

export default Card
