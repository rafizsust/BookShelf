import './App.css';
import Nav from './components/Nav'
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddBook from './components/AddBook';
import BookList from './components/BookList';
import UpdateBook from './components/UpdateBook';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateComponent from './components/PrivateComponent';
import Borrow from './components/Borrow';

function App() {
  return (
    <BrowserRouter>
    <Nav/>
    <Routes>
      <Route element={<PrivateComponent/>}>
      <Route path='/' element={<BookList/>}/> 
      <Route path='/add' element={<AddBook/>}/>
      <Route path='/cart' element={<h1>you can add books here</h1>}/>
      <Route path='/update/:id' element={<UpdateBook/>}/>
      <Route path='/logOut' element={<h1>logout page</h1>}/>
      <Route path='/borrow/:id' element={<Borrow/>}/>
      </Route>
      <Route path='/SignUp' element={<SignUp/>}/>
      <Route path='/Login' element={<Login/>}/>
     </Routes>
    </BrowserRouter>
    
  );
}

export default App;
