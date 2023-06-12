import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePassChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit');
    const errors = {};

    if (!password) {
      errors.password = 'Password is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    let result = await fetch('http://localhost:2222/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    result = await result.json();
    console.warn(result);

    if (result.auth) {
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', JSON.stringify(result.auth));
      navigate('/');
    } else {
      alert('Enter valid user');
    }
  };

  return (
    <div className='Login'>
      <h1>&ensp;Please Login Here</h1>
      <input
        type='text'
        className='inputs'
        placeholder='Email'
        value={email}
        maxLength={80}
        onChange={handleEmailChange}
      />
      {errors.email && <span>&ensp;&nbsp;{errors.email}</span>}
      <input
        type='password'
        className='inputs'
        placeholder='Password'
        value={password}
        maxLength={80}
        onChange={handlePassChange}
      />
      {errors.password && <span>&ensp;&nbsp;{errors.password}<br /></span>}
      <button type='button' className='signUpButton' onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
};

export default Login;
