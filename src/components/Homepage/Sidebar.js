import React from "react"

const Sidebar = ({ genres, currentGenre, setCurrentGenre, setIsRendered }) => {
  return (
    <aside>
      <div id="genresLegend">
        <h1>GENRES</h1>
      </div>
      <ul>
        {genres
          .filter((genre) => genre.name !== currentGenre)
          .map((genre, index) => {
            return (
              <li
                key={index}
                onClick={(e) => {
                  setCurrentGenre(e.target.innerText)
                  setIsRendered(false)
                }}>
                <span>
                  <span>
                    <span>{genre.name}</span>
                  </span>
                </span>
              </li>
            )
          })}
      </ul>
    </aside>
  )
}

export default Sidebar
