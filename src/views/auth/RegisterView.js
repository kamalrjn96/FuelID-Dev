import React, { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '@material-ui/lab/Alert';
import { db } from '../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstName, setfirstName] = useState(false);
  const [lastName, setlastName] = useState(false);
  const [email, setemail] = useState(false);
  const [password, setpassword] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState(false);
  const [mobileNumber, setmobileNumber] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (mobileNumber && typeof mobileNumber !== 'undefined') {
      let pattern = new RegExp(/^[0-9\b]+$/);
      if (!pattern.test(mobileNumber)) {
        return setError('Please enter only number');
      } else if (mobileNumber.length !== 10) {
        return setError('Please enter valid phone number');
      }
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password).then((cred) => {
        // Updates the user attributes:

        cred.user
          .updateProfile({
            displayName: `${firstName} ${lastName}`
          })
          .then(
            function () {
              console.log('Name Updated');
            },
            function (error) {
              setError(error);
            }
          );

        return db.collection('users').doc(cred.user.uid).set({
          isCustomer: true,
          mobileNumber: mobileNumber
        });
      });
      navigate('/app/dashboard', { replace: true });
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  }
  return (
    <Page className={classes.root} title="Register">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Box mb={3}>
            <Typography color="textPrimary" variant="h2">
              Create new account
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Use your email to create new account
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <form className="form" noValidate>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              name="firstName"
              variant="outlined"
              required
              onChange={(e) => setfirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              name="LastName"
              variant="outlined"
              required
              onChange={(e) => setlastName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Mobile number"
              margin="normal"
              name="mobileNumber"
              variant="outlined"
              required
              onChange={(e) => setmobileNumber(e.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              type="email"
              variant="outlined"
              required
              onChange={(e) => setemail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              margin="normal"
              name="password"
              type="password"
              variant="outlined"
              required
              onChange={(e) => setpassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              margin="normal"
              name="confirmPassword"
              type="password"
              variant="outlined"
              required
              onChange={(e) => setconfirmPassword(e.target.value)}
            />

            <Box my={2}>
              <Button
                color="primary"
                disabled={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleSubmit}
              >
                Sign up now
              </Button>
            </Box>
          </form>
          <Typography color="textSecondary" variant="body1">
            Have an account?{' '}
            <Link component={RouterLink} to="/login" variant="h6">
              Sign in
            </Link>
          </Typography>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
