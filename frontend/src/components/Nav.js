import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Nav = ({ getBooks }) => {
  const auth = localStorage.getItem('user');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/SignUp');
  };

  const handleReloadPage = () => {
    getBooks();
    navigate('/');
  };

  return (
    <div className='main'>
      <nav className='navbar'>
        <div className='navbar-logo'>
          <Link to='/' onClick={handleReloadPage}>
            BookShelf
          </Link>
        </div>

        <ul className='navbar-links'>
          {auth ? (
            <>
              <li className='navbar-item'>
                <Link to='/' className='navbar-link' onClick={handleReloadPage}>
                  Home
                </Link>
              </li>
              <li className='navbar-item'>
                <Link to='/add' className='navbar-link'>
                  Add Book
                </Link>
              </li>
              <li className='navbar-item'>
                <Link onClick={logout} to='/SignUp' className='navbar-link'>
                  Logout({JSON.parse(auth).name})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className='navbar-item'>
                <Link to='/SignUp' className='navbar-link'>
                  SignUp
                </Link>
              </li>
              <li className='navbar-item'>
                <Link to='/login' className='navbar-link'>
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
