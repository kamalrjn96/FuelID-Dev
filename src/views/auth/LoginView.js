import React, { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { A, navigate } from 'hookrouter';
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
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  scrollPaper: {
    alignItems: 'baseline'
  }
}));

const LoginView = () => {
  const classes = useStyles();
  /* const navigate = useNavigate(); */
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const { login, resetPassword, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState(false);
  const [resetEmail, setResetEmail] = useState(false);
  const [password, setpassword] = useState(false);
  const [openPasswordReset, setOpenPasswordReset] = useState(false);

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
      navigate('/app/dashboard', true);
    } catch {
      setError('Failed to log in');
    }

    setLoading(false);
  }

  async function handleReset() {
    await resetPassword(resetEmail)
      .then(() => {
        window.alert(`Email has been sent to ${resetEmail}`);
      })
      .catch((error) => {
        console.log(error.code, error.message);
        window.alert(`${error.message} Enter Valid e-mail ID`);
      });
    setResetEmail();
    handleClosePasswordReset();
  }

  const handleClosePasswordReset = () => {
    setOpenPasswordReset(false);
  };

  const handleOpenPasswordReset = () => {
    setOpenPasswordReset(true);
  };

  function changeOnHover(e) {
    e.target.style.cursor = 'pointer';
  }

  return (
    <>
      {!currentUser ? (
        <Page className={classes.root} title="Login">
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="center"
          >
            <Container maxWidth="sm">
              <Dialog
                open={openPasswordReset}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClose={handleClosePasswordReset}
                className={classes.scrollPaper}
              >
                <DialogTitle>Enter Email ID to reset Password</DialogTitle>
                <DialogContent>
                  <form
                    className={classes.container} /* onSubmit={handleReset} */
                  >
                    <FormControl className={classes.formControl}>
                      <TextField
                        fullWidth
                        label="Email ID"
                        margin="normal"
                        name="resetEmailID"
                        variant="outlined"
                        required
                        onChange={(e) => setResetEmail(e.target.value)}
                      />

                      <DialogActions>
                        <Button
                          onMouseOver={(e) => changeOnHover(e)}
                          onClick={(e) => handleClosePasswordReset()}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onMouseOver={(e) => changeOnHover(e)}
                          onClick={handleReset}
                          color="primary"
                        >
                          Ok
                        </Button>
                      </DialogActions>
                    </FormControl>
                  </form>
                </DialogContent>
              </Dialog>
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
                      {/* <A href="/forgotPassword" variant="body2">
                        Forgot password?
                      </A> */}
                      <Button onClick={handleOpenPasswordReset}>
                        Forgot password?
                      </Button>
                    </Grid>
                    <Grid item>
                      <Typography color="textSecondary" variant="body1">
                        Don&apos;t have an account?{' '}
                        <A href="/register" variant="body2">
                          Sign up
                        </A>
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
          {/* <Dialog
            open={openPassword}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={handleCloseCancelOrderRemark}
          >
            <DialogTitle>Enter Email Address to reset Password</DialogTitle>
            <DialogContent>
              <form
                className={classes.container}
                onSubmit={(e) =>
                  handleCancelOrder(e, props.order.orderID, 'Driver')
                }
              >
                <FormControl className={classes.formControl}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    margin="normal"
                    name="cancelRemarks"
                    variant="outlined"
                    required
                    onChange={(e) => setCancelRemark(e.target.value)}
                  />

                  <DialogActions>
                    <Button
                      onMouseOver={(e) => changeOnHover(e)}
                      onClick={(e) => handleCloseCancelOrderRemark()}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onMouseOver={(e) => changeOnHover(e)}
                      onClick={(e) =>
                        handleCancelOrder(e, props.order.orderID, 'Driver')
                      }
                      color="primary"
                      type="submit"
                    >
                      Ok
                    </Button>
                  </DialogActions>
                </FormControl>
              </form>
            </DialogContent>
          </Dialog> */}
        </Page>
      ) : (
        navigate('/app/dashboard', true)
      )}
    </>
  );
};

export default LoginView;
