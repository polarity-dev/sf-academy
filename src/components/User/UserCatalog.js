import React from "react"

const UserCatalog = ({ films, currentGenre }) => {
  return (
    <article className="user-films">
      <div id="title">
        <h1>MOVIES YOU LIKED</h1>
      </div>
      <section id="favouriteFilms">
        {films
          .filter((film) => film.Genre.includes(currentGenre))
          .map((film, index) => {
            return (
              <div className="card" key={index}>
                <a href={`/film/${film.Title}`}>
                  <img
                    className="card-img-top"
                    src={film.Poster}
                    alt="Cardcap"
                  />
                </a>
                <div className="card-body">
                  <h5 className="card-title">{film.Title}</h5>
                  <p className="card-text" id="rating">
                    {film.imdbRating} <i className="far fa-star"></i>
                  </p>
                </div>
              </div>
            )
          })}
      </section>
    </article>
  )
}

export default UserCatalog
