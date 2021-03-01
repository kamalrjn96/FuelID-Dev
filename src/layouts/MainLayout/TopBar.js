import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  makeStyles,
  Box,
  Typography
} from '@material-ui/core';
import Logo from 'src/components/Logo';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme();

theme.typography.h2 = {
  fontSize: '0.8rem',
  '@media (min-width:600px)': {
    fontSize: '1.2rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem'
  }
};

const useStyles = makeStyles({
  root: {},
  toolbar: {
    height: 64
  }
});

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Logo />
        <Box flexGrow={1} />
        {/* <Typography style={{ color: 'white' }} variant="h3">
              SHAKTHI GANAPATHI FUEL STATION
            </Typography> */}
        <ThemeProvider theme={theme}>
          <Typography style={{ color: 'white' }} variant="h2">
            Shakti Ganapathi Fuel Station
          </Typography>
        </ThemeProvider>
        <Box flexGrow={1} />
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
