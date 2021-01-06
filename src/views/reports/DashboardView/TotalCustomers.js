import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  Chip
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const TotalCustomers = (props) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root)}>
      {props.userdata && props.userdata.isCustomer && (
        <div>
          <CardContent>
            {' '}
            <Grid container justify="space-between" spacing={1}>
              <Grid item>
                <Typography color="textSecondary" variant="h3">
                  Current Order
                </Typography>
                <Typography color="textSecondary" variant="caption">
                  {props.order.orderID}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container justify="center" spacing={6}>
                  <Grid item>
                    <Typography color="textPrimary" variant="h4">
                      {props.order.quantity}{' '}
                      <Typography color="textSecondary" variant="caption">
                        Liters
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textPrimary" variant="h4">
                      <i variant="caption" className="fas fa-rupee-sign"></i>{' '}
                      {props.order.price}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textPrimary" variant="h4">
                      {props.order.paymentType === 1 ? 'Cash' : 'Credit'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container justify="center" spacing={8}>
                  <Grid item>
                    <Chip color="secondary" label="In-Progress" size="small" />
                  </Grid>
                  <Grid item alignItems="center">
                    <Typography color="textSecondary" variant="caption">
                      OTP : ####
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </div>
      )}
      {props.userdata && props.userdata.isDriver && (
        <div>
          <CardContent>
            {' '}
            <Grid container justify="space-between" spacing={1}>
              <Grid item>
                <Typography color="textSecondary" variant="h3">
                  Current Order
                </Typography>
                <Typography color="textSecondary" variant="caption">
                  {props.order.orderID}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container justify="center" spacing={6}>
                  <Grid item>
                    <Typography color="textPrimary" variant="h4">
                      {props.order.quantity}{' '}
                      <Typography color="textSecondary" variant="caption">
                        Liters
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textPrimary" variant="h4">
                      <i variant="caption" className="fas fa-rupee-sign"></i>{' '}
                      {props.order.price}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textPrimary" variant="h4">
                      {props.order.paymentType === 1 ? 'Cash' : 'Credit'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container justify="start" spacing={8}>
                <Grid item alignItems="center">
                  <Typography color="textSecondary" variant="caption">
                    {props.order.address}Address
                  </Typography>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container justify="center" spacing={8}>
                  <Grid item>
                    <Chip color="secondary" label="In-Progress" size="small" />
                  </Grid>
                  <Grid item alignItems="center">
                    <Typography color="textSecondary" variant="caption">
                      OTP : ####
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </div>
      )}
    </Card>
  );
};

TotalCustomers.propTypes = {
  className: PropTypes.string
};

export default TotalCustomers;
