import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Paper, FormControl, InputLabel, Select,
  MenuItem, TextField, Button, Stack, Divider
} from '@mui/material';

const BorrowBook = () => {
  const [books, setBooks] = useState([]);
  const [selectedBorrowId, setSelectedBorrowId] = useState('');
  const [borrower, setBorrower] = useState('');
  const [selectedReturnId, setSelectedReturnId] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3004/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books', error);
    }
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3004/borrow', {
        bookId: selectedBorrowId,
        borrower
      });
      fetchBooks();
      setSelectedBorrowId('');
      setBorrower('');
    } catch (err) {
      console.error('Borrow error:', err);
    }
  };

  const handleReturn = async () => {
    try {
      await axios.post('http://localhost:3004/return', {
        bookId: selectedReturnId
      });
      fetchBooks();
      setSelectedReturnId('');
    } catch (err) {
      console.error('Return error:', err);
    }
  };

  const availableBooks = books.filter(book => !book.borrowed);
  const borrowedBooks = books.filter(book => book.borrowed);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Borrow a Book</Typography>
        <form onSubmit={handleBorrow}>
          <Stack spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Select Book</InputLabel>
              <Select
                value={selectedBorrowId}
                onChange={(e) => setSelectedBorrowId(e.target.value)}
                label="Select Book"
              >
                {availableBooks.map(book => (
                  <MenuItem key={book._id} value={book._id}>
                    {book.title} — {book.author}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Borrower's Name"
              fullWidth
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!selectedBorrowId || !borrower}
            >
              Confirm Borrow
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Return a Book</Typography>
        <Stack spacing={2}>
          <FormControl fullWidth required>
            <InputLabel>Select Borrowed Book</InputLabel>
            <Select
              value={selectedReturnId}
              onChange={(e) => setSelectedReturnId(e.target.value)}
              label="Select Borrowed Book"
            >
              {borrowedBooks.map(book => (
                <MenuItem key={book._id} value={book._id}>
                  {book.title} — {book.borrowedBy} on {book.borrowDate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleReturn}
            disabled={!selectedReturnId}
          >
            Confirm Return
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default BorrowBook;
 