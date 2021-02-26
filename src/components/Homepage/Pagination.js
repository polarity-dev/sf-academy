import React, { useState } from "react"
import "./pagination.css"

const Pagination = ({ pagesNumber, onPageClick, currentPage }) => {
  const ListPages = () => {
    const content = []
    for (let index = 0; index < pagesNumber; index++) {
      content.push(
        <li
          className={+currentPage === index ? "active page-item" : "page-item"}
          data-page={index}
          key={index}
          onClick={onPageClick}>
          {index + 1}
        </li>
      )
    }

    return content
  }

  return (
    <ul className="pagination justify-content-center">
      {+currentPage > 0 ? (
        <li
          data-page={+currentPage - 1}
          onClick={onPageClick}
          className="page-item">
          <i className="fas fa-angle-double-left"></i>
        </li>
      ) : null}
      <ListPages />
      {+currentPage + 1 < pagesNumber ? (
        <li
          data-page={+currentPage + 1}
          onClick={onPageClick}
          className="page-item">
          <i className="fas fa-angle-double-right"></i>
        </li>
      ) : null}
    </ul>
  )
}

export default Pagination
