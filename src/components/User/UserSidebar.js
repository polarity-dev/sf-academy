import React, { useEffect } from "react"

const Sidebar = ({ genres, currentGenre, setCurrentGenre }) => {
  const onGenreClick = (e) => {
    setCurrentGenre(e.target.id)
  }
  return (
    <aside className="user-genres">
      <div id="genresLegend">
        <h1>GENRES</h1>
      </div>
      <ul>
        <li key="0" onClick={onGenreClick}>
          All genres
        </li>
        {genres
          .filter((genre) => genre !== currentGenre)
          .map((genre, index) => (
            <li key={index + 1} id={genre} onClick={onGenreClick}>
              {genre}
            </li>
          ))}
      </ul>
    </aside>
  )
}

export default Sidebar
