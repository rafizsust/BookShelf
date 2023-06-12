import React, { useEffect } from "react";
import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import '../App.css';
const UpdateBook = () => {
    const [name, setName] = React.useState('');
    const [author, setAuthor] = React.useState('');
    const [genre, setGenre] = React.useState('');
    
    const params = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        //console.warn(params);
        getBookDetails();
    },[])
    const getBookDetails = async()=>{
        let result = await fetch(`http://localhost:2222/book/${params.id}`,
        {
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }
        );
        result = await result.json();
        //console.warn(result);
        setName(result.name);
        setAuthor(result.author);
        setGenre(result.genre);
    }
    const updateBook = async() => {
        
        console.warn(name,author,genre);
        let result = await fetch(`http://localhost:2222/book/${params.id}`,{
        method : 'Put',

        body : JSON.stringify({name,author,genre}),
        headers:{
            'Content-Type':'application/json',
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
        
    })
    result = await result.json();
    console.warn(result);
    navigate("/");

    }
    return (
        <div className="update-book">
            <h1>Update Book</h1>
            <input className="inputBox" type='text' placeholder="Enter Book Name"
                value={name} onChange={(e) => { setName (e.target.value) }} />

            <input className="inputBox" type='text' placeholder="Enter Author Name"
                value={author} onChange={(e) => { setAuthor ( e.target.value )}} />


            <input className="inputBox" type='text' placeholder="Enter genre"
                value={genre} onChange={(e) => { setGenre(e.target.value )}} />
            

            <button onClick={updateBook} className="appButton">Update Book</button>
        </div>
    )

}
export default UpdateBook;