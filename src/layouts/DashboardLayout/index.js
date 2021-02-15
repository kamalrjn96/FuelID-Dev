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
    padding: theme.spacing(1.5, 1),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    bottom: 0,
    position: 'sticky'
  }
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const [userData, setUserData] = useState();
  const [price, setPrice] = useState(92);

  const currentPriceRef = db
    .collection('priceForTheDay')
    .doc('e8kgvrn1XGzqM4JYAG3X');

  /*   useEffect(() => {
        return currentPriceRef.onSnapshot(function (doc) {
          if (doc) {
            doc.data() && setPrice(doc.data().price);
          }
        });
      }, []); */

  useEffect(() => {
    try {
      db.collection('users')
        .doc(currentUser.uid)
        .onSnapshot((snapShot) => setUserData(snapShot.data()));
    } catch (err) {
      console.log(err);
      console.log('Failed to Update user data');
    }

    return currentPriceRef.onSnapshot(function (doc) {
      if (doc) {
        doc.data() && setPrice(doc.data().price);
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        userData={userData}
        updateUserData={setUserData}
        price={price}
        setPrice={setPrice}
      />

      {userData && userData.isOwner !== undefined && <p>HI</p>}
      {/* <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      /> */}
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            {/* <Outlet /> */}
            {children}
            <footer className={classes.footer}>
              <Container /*  maxWidth="sm" */>
                <Grid container justify="center" className={classes.pos}>
                  <Grid item>
                    <Typography style={{ color: 'black' }} variant="caption">
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
