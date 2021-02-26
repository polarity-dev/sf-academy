import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./components/Homepage/Home.js"
import SearchedFilm from "./components/Film/SearchedFilm.js"
import Login from "./components/Login/Login.js"
import Registration from "./components/Registration/Registration.js"
import UserMenu from "./components/User/UserMenu.js"
import Page404 from "./components/404Page/Page404.js"
import "./components/Homepage/index.css"
const App = () => {
  const getCookie = (cname) => {
    const name = cname + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }

  const [token, setToken] = useState("")
  useEffect(() => setToken(getCookie("jwt")), [])

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/film/:title">
            <SearchedFilm token={token} setToken={setToken} />
          </Route>
          <Route exact path="/user/:username">
            <UserMenu token={token} setToken={setToken} />
          </Route>
          <Route exact path="/login">
            <Login setToken={setToken} />
          </Route>
          <Route exact path="/registration">
            <Registration setToken={setToken} />
          </Route>
          <Route exact path="/">
            <Home token={token} setToken={setToken} />
          </Route>
          <Route path="/">
            <Page404 />
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  )
}

export default App
