import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, userRole, onLogout }) => {
  const buttonStyle = {
    color: 'white',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#6b5b95' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Library System
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/" sx={buttonStyle}>
            Home
          </Button>

          {isLoggedIn && userRole === 'admin' && (
            <>
              <Button component={Link} to="/add" sx={buttonStyle}>
                Add Book
              </Button>
              <Button component={Link} to="/view" sx={buttonStyle}>
                View Books
              </Button>
              <Button component={Link} to="/borrow" sx={buttonStyle}>
                Borrow Book
              </Button>
              <Button component={Link} to="/review" sx={buttonStyle}>
                Review
              </Button>
              <Button component="span" sx={buttonStyle} onClick={onLogout}>
                Logout
              </Button>
            </>
          )}

          {isLoggedIn && userRole === 'user' && (
            <>
              <Button component={Link} to="/view" sx={buttonStyle}>
                View Books
              </Button>
              <Button component="span" sx={buttonStyle} onClick={onLogout}>
                Logout
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <Button component={Link} to="/login" sx={buttonStyle}>
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
