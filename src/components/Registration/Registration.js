import fetch from "node-fetch"
import React, { useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import "./registration.css"

const Registration = ({ setToken }) => {
  const [username, setUsername] = useState("")
  const [mail, setMail] = useState("")
  const [password, setPassoword] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const [message, setMessage] = useState("")

  const history = useHistory()

  const usernameInput = useRef()
  const passwordInput = useRef()
  const mailInput = useRef()
  const validPassword = useRef(false)
  const passwordHelper = useRef()
  const validMail = useRef(false)
  const mailHelper = useRef()
  const validUsername = useRef(false)
  const usernameHelper = useRef()

  const submitButton = useRef()

  const onFormSubmit = (e) => {
    e.preventDefault()
    fetch("/registration", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, mail, password })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message)
        } else {
          setToken(data.token)
          history.push("")
        }
      })
  }

  useEffect(() => {
    if (username) {
      const regex = /^(?=.{3,14}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
      if (username.match(regex)) {
        validUsername.current = true
        usernameHelper.current.style.color = "green"
        usernameInput.current.classList.remove("invalid")
        usernameInput.current.classList.add("valid")
        checkFormValid()
      } else {
        validUsername.current = false
        usernameHelper.current.style.color = "red"
        usernameInput.current.classList.remove("valid")
        usernameInput.current.classList.add("invalid")
      }
    }
  })

  useEffect(() => {
    if (mail) {
      const regex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
      if (mail.match(regex)) {
        mailHelper.current.innerHTML = "<i class='fas fa-info'></i> Valid email"
        mailHelper.current.style.color = "green"
        validMail.current = true
        mailInput.current.classList.remove("invalid")
        mailInput.current.classList.add("valid")
        checkFormValid()
      } else {
        mailHelper.current.innerHTML =
          "<i class='fas fa-info'></i> Invalid email"
        mailHelper.current.style.color = "red"
        validMail.current = false
        mailInput.current.classList.remove("valid")
        mailInput.current.classList.add("invalid")
      }
    }
  }, [mail])

  useEffect(() => {
    if (password) {
      const regex = /^[A-Za-z]\w{5,13}$/
      if (password.match(regex)) {
        passwordHelper.current.innerHTML =
          "<i class='fas fa-info'></i> Valid password"
        passwordHelper.current.style.color = "green"
        validPassword.current = true
        passwordInput.current.classList.remove("invalid")
        passwordInput.current.classList.add("valid")
        checkFormValid()
      } else {
        passwordHelper.current.innerHTML =
          "<i class='fas fa-info'></i> 7 to 15 characters and the first must be a letter"
        passwordHelper.current.style.color = "red"
        validPassword.current = false
        passwordInput.current.classList.remove("valid")
        passwordInput.current.classList.add("invalid")
      }
    }
  }, [password])

  const checkFormValid = () => {
    if (validUsername.current && validMail.current && validPassword.current) {
      submitButton.current.disabled = false
      submitButton.current.style.backgroundColor = "white"
      submitButton.current.style.color = "black"
      submitButton.current.classList = "btn btn-abled"
      setIsFormValid(true)
    } else {
      submitButton.current.disabled = true
      submitButton.current.style.backgroundColor = "red"
      submitButton.current.classList = "btn"
      setIsFormValid(false)
    }
  }

  return (
    <div id="registrationPage">
      <form onSubmit={onFormSubmit} className="form-registration">
        <a href="/">
          <img src="/img/dkLogo.jpg" id="imgLogo" alt="" />
        </a>
        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
        <h1 id="title">Create account</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            ref={usernameInput}
            className="form-control"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <small id="usernameHelp" className="form-text" ref={usernameHelper}>
            <i className="fas fa-info"></i> Letters between 4 and 15
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="mail">Email address</label>
          <input
            type="email"
            className="form-control"
            id="mail"
            ref={mailInput}
            name="mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            autoComplete="email"
          />
          <small id="emailHelper" className="form-text" ref={mailHelper}>
            <i className="fas fa-info"></i> Insert a valid email
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            ref={passwordInput}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassoword(e.target.value)}
            autoComplete="new-password"
          />
          <small id="passwordHelp" ref={passwordHelper} className="form-text">
            <i className="fas fa-info"></i> 7 to 15 characters and the first
            must be a letter
          </small>
        </div>

        <button
          type="submit"
          className="btn"
          ref={submitButton}
          onClick={onFormSubmit}
          disabled>
          SUBMIT
        </button>
      </form>
    </div>
  )
}

export default Registration
