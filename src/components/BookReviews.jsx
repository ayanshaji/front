import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TextField, Button, MenuItem, Paper, Divider, Rating
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewBook = () => {
  const { id: bookId } = useParams();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [reviews, setReviews] = useState([]);

  // Fetch reviews on load
  useEffect(() => {
    if (!bookId) return;
    axios.get(`http://localhost:3004/reviews/${bookId}`)
      .then(res => setReviews(res.data))
      .catch(() => toast.error("Failed to load reviews"));
  }, [bookId]);

  const handleSubmit = () => {
    if (!username || !rating || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newReview = {
      bookId,
      rating: parseInt(rating),
      comment,
      reviewer: username
    };

    axios.post('http://localhost:3004/reviews', newReview)
      .then(() => {
        toast.success("Review submitted!");
        setReviews(prev => [...prev, newReview]);
        setRating('');
        setComment('');
        setUsername('');
      })
      .catch(() => toast.error("Failed to submit review"));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Leave a Review</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
        <TextField
          label="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          select
          label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <MenuItem key={num} value={num}>{num} Star{num > 1 && 's'}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit Review
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>All Reviews</Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        reviews.map((review, index) => (
          <Paper key={review._id || index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.reviewer}
            </Typography>
            <Rating
              value={Number(review.rating)}
              readOnly
              sx={{ color: '#fbc02d' }} // yellow color
            />
            <Typography variant="body2" mt={1}>
              {review.comment}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default ReviewBook;
