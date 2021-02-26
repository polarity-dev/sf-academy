import React from "react"
import "./page404.css"
const Page404 = () => {
  return (
    <div className="body-error404">
      <div className="div-error404">
        <a href="/">
          <img src="/img/logo2.jpg" id="imgLogo" alt="" />
        </a>
        <h1>
          <i class="fas fa-exclamation-triangle"></i> ERROR 404{" "}
          <i class="fas fa-exclamation-triangle"></i> <br /> PAGE NOT FOUND{" "}
        </h1>
        <a href="/" id="homepageLink">
          <i class="fas fa-home"></i> BACK TO HOME PAGE{" "}
        </a>
      </div>
    </div>
  )
}

export default Page404
