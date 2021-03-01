import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
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

const MainLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBar />
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

export default MainLayout;
