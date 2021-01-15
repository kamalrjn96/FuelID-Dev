import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  colors,
  makeStyles,
  Chip,
  Button,
  TextField
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import { db } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';
import CancelIcon from '@material-ui/icons/Cancel';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    minWidth: 275
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
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}));

const TotalCustomers = (props) => {
  const classes = useStyles();
  const [btnToggle, setBtnToggle] = useState(false);
  const [otp, setOTP] = useState();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const { currentUser } = useAuth();

  function handleCompleteOrder(orderOTP, orderID) {
    console.log(otp, orderOTP);
    if (otp == orderOTP) {
      console.log('Success');
      setOpenSuccess(true);

      console.log(db.collection('orders').doc(orderID));

      db.collection('orders')
        .doc(orderID)
        .update({
          orderStatus: 2,
          delivered: Date.now()
        })
        .then(function () {
          console.log('Document successfully written!');
        })
        .catch(function (error) {
          console.error('Error writing document: ', error);
        });
    } else {
      setOpenFailed(true);
      setBtnToggle(!btnToggle);
      console.log('failed');
    }
  }

  useEffect(() => {
    setTimeout(function () {
      setOpenSuccess(false);
    }, 2000); //2 Second delay
  }, [openSuccess]);

  useEffect(() => {
    setTimeout(function () {
      setOpenFailed(false);
    }, 2000); //2 Second delay
  }, [openFailed]);

  function handleCancelOrder(e, orderID) {
    e.preventDefault();

    db.collection('orders')
      .doc(orderID)
      .update({
        orderStatus: 3,
        cancelled: Date.now()
      })
      .then(function () {
        console.log('Document successfully written!');
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }

  return (
    <Card className={clsx(classes.root)}>
      {props.userdata && props.userdata.isCustomer && (
        <div>
          <CardContent>
            {' '}
            <Grid container justify="space-between" spacing={1}>
              <Grid container justify="space-between" spacing={6}>
                <Grid item>
                  <Typography color="textSecondary" variant="h3">
                    Current Order
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    {props.order.orderID}
                  </Typography>
                </Grid>
                <Grid item>
                  <CancelIcon
                    onClick={(e) => handleCancelOrder(e, props.order.orderID)}
                  />
                </Grid>
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
                      {`OTP : ${props.order.OTP}`}
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
          <Dialog
            open={openSuccess}
            /*  onClose={this.handleClose} */
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick
          >
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              <strong>Order Completed!!</strong>
            </Alert>
          </Dialog>
          <Dialog
            open={openFailed}
            /*  onClose={this.handleClose} */
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick
          >
            <Alert severity="error">
              <AlertTitle>Failed</AlertTitle>
              <strong>Incorrect OTP!!</strong>
            </Alert>
          </Dialog>
          <CardContent>
            <Grid container justify="space-between" spacing={6}>
              <Grid item>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {props.order.orderID}
                </Typography>
              </Grid>

              <Grid item>
                <Chip color="secondary" label="In-Progress" size="small" />
              </Grid>
              <Grid item>
                <CancelIcon />
              </Grid>
            </Grid>

            <Typography variant="h5" component="h2">
              {props.order.customerName}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {props.order.mobileNumber}
            </Typography>
            <Typography variant="body2" className={classes.pos} component="p">
              {props.order.addressValue}
            </Typography>
            <Grid container justify="space-between" className={classes.pos}>
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

            {!btnToggle && (
              <Grid container justify="space-between">
                <Grid item>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => setBtnToggle(!btnToggle)}
                  >
                    Enter OTP
                  </Button>
                </Grid>
              </Grid>
            )}
            {btnToggle && (
              <Grid container justify="space-between">
                <Grid item>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleCompleteOrder(props.order.OTP, props.order.orderID)
                    }
                  >
                    Complete Order
                  </Button>
                </Grid>
                <Grid item>
                  <TextField
                    name="otp"
                    label="OTP"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setOTP(e.target.value)}

                    /* style={{ width: '25%' }} */
                  />
                </Grid>
              </Grid>
            )}
            <Grid item>
              <Typography color="textSecondary" variant="caption">
                {props.order.remarks}
              </Typography>
            </Grid>
          </CardContent>
          {/* <Grid container justify="space-between" spacing={1}>
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
            </Grid> */}
        </div>
      )}
      {props.userdata && props.userdata.isOwner && (
        <div>
          <CardContent>
            <Grid container justify="space-between" spacing={6}>
              <Grid item>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {props.order.orderID}
                </Typography>
              </Grid>

              <Grid item>
                <Chip color="secondary" label="In-Progress" size="small" />
              </Grid>
            </Grid>

            <Typography variant="h5" component="h2">
              {props.order.customerName}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {props.order.mobileNumber}
            </Typography>
            <Typography variant="body2" className={classes.pos} component="p">
              {props.order.addressValue}
            </Typography>
            <Grid container justify="space-between" className={classes.pos}>
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
            <Grid item>
              <Typography color="textSecondary" variant="caption">
                {props.order.remarks}
              </Typography>
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
