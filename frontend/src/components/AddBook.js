import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const AddBook = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const addBook = async () => {
    if (!name || !author || !genre) {
      setError(true);
      return false;
    }

    const lowerCaseName = name.toLowerCase();
    const lowerCaseAuthor = author.toLowerCase();
    const lowerCaseGenre = genre.toLowerCase();

    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const result = await fetch("http://localhost:2222/add", {
      method: 'post',
      body: JSON.stringify({ name: lowerCaseName, author: lowerCaseAuthor, genre: lowerCaseGenre, userId }),
      headers: {
        'Content-Type': "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });

    const response = await result.json();
    console.warn(response);
    navigate('/');
  }

  const handleGenreSelection = (e) => {
    setGenre(e.target.value);
  };

  return (
    <div className="addBook">
      <h1>Add New Book</h1>
      <input
        className="inputBox"
        type='text'
        placeholder="Book Name"
        value={name}
        maxLength={80}
        onChange={(e) => { setName(e.target.value) }}
      />
      {error && !name && <span>&ensp; Enter valid name</span>}

      <input
        className="inputBox"
        type='text'
        placeholder="Author"
        value={author}
        maxLength={80}
        onChange={(e) => { setAuthor(e.target.value) }}
      />
      {error && !author && <span>&ensp;&nbsp;Enter valid author</span>}

      <div className="dropdown-container">
        <label htmlFor="genre-select">Select a genre:</label>
        <select id="genre-select" value={genre} onChange={handleGenreSelection}>
          <option value="">--genre--</option>
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
          <option value="Law & Criminology">Law & Criminology</option>
          <option value="Memoir & Autobiography">Memoir & Autobiography</option>
          <option value="Motivational/Inspirational">Motivational/Inspirational</option>
          <option value="Politics & Social Sciences">Politics & Social Sciences</option>
          <option value="Religion & Spirituality">Religion & Spirituality</option>
          <option value="Romance">Romance</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Self-Help/Personal Development">Self-Help/Personal Development</option>
          <option value="Thriller">Thriller</option>
          <option value="Travel">Travel</option>
          <option value="True Crime">True Crime</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
      {error && !genre && <span>&ensp;&nbsp;Select a Genre<br /></span>}

      <button onClick={addBook} className="appButton">Add Book</button>
    </div>
  );
}

export default AddBook;
