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
  TextField,
  Button
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import { db } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';
import CancelIcon from '@material-ui/icons/Cancel';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { ChildCareSharp } from '@material-ui/icons';
import { ButtonGroup } from 'react-bootstrap';

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
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const TotalCustomers = (props) => {
  const classes = useStyles();

  const [validationState, setValidationState] = useState(1);
  const [actualQuant, setActualQuant] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [actualAmount, setActualAmount] = useState(0);
  const [otp, setOTP] = useState();
  const [openSuccess, setOpenSuccess] = useState(false);

  const [openFailed, setOpenFailed] = useState(false);
  const [openCancelRemark, setOpenCancelRemark] = useState(false);
  const [cancelRemark, setCancelRemark] = useState('');
  const { currentUser } = useAuth();

  function verifyOTP(orderOTP) {
    if (orderOTP && otp == orderOTP) {
      setValidationState(3);

      setOTP();
    } else {
      setOpenFailed(true);
      setValidationState(1);
      setOTP();
      console.log('OTP verification failed');
    }
  }
  function handleCompleteOrder(actualQuant, deliveryCharge, orderID) {
    let finalPrice;

    actualQuant &&
      deliveryCharge &&
      (finalPrice =
        Number(actualQuant) * Number(props.price) + Number(deliveryCharge));
    db.collection('orders')
      .doc(orderID)
      .update({
        orderStatus: 2,
        delivered: Date.now(),
        price: Number(finalPrice),
        deliveredQuantity: Number(actualQuant),
        deliveryCharge: Number(deliveryCharge)
      })
      .then(function () {
        setOpenSuccess(true);
        console.log('Document successfully written!');
        setValidationState(1);
        setOTP();
      })
      .catch(function (error) {
        setOpenFailed(true);
        console.error('Error writing document: ', error);
        setValidationState(1);
        setOTP();
      });
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

  const handleOpenCancelOrderRemark = () => {
    setOpenCancelRemark(true);
  };

  const handleCloseCancelOrderRemark = () => {
    setOpenCancelRemark(false);
  };

  function changeOnHover(e) {
    e.target.style.cursor = 'pointer';
  }

  function handleCancelOrder(e, orderID, cancelledBy) {
    e.preventDefault();

    db.collection('orders')
      .doc(orderID)
      .update({
        orderStatus: 3,
        cancelled: Date.now(),
        cancelledBy: cancelledBy,
        cancelRemark: cancelRemark
      })
      .then(function () {
        props.openNotification();
        console.log('Document successfully written!');
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });

    handleCloseCancelOrderRemark();
  }

  return (
    <Card className={clsx(classes.root)}>
      {props.userdata && props.userdata.isCustomer && (
        <div>
          <Dialog
            open={openCancelRemark}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={handleCloseCancelOrderRemark}
          >
            <DialogTitle>Add Remarks</DialogTitle>
            <DialogContent>
              <form
                className={classes.container}
                onSubmit={(e) =>
                  handleCancelOrder(e, props.order.orderID, 'Customer')
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
                        handleCancelOrder(e, props.order.orderID, 'Customer')
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
          </Dialog>
          <CardContent>
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
                  {/* <CancelIcon
                    onMouseOver={(e) => changeOnHover(e)}
                    onClick={(e) => handleOpenCancelOrderRemark()}
                  /> */}
                  <Chip
                    color="secondary"
                    onMouseOver={(e) => changeOnHover(e)}
                    label="Cancel"
                    onClick={(e) => handleOpenCancelOrderRemark()}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid item>
                <Grid container justify="center" spacing={4}>
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
            open={openCancelRemark}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={handleCloseCancelOrderRemark}
          >
            <DialogTitle>Add Remarks</DialogTitle>
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
          </Dialog>
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
                <Chip
                  style={{
                    backgroundColor: 'gray',
                    color: 'white'
                  }}
                  onMouseOver={(e) => changeOnHover(e)}
                  label="Cancel"
                  onClick={(e) => handleOpenCancelOrderRemark()}
                  size="small"
                />
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

            {validationState === 1 && (
              <Grid container justify="space-between">
                <Grid item>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => setValidationState(2)}
                    variant="contained"
                  >
                    Enter OTP
                  </Button>
                </Grid>
              </Grid>
            )}
            {validationState === 2 && (
              <Grid
                container="true"
                direction="row"
                justify="space-between"
                spacing={1}
              >
                <Grid item>
                  <TextField
                    name="otp"
                    label="OTP"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setOTP(e.target.value)}
                    style={{ width: '50%' }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => verifyOTP(props.order.OTP)}
                    variant="contained"
                  >
                    Verify OTP
                  </Button>
                </Grid>
              </Grid>
            )}
            {validationState === 3 && (
              <Grid container justify="space-between" spacing={2}>
                <Grid item>
                  <TextField
                    name="actualQuantity"
                    label="Quantity"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setActualQuant(e.target.value)}

                    /* style={{ width: '25%' }} */
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="deliveryCharge"
                    label="DeliveryCharge"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setDeliveryCharge(e.target.value)}
                    notched="true"
                  />
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleCompleteOrder(
                        actualQuant,
                        deliveryCharge,
                        props.order.orderID
                      )
                    }
                    variant="contained"
                  >
                    Complete Order
                  </Button>
                </Grid>
              </Grid>
            )}
            <br></br>
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
