import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
    /* [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    } */
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    bottom: 0,
    position: 'sticky'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  /*  var userRef;
  if (currentUser) {
    userRef = db.collection('users').doc(currentUser.uid);
  } */

  const [userData, setUserData] = useState();

  /*   useEffect(() => {
    try {
      db.collection('users')
        .doc(currentUser.uid)
        .get()
        .then(function (doc) {
          if (doc) {
            setUserData(doc.data());
            console.log(doc.data());
          }
        });
    } catch (err) {
      console.log(err);
      console.log('Failed to get user data');
    }
  }, [currentUser]);
 */
  useEffect(() => {
    try {
      db.collection('users')
        .doc(currentUser.uid)
        .onSnapshot((snapShot) => setUserData(snapShot.data()));
    } catch (err) {
      console.log(err);
      console.log('Failed to Update user data');
    }
  }, []);

  return (
    <div className={classes.root}>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        userData={userData}
        updateUserData={setUserData}
      />

      {/* <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      /> */}
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
            <footer className={classes.footer}>
              <Container /*  maxWidth="sm" */>
                <Grid container justify="space-between" className={classes.pos}>
                  <Grid item>
                    <Typography color="textPrimary" variant="h6">
                      SHAKTHI GANAPATHI FUEL STATION
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary" variant="caption">
                      Phone : 9008761088 | Email : r6mesh@gmail.com | Toll Free
                      No : 1800 2333 555
                    </Typography>
                  </Grid>
                </Grid>
              </Container>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
