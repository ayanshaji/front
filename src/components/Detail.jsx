import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Detail = () => {
  const { id } = useParams(); // book._id
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    returnDate: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You would send this data to the backend here
    console.log('Reserving book:', id, form);

    
    toast.success("Reservation request sent!");
    

    setTimeout(() => {
      navigate('/view'); // Adjust route as needed
    }, 2000);
  };

   

  return (


    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom >
        Reserve Book 
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <TextField
          name="name"
          label="Your Name"
          required
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Your Email"
          required
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          name="returnDate"
          label="Returning Date"
          required
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.returnDate}
          onChange={handleChange}
        />
        <Button variant="contained" type="submit">Confirm Reservation</Button>

        <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        newestOnTop={true}
        theme="dark"
        closeButton={false}
      />
      </Box>
    </Container>

    
  );
};

export default Detail;
