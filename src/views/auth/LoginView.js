import React, { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '@material-ui/lab/Alert';
import Loading from '../../state/Loading';

import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState(false);
  const [password, setpassword] = useState(false);

  const loadState = () => {
    return <Loading />;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');

      setLoading(true);
      await login(email, password);
      loadState();
      navigate('/app/dashboard', { replace: true });
    } catch {
      setError('Failed to log in');
    }

    setLoading(false);
  }

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          {/* <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              password: Yup.string()
                .max(255)
                .required('Password is required')
            })}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form
              /* onSubmit={
                  (handleSubmit,
                  console.log({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                  }))
                } 
              > */}
          <Box mb={3}>
            <Typography color="textPrimary" variant="h2">
              Sign in
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <form className="form" noValidate>
            <TextField
              /*  error={Boolean(touched.email && errors.email)} */
              fullWidth
              /* helperText={touched.email && errors.email} */
              label="Email Address"
              margin="normal"
              name="email"
              /* onBlur={handleBlur}
                  onChange={handleChange} */
              type="email"
              required
              variant="outlined"
              innerRef={emailRef}
              onChange={(e) => setemail(e.target.value)}
            />
            <TextField
              /* error={Boolean(touched.password && errors.password)} */
              fullWidth
              /* helperText={touched.password && errors.password} */
              label="Password"
              margin="normal"
              name="password"
              /* onBlur={handleBlur}
                  onChange={handleChange} */
              type="password"
              variant="outlined"
              innerRef={passwordRef}
              onChange={(e) => setpassword(e.target.value)}
              required
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
                Sign in now
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" variant="body1">
                    Don&apos;t have an account?{' '}
                    <Link component={RouterLink} to="/register" variant="h6">
                      Sign up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </form>
          {/* </form>
            )}
          </Formik> */}
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
