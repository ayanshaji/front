import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Box, FormControl,
  InputLabel, Select, MenuItem, OutlinedInput, Checkbox,
  ListItemText, TextField
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FINE_PER_DAY = 2;
const BORROW_PERIOD_DAYS = 15;

const STATIC_GENRES = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Biography",
  "Mystery", "Thriller", "Romance", "Historical", "Self-Help",
  "Adventure", "Horror", "Poetry", "Drama", "Philosophy",
  "Children", "Young Adult", "Graphic Novel", "Cooking", "Travel"
];

const ViewBooks = ({ books, setBooks }) => {
  const [genreFilter, setGenreFilter] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const username = "User1"; // Replace with real user if needed
  const navigate = useNavigate();

  const calculateFine = (borrowDate) => {
    if (!borrowDate) return 0;
    const borrowed = new Date(borrowDate);
    const now = new Date();
    const diffTime = now - borrowed;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const overdueDays = diffDays - BORROW_PERIOD_DAYS;
    return overdueDays > 0 ? overdueDays * FINE_PER_DAY : 0;
  };

  const genres = Array.from(
    new Set([...STATIC_GENRES, ...books.map(book => book.genre)])
  ).sort();

  const years = [...new Set(books.map(book => String(book.published)))].sort();

  const handleClearFilters = () => {
    setGenreFilter([]);
    setYearFilter([]);
    setSearchTerm('');
  };

  const filteredBooks = books.filter(book => {
    const matchesGenres = genreFilter.length === 0 || genreFilter.includes(book.genre);
    const matchesYears = yearFilter.length === 0 || yearFilter.includes(String(book.published));
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGenres && matchesYears && matchesSearch;
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Library Books</Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Genre</InputLabel>
          <Select
            multiple
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            input={<OutlinedInput label="Filter by Genre" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                <Checkbox checked={genreFilter.includes(genre)} />
                <ListItemText primary={genre} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Year</InputLabel>
          <Select
            multiple
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            input={<OutlinedInput label="Filter by Year" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                <Checkbox checked={yearFilter.includes(year)} />
                <ListItemText primary={year} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Search Title/Author"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Published</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Reserved By</strong></TableCell>
              <TableCell><strong>Borrowed By</strong></TableCell>
              <TableCell><strong>Borrow Date</strong></TableCell>
              <TableCell><strong>Fine</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map(book => {
              const fine = book.borrowed ? calculateFine(book.borrowDate) : 0;
              return (
                <TableRow key={book.id  || `${book.title}-${i}`}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.published}</TableCell>
                  <TableCell>
                    {book.borrowed
                      ? 'Borrowed'
                      : book.reserved
                      ? 'Reserved'
                      : 'Available'}
                  </TableCell>
                  <TableCell>{book.reserved ? book.reservedBy : '-'}</TableCell>
                  <TableCell>{book.borrowed ? book.borrowedBy || '-' : '-'}</TableCell>
                  <TableCell>{book.borrowDate || '-'}</TableCell>
                  <TableCell>{fine > 0 ? `⚠️ $${fine}` : '-'}</TableCell>
                  <TableCell>
                    {!book.reserved && !book.borrowed && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/detail/${book.id}`)}
                        sx={{ mb: 1 }}
                      >
                        Reserve
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      component={Link}
                      to={`/reviews/${book.id}`}
                    >
                      Reviews
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Optional test button for Toast */}
      <Button onClick={() => toast.success("Test toast working!")}>
        Test Toast
      </Button>
    </Container>
  );
};

export default ViewBooks;
