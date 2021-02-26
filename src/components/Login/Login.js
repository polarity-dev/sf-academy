import fetch from "node-fetch"
import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import "./login.css"

const Login = ({ setToken }) => {
  const [message, setMessage] = useState()
  const [inputUsername, setInputUsername] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const history = useHistory()

  const onFormSubmit = (e) => {
    e.preventDefault()
    if (inputUsername.length > 0 && inputPassword.length > 0) {
      fetch("/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setMessage(data.message)
          } else {
            setToken(data.token)
            history.push("/")
          }
        })
    }
  }

  return (
    <div id="loginPage">
      <form id="loginForm" onSubmit={onFormSubmit}>
        <a href="/">
          <img src="/img/dkLogo.jpg" id="imgLogo" alt="" />
        </a>

        {message === undefined ? (
          <h1 id="title">Log in</h1>
        ) : (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={inputUsername}
            spellCheck="false"
            onChange={(e) => setInputUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={inputPassword}
            onChange={(e) => {
              setInputPassword(e.target.value)
            }}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <a id="registrationLink" href="/registration">
            Do not have an account? Create it now
          </a>
        </div>

        <button className="btn" onClick={onFormSubmit}>
          SUBMIT
        </button>
      </form>
    </div>
  )
}

export default Login
