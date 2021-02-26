const Footer = () => {
  return (
    <footer className="page-footer font-small special-color-dark pt-4">
      <div className="container">
        <ul className="list-unstyled list-inline text-center">
          <li className="list-inline-item">
            <a
              href="https://www.facebook.com/profile.php?id=100010848486989"
              className="btn-floating fa-lg fa-2x">
              <i className="fab fa-facebook-f"> </i>
            </a>
          </li>
          <li className="list-inline-item">
            <a
              href="https://twitter.com/Mmorello08"
              className="btn-floating fa-lg fa-2x">
              <i className="fab fa-twitter"> </i>
            </a>
          </li>
          <li className="list-inline-item">
            <a
              href="https://www.instagram.com/matteo.mrl/?hl=it"
              className="btn-floating fa-lg fa-2x">
              <i className="fab fa-instagram"> </i>
            </a>
          </li>
          <li className="list-inline-item">
            <a
              href="https://www.linkedin.com/in/matteo-morellini-306a331a8/"
              className="btn-floating fa-lg fa-2x">
              <i className="fab fa-linkedin-in"> </i>
            </a>
          </li>
          <li className="list-inline-item">
            <a
              href="https://github.com/TheGodMorel"
              className="btn-floating fa-lg fa-2x">
              <i className="fab fa-github"> </i>
            </a>
          </li>
        </ul>
      </div>

      <div className="footer-copyright text-center py-3">
        Created with <i className="fas fa-heart"></i> by Matteo Morellini.
      </div>
    </footer>
  )
}

export default Footer
