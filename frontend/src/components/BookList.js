import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Footer from "./Footer";
const BookList = () => {
  const initialPage = 1;
  const itemPerPage = 20;
  const paginationLimit = 3; // Number of pagination buttons to display
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchKey, setSearchKey] = useState("");

  const handlePageChanges = (page) => {
    setCurrentPage(page);
  };

  const capitalizeString = (str) => {
    if (!str) {
      return str;
    }

    const words = str.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
  };

  const handleGenreSelection = async (e) => {
    if (e) {
      let result = await fetch("http://localhost:2222/", {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      const selectedGenre = e.target.value;
      if (selectedGenre === "#") setBooks(result);
      else {
        const filteredResult = result.filter((result) => result.genre === selectedGenre);
        if (filteredResult) setBooks(filteredResult);
      }
      setCurrentPage(initialPage); // Reset to the first page when changing the genre
    }
  };

  const getBooks = async () => {
    let result = await fetch("http://localhost:2222/", {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setBooks(result);
  };

  const deleteBook = async (id, name) => {
    let confirmed = window.confirm(`Are you sure you want to delete "${name}?"`);
    if (confirmed) {
      let result = await fetch(`http://localhost:2222/book/${id}`, {
        method: "Delete",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        getBooks();
      }
    }
  };

  const returnBook = async (id) => {
    const updatedBook = { ...books.find((book) => book._id === id) };
    updatedBook.borrow = "";
    updatedBook.returndate = "";

    let result = await fetch(`http://localhost:2222/book/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(updatedBook),
    });
    result = await result.json();
    if (result) {
      getBooks();
    }
  };

  const searchHandle = async (e) => {
    const key = e.target.value;
    setSearchKey(key);

    if (key) {
      let result = await fetch(`http://localhost:2222/search/${key}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();

      if (result) {
        setBooks(result);
      } else getBooks();
    }
  };

  const handleReloadPage = async () => {
    await getBooks();
    setCurrentPage(initialPage);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return books.slice(startIndex, endIndex);
  };

  const renderPaginationButtons = () => {
    const totalItem = books.length;
    const totalPages = Math.ceil(totalItem / itemPerPage);
    const rangeStart = Math.max(currentPage - 1, 1);
    const rangeEnd = Math.min(rangeStart + paginationLimit - 1, totalPages);

    return (
      <div className="pagination-container">
        <button className="pagination-button" onClick={() => handlePageChanges(1)}>
          &laquo;
        </button>
        {rangeStart > 1 && (
          <button className="pagination-button" onClick={() => handlePageChanges(rangeStart - 1)}>
            &hellip;
          </button>
        )}
        {Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i).map((page) => (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChanges(page)}
          >
            {page}
          </button>
        ))}
        {rangeEnd < totalPages && (
          <button className="pagination-button" onClick={() => handlePageChanges(rangeEnd + 1)}>
            &hellip;
          </button>
        )}
        <button className="pagination-button" onClick={() => handlePageChanges(totalPages)}>
          &raquo;
        </button>
      </div>
    );
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="book-list">
      <div>
        <br /><br />
        <div>
          <input
            className="search-book-box"
            type="text"
            placeholder="Search Books"
            value={searchKey}
            onChange={searchHandle}
          />
        </div>
        <br /><br />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Status/Modify</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().length > 0 ? (
              getPaginatedData().map((obj, p) => (
                <tr key={obj._id}>
                  <td>{`${p + 1} . ${capitalizeString(obj.name)}`}</td>
                  <td>{capitalizeString(obj.author)}</td>
                  <td>{capitalizeString(obj.genre)}</td>
                  <td className="action-buttons">
                    {obj.returndate ? (
                      <div className="returnInfo">
                        <div>Held By : {obj.borrow}</div>
                        <div>Return : {obj.returndate.toString().split("T")[0]}</div>
                      </div>
                    ) : (
                      <>
                        <button className="delete-button" onClick={() => deleteBook(obj._id, obj.name)}>
                          Delete
                        </button>
                        <Link className="update-button" to={`/update/${obj._id}`}>
                          Update
                        </Link>
                      </>
                    )}
                  </td>
                  <td>
                    {obj.returndate ? (
                      <button className="return-button" onClick={() => returnBook(obj._id)}>
                        Return
                      </button>
                    ) : (
                      <Link className="borrow-button" to={`/borrow/${obj._id}`}>
                        Borrow
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Book Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <br />
      <div className="pagination-filter-container">
        <div className="select-container">
          <select id="genre-select" onChange={handleGenreSelection}>
            <option value="#">--genre--</option>
            <option value="Adventure">Adventure</option>
            <option value="Art & Photography">Art & Photography</option>
            <option value="Business & Money">Business & Money</option>
            <option value="Cooking">Cooking</option>
            <option value="Crafts, Hobbies & Home">Crafts, Hobbies & Home</option>
            <option value="Detective & Mystery">Detective & Mystery</option>
            <option value="Dystopian">Dystopian</option>
            <option value="Education & Teaching">Education & Teaching</option>
            <option value="Families & Relationships">Families & Relationships</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Fiction">Fiction</option>
            <option value="Health & Fitness">Health & Fitness</option>
            <option value="History">History</option>
            <option value="Horror">Horror</option>
            <option value="Humor & Entertainment">Humor & Entertainment</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Thriller & Suspense">Thriller & Suspense</option>
          </select>
        </div>
        {renderPaginationButtons()}
      </div>
      <br/>
      <br/>
      <Footer />
    </div>
  );
};

export default BookList;
