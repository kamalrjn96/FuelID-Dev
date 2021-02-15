import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  colors,
  makeStyles,
  Button,
  Chip
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function OrderDialog(props) {
  const classes = useStyles();

  const [quant, setQuant] = useState(0);
  const [paymentType, setPaymentType] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [newTag, setnewTag] = useState();
  const [newAddress, setnewAddress] = useState();
  const [selectedDate, setSelectedDate] = useState(
    new Date('2014-08-18T21:11:54')
  );

  const { currentUser } = useAuth();

  var userRef;
  if (currentUser) {
    userRef = db.collection('users').doc(currentUser.uid);
  }

  const [userData, setUserData] = useState(props.userData);

  const [userAddress, setUserAddress] = useState(
    userData && userData.address ? userData.address : ''
  );

  const [displayAddress, setDisplayAddress] = useState(
    userData && userData.address ? userData.address[0].value : ''
  );

  const handleChange = (event) => {
    setDisplayAddress(event.target.value);
  };

  const random = Math.floor(1000 + Math.random() * 9000);

  const handlePlaceOrder = () => {
    db.collection('orders')
      .doc(`SG-${random}`)
      .set({
        userID: currentUser.uid,
        orderID: `SG-${random}`,

        quantity: quant,
        price: quant * props.price,

        paymentType: paymentType,
        orderStatus: 1,
        remarks: remarks,
        customerName: currentUser.displayName,
        mobileNumber: userData.mobileNumber,
        created: Date.now(),
        addressValue: displayAddress,
        OTP: Math.floor(1000 + Math.random() * 9000)
      })
      .then(function () {
        console.log('Document successfully written!');
        props.closeOrder();
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  };

  const [openNewAddress, setOpenNewAddress] = useState(false);

  const handleClickOpenNewAddress = () => {
    setOpenNewAddress(true);
  };

  const handleCloseNewAddress = () => {
    setOpenNewAddress(false);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();

    let newAddressArray;

    if (userData.address) {
      newAddressArray = [
        ...userData.address,
        {
          id: uuidv4(),
          tag: newTag,
          value: newAddress
        }
      ];
    } else {
      newAddressArray = [{ id: uuidv4(), tag: newTag, value: newAddress }];
    }

    setUserAddress(newAddressArray);

    setDisplayAddress(newAddressArray[newAddressArray.length - 1].value);
    let newUserData = {
      ...userData,
      address: newAddressArray
    };
    setUserData(newUserData);

    userRef
      .set(newUserData)
      .then(function () {
        console.log('Document successfully written!');
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });

    console.log(newUserData);
    setOpenNewAddress(false);
  };

  return (
    <div>
      <DialogContent>
        <Grid
          container
          direction="column"
          justify="space-around"
          alignItems="center"
          width="100%"
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
              >
                <Box flexDirection="column">
                  <Typography color="textSecondary" variant="h6">
                    {/* {`SG-${random}`} */}
                  </Typography>
                  <Typography color="textPrimary" variant="h2">
                    {currentUser && currentUser.displayName}
                  </Typography>

                  <Typography color="primary" variant="h6">
                    {userData && userData.mobileNumber}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography color="primary" variant="caption">
                {''}
              </Typography>
              <Typography color="textPrimary" variant="h4">
                {displayAddress}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <FormControl className={classes.formControl} width={1}>
                {userData && userData.address && (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={'Kamal'}
                    onChange={handleChange}
                  >
                    {userAddress.map((item) => {
                      return (
                        <MenuItem key={item.tag} value={item.value}>
                          {item.tag}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}

                <FormHelperText>Select Address</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item></Grid>
            <Grid item>
              <Box display="flex" flexDirection="row-reverse">
                <FormControl className={classes.formControl}>
                  <Fab
                    size="small"
                    color="secondary"
                    aria-label="add"
                    onClick={handleClickOpenNewAddress}
                  >
                    <AddIcon />
                  </Fab>
                  <FormHelperText>Add new address</FormHelperText>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <FormControl className={classes.formControl}>
                <TextField
                  autoFocus
                  id="quantitySelect"
                  label="Qty"
                  onChange={(e) => setQuant(e.target.value)}
                  type="number"
                  min={props.minQuantity}
                  defaultValue={props.minQuantity}
                />
                <FormHelperText>Choose Quantity</FormHelperText>
              </FormControl>
            </Grid>
            {/* <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                   onChange={handleDateChange} 
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid> */}
            <Grid item>
              <FormControl className={classes.formControl}>
                <TextField
                  autoFocus
                  id="price"
                  label="Price"
                  type="text"
                  value={quant * props.price}
                  InputProps={{
                    readOnly: true
                  }}
                />

                <FormHelperText>Calculated Price</FormHelperText>
              </FormControl>
            </Grid>
            {/* <Grid item>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  defaultValue={1}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <MenuItem value={1}>Cash</MenuItem>
                  <MenuItem value={2}>Credit</MenuItem>
                </Select>
                <FormHelperText>Choose Payment Option</FormHelperText>
              </FormControl>
            </Grid> */}
          </Grid>
        </Grid>

        <TextField
          autoFocus
          fullWidth
          margin="dense"
          id="remarks"
          label="Remarks"
          type="text"
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Place order for a later date | Provide delivery instructions"
        />
        <br></br>
        <br></br>

        <Typography color="textSecondary" variant="caption">
          *Actual Price will depend on the actual quantity of the fuel
          Delivered.
        </Typography>
        <br></br>
        <Typography color="textSecondary" variant="caption">
          **Fuel price is dependant on the day's pricing
        </Typography>
        <div>
          <Dialog
            disableBackdropClick
            open={openNewAddress}
            onClose={handleCloseNewAddress}
          >
            <DialogTitle>Add New Address</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <TextField
                    fullWidth
                    label="New Tag"
                    margin="normal"
                    name="addressTag"
                    variant="outlined"
                    required
                    onChange={(e) => setnewTag(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="New Address"
                    margin="normal"
                    name="address"
                    variant="outlined"
                    required
                    onChange={(e) => setnewAddress(e.target.value)}
                  />
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNewAddress} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddNewAddress} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePlaceOrder} color="primary" disabled={!quant}>
          Place Order
        </Button>

        <Button onClick={props.closeOrder} color="primary">
          Close
        </Button>
      </DialogActions>
    </div>
  );
}
