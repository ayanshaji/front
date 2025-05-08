import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import AddBook from './components/AddBook';
import ViewBooks from './components/ViewBooks';
import EditBook from './components/EditBook';
import BookDetails from './components/BookDetails';
import BorrowBook from './components/BorrowBook';
import Login from './components/Login';
import Signin from './components/Signin';
import Detail from './components/Detail';
import Chatbot from "./components/Chatbot";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookReviews from './components/BookReviews';


function App() {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10')
      .then(res => {
        const booksData = res.data.items.map(item => {
          const info = item.volumeInfo;
          return {
            id: item.id,
            title: info.title,
            author: info.authors ? info.authors[0] : 'Unknown',
            genre: info.categories ? info.categories[0] : 'Unknown',
            published: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : 'N/A',
            borrowed: false,
            borrowedBy: '',
            borrowDate: ''
          };
        });
        setBooks(booksData);
      })
      .catch(err => console.error('Failed to fetch books:', err));
  }, []);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/sign" element={<Signin />} />

        {isLoggedIn && userRole === 'admin' && (
          <>
            <Route path="/add" element={<AddBook books={books} setBooks={setBooks} />} />
            <Route path="/view" element={<ViewBooks books={books} />} />
            <Route path="/borrow" element={<BorrowBook books={books} setBooks={setBooks} />} />
            <Route path="/edit/:id" element={<EditBook books={books} setBooks={setBooks} />} />
            <Route path="/details/:id" element={<BookDetails books={books} />} />
            <Route path="/reviews/:id" element={<BookReviews books={books} setBooks={setBooks} />} />

          </>
        )}

        {isLoggedIn && userRole === 'user' && (
          <>
            <Route path="/view" element={<ViewBooks books={books} />} />
            <Route path="/details/:id" element={<BookDetails books={books} />} />
            <Route path="/detail/:id" element={<Detail />} />
          </>
        )}
      </Routes>
      <Chatbot />
      <ToastContainer />
    </>
  );
}

export default App;
