import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../App.css";

const Borrow = () => {
  const [borrow, setBorrow] = useState("");
  const [returndate, setReturnDate] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleBorrow = async () => {
    if (!borrow || !returndate) {
      setError(true);
      return false;
    }

    console.warn(params.id);

    let result = await fetch(`http://localhost:2222/book/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ returndate, borrow }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    result = await result.json();
    console.warn(returndate);

    navigate("/");
  };

  return (
    <div className="Borrow">
      <p>&ensp;&nbsp;Enter Your Name and Select a Return Date</p>
      <input
        className="inputBox"
        type="text"
        placeholder="Your Name"
        value={borrow}
        onChange={(e) => {
          setBorrow(e.target.value);
        }}
      />
      {error && !borrow && <span>&ensp;&nbsp;Enter valid name</span>}

      <input
        className="inputBox"
        type="date"
        value={returndate}
        onChange={(e) => {
          setReturnDate(e.target.value);
        }}
      />
      {error && !returndate && <span>&ensp;&nbsp;Select return date<br /></span>}

      <button onClick={handleBorrow} className="appButton">
        Borrow Now
      </button>
    </div>
  );
};

export default Borrow;
