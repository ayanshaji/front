import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Rating } from '@mui/material';
import axios from 'axios';

const Reviews = () => {
  const { bookId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3004/reviews/${bookId}`)
      .then(res => setReviews(res.data))
      .catch(() => console.error("Failed to load reviews"));
  }, [bookId]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>User Reviews</Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews found for this book.</Typography>
      ) : (
        reviews.map((review, i) => (
          <Paper key={i} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">{review.reviewer}</Typography>
            <Rating value={review.rating} readOnly />
            <Typography variant="body2">{review.comment}</Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};


export default Reviews;
