const express = require("express")
const path = require("path")
const mysql = require("mysql2")
const dotenv = require("dotenv")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const atob = require("atob")
const bcrypt = require("bcryptjs")
const fetch = require("node-fetch")
const cardsPerPage = 10 // number of films per page

const publicDirectoryPath = path.join(__dirname, "public")
app.use(express.static(publicDirectoryPath))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

dotenv.config({ path: "./private/.env" })

// DATABASE SECTION ------------------------------------------------------------------

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

const dbQuery = (queryString, parametres) => {
  // promisification
  return new Promise((resolve) => {
    connection.query(queryString, parametres, (error, result) => {
      if (error) {
        throw error
      } else {
        resolve(result)
      }
    })
  })
}

// JWT SECTION ------------------------------------------------------------------

const createToken = (id, res) => {
  // creates a 3 month expiration token based on user id and secret key
  const token = jwt.sign({ id: id.toString() }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    )
  }
  res.cookie("jwt", token, cookieOptions).json({ token })
}

const encodeToken = (token) => {
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace("-", "+").replace("_", "/")
  return JSON.parse(atob(base64))
}

const verifyToken = (req, res, next) => {
  // it takes the token, if present, in the authorization key and if valid it derives the user's id
  // Get auth header value
  const bearerHeader = req.headers["authorization"]
  // Check if bearer is undefined
  if (bearerHeader !== undefined) {
    // Split at the space
    const bearer = bearerHeader.split(" ")
    // Get token from array
    const token = bearer[1]
    try {
      if (jwt.verify(token, process.env.JWT_SECRETKEY)) {
        // Set the token
        req.id = encodeToken(token).id
        // Next middleware
        next()
      } else {
        res.json({ auth: false })
      }
    } catch (err) {
      res.json({ auth: false })
    }
  } else {
    // Forbidden
    res.json({ auth: false })
  }
}

// ACCOUNT SECTION --------------------------------------------------------------

const loginUser = async ({ username, password }, res) => {
  try {
    const users = await dbQuery(
      "SELECT id, password FROM `users` WHERE `username` = ? LIMIT 1",
      [username]
    )
    const [userData] = users

    if (!userData || !(await bcrypt.compare(password, userData.password))) {
      res.json({ message: "Incorrect username or password" })
    } else {
      createToken(userData.id, res)
    }
  } catch {
    res.json({ message: "An error has occurred. Please try again" })
  }
}

const userRegistration = async ({ username, mail, password }, res) => {
  // if the email has not already been used, create a new user who will then be logged in
  try {
    const resultMail = await dbQuery(
      "SELECT `mail` FROM `users` WHERE `mail` = ? LIMIT 1",
      [mail]
    )
    if (resultMail.length < 1) {
      const hashedPassword = await bcrypt.hash(password, 4) //number of times the password is hashed
      dbQuery(
        "INSERT INTO `users`(`username`, `password`, `mail`) VALUES(?, ?, ?)",
        [username, hashedPassword, mail]
      )
      loginUser({ username, password }, res)
    } else {
      res.json({
        message: "This mail is already in use, try another one"
      })
    }
  } catch {
    res.json({
      message: "An error has occurred. Please try again"
    })
  }
}

// FILMS SECTION ----------------------------------------------------------------

const searchFilm = async (name) => {
  // common function for obtaining the data of a movie
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(name)}&apikey=${
    process.env.OMDBKEY
  }`

  try {
    const response = await fetch(url)
    return response.json()
  } catch {
    return null
  }
}

const renderFilms = async ({ genre, page }, res) => {
  // render movies by genre and page
  const offset = parseInt(page) * cardsPerPage
  // number of results to skip given by the page number requested by the user multiplied by the films on each page

  const [
    { id }
  ] = await dbQuery("SELECT `id` FROM `genres` WHERE `name` = ? LIMIT 1", [
    genre
  ])

  // select the IDs of the films by skipping those of the "previous pages"

  const listOfTitlesID = await dbQuery(
    `SELECT filmID FROM genreFilm WHERE genreID = ? LIMIT 10 OFFSET ?`,
    [id, offset]
  )

  // get the title from the id

  const requestsTitle = listOfTitlesID.map(({ filmID }) =>
    dbQuery("SELECT title FROM `films` WHERE `id` = ? LIMIT 1", [filmID])
  )

  const listOfTitles = await Promise.all(requestsTitle)

  const requestsData = listOfTitles.map(([{ title }]) => searchFilm(title))

  let listOfFilms = await Promise.all(requestsData)

  // to lighten the data of the films I keep only the useful keys

  listOfFilms = listOfFilms.map((film) => ({
    Title: film.Title,
    imdbRating: film.imdbRating,
    imdbVotes: film.imdbVotes,
    imdbID: film.imdbID,
    Poster: film.Poster,
    Genre: film.Genre,
    Plot: film.Plot
  }))

  listOfFilms.sort((a, b) => b.imdbRating - a.imdbRating) // sort the films by descending vote
  res.status(200).json({
    listOfFilms
  })
  //the try-catch block is missing, to be added together with an error message
}

// vote for a movie given its title, liked it and the voting user's id

const voteFilm = async ({ title, rating }, userIDreq, res) => {
  try {
    const data = await searchFilm(title)

    const genres = data.Genre.split(", ")

    // check if the user has already voted the movie

    let titleID = await dbQuery(
      "SELECT films.id FROM films INNER JOIN votes ON films.id = votes.filmID AND userID = ? AND films.title = ? LIMIT 1",
      [userIDreq, title]
    )
    if (titleID.length < 1) {
      // check if the film has been voted by any user
      titleID = await dbQuery("SELECT id FROM films WHERE title = ? LIMIT 1", [
        title
      ])

      if (!titleID.length) {
        const {
          insertId // id of the inserted film
        } = await dbQuery(`INSERT INTO films (title) VALUES(?)`, [title])
        genres.forEach(async (genre) => {
          let [
            { id } // id of the current genre
          ] = await dbQuery(`SELECT id FROM genres WHERE name = ? LIMIT 1`, [
            genre
          ])

          // if the genre is not present in the genre table it is added
          if (id !== undefined) {
            dbQuery(`INSERT INTO genreFilm VALUES(?, ?)`, [insertId, id])
          } else {
            await dbQuery(`INSERT INTO genres (name) VALUES(?)`, [genre])
            let genreID = await dbQuery(
              `SELECT id FROM genres WHERE name = ? LIMIT 1`,
              [genre]
            )
            dbQuery(`INSERT INTO genreFilm VALUES(?, ?)`, [
              insertId,
              genreID[0].id
            ])
          }
        })
      }

      // insert the vote
      dbQuery(`INSERT INTO votes VALUES(?,?,?)`, [
        titleID[0].id,
        userIDreq,
        rating
      ])
    } else {
      // if the user has already voted for the film, the vote is updated
      dbQuery(
        `UPDATE votes SET liked = ? WHERE filmID = ? AND userID = ?`,
        [rating, titleID[0].id, userIDreq] //se l'utente ha già votato il film, il voto è aggiornato
      )
    }

    res.status(200).json({ auth: true, vote: true })
  } catch (err) {
    res.status(401).json({ auth: true, vote: false })
  }
}

const favoriteFilms = async (userID, res) => {
  // takes ALL the movies voted by the user, very heavy function to UPDATE
  let userFilms = []
  let userGenres = []
  try {
    let results = await dbQuery(
      `SELECT DISTINCT films.title, votes.liked
      FROM films
      INNER JOIN votes ON films.id = votes.filmID AND votes.userID = ?`,
      [userID]
    )
    // if there are 1 or + films voted by the user in that genre then it scrolls them
    results = results.map(({ title }) => searchFilm(title))
    const allData = await Promise.all(results)
    for (let data of allData) {
      // if the one just searched for is not present in the list of the user's films, it adds it
      const { Title, imdbRating, Poster, Genre } = data
      Genre.split(", ").forEach((genre) => {
        if (!userGenres.includes(genre)) userGenres.push(genre)
      })

      userFilms.push({ Title, imdbRating, Poster, Genre })
    }
    userGenres.sort() // alphabetical order of genres
    userFilms.sort((a, b) => b.imdbRating - a.imdbRating)
    res.status(200).json({ userFilms, userGenres, auth: true })
  } catch {
    res.status(401).json({ auth: false })
  }
}

// API SECTION -------------------------------------------------------------------------------

app.get("/genres", async (req, res) => {
  const results = await dbQuery("SELECT * FROM `genres`", [])
  res.status(200).json(results)
})

app.get("/films", (req, res) => {
  renderFilms(req.query, res)
})

app.get("/search", async (req, res) => {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(req.query.s)}&apikey=${
      process.env.OMDBKEY
    }`
  )
  const data = await response.json()
  if (data.Response) {
    res.status(200).json(data)
  } else res.status(400).json(data.Response)
})

app.get("/pagination", async (req, res) => {
  const [
    { id }
  ] = await dbQuery("SELECT `id` FROM `genres` WHERE `name` = ? LIMIT 1", [
    req.query.genre
  ])
  const [
    { pagesLength }
  ] = await dbQuery(
    "SELECT COUNT(genreID) AS pagesLength FROM genreFilm WHERE genreID = ?",
    [id]
  )
  res.json({ pagesLength })
})

app.get("/film/:title", async (req, res) => {
  const { title } = req.params
  try {
    const data = await searchFilm(title)
    data.Title
      ? res.status(200).json({ data, found: true })
      : res.status(400).json({ found: false })
  } catch {
    res.status(400).json({ found: false })
  }
})

app.get("/user/:username", verifyToken, (req, res) => {
  favoriteFilms(req.id, res)
})

app.post("/login", (req, res) => {
  loginUser(req.body, res)
})

app.post("/registration", (req, res) => {
  userRegistration(req.body, res)
})

app.put("/vote", verifyToken, (req, res) => {
  voteFilm(req.body, req.id, res)
})

app.post("/token", verifyToken, async (req, res) => {
  try {
    const [
      { username }
    ] = await dbQuery(`SELECT username FROM users WHERE id = ? LIMIT 1`, [
      req.id
    ])
    res.status(200).send({ username, auth: true })
  } catch {
    res.status(301).send({ auth: false })
  }
})

app.listen(8080)
