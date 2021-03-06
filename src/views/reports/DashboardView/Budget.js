import React, { useState, useEffect } from 'react';
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
  Button,
  Chip
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import OrderDialog from '../../dialog/OrderDialog';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';

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

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];

const Budget = (props) => {
  const classes = useStyles();
  const { currentUser } = useAuth();

  let today = new Date().toISOString().slice(0, 10).split('-')[2];

  const [userData, setUserData] = useState(props.userData);

  useEffect(() => {
    try {
      db.collection('users')
        .doc(currentUser.uid)
        .get()
        .then(function (doc) {
          if (doc) {
            setUserData(doc.data());
          }
        });
    } catch (err) {
      console.log(err);
      console.log('Failed to get user data');
    }
  }, []);

  const [openOrder, setOpenOrder] = useState(false);

  const [priceModal, setPriceModal] = useState(false);
  const [price, setPrice] = useState(props.price);

  const handleClickOrderOpen = () => {
    setOpenOrder(true);
  };

  const handleCloseOrder = () => {
    setOpenOrder(false);
  };

  const handlePriceModalOpen = () => {
    setPriceModal(true);
  };

  const handleClosePriceModal = () => {
    setPriceModal(false);
  };

  const handleAddNewPrice = (e) => {
    e.preventDefault();

    try {
      db.collection('priceForTheDay')
        .doc('e8kgvrn1XGzqM4JYAG3X')
        .update({ price: parseInt(price), lastUpdated: Date.now() })
        .then(function () {
          console.log('Document successfully written!');
        });
    } catch (err) {
      console.log(err);
      console.log('Failed to get user data');
    }
    handleClosePriceModal();
  };

  return (
    <Card className={clsx(classes.root)}>
      {userData && userData.isCustomer && (
        <div>
          <CardContent>
            <Grid container justify="space-between" spacing={3}>
              <Grid item>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Today's Price
                </Typography>
                <Typography color="textPrimary" variant="h3">
                  {props.price}
                </Typography>
              </Grid>

              <Box
                mt={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                paddingRight={2}
              >
                <Button
                  color="primary"
                  /* disabled={} */
                  fullWidth
                  size="small"
                  type="submit"
                  variant="contained"
                  onClick={handleClickOrderOpen}
                >
                  Order Now
                </Button>
              </Box>
            </Grid>
            <Box mt={2} display="flex" alignItems="center">
              <Typography color="textSecondary" variant="caption">
                <i className="fas fa-rupee-sign"></i> / Litre
              </Typography>
            </Box>
          </CardContent>

          <div>
            {openOrder && (
              <Dialog
                open={openOrder}
                onClose={handleCloseOrder}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth={'sm'}
              >
                <OrderDialog
                  price={props.price}
                  userData={props.userData}
                  minQuantity={props.minQuantity}
                  closeOrder={handleCloseOrder}
                ></OrderDialog>
              </Dialog>
            )}
          </div>
        </div>
      )}

      {userData && userData.isOwner && (
        <div>
          <CardContent>
            {console.log(props)}
            <Grid container justify="space-between" spacing={3}>
              <Grid item>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Selling price today
                </Typography>
                <Typography color="textPrimary" variant="h3">
                  {props.price}
                  {'  '}
                  <Typography color="textSecondary" variant="caption">
                    <i className="fas fa-rupee-sign"></i> / Litre
                  </Typography>
                </Typography>
                <Typography
                  variant="caption"
                  style={
                    new Date(props.lastUpdated)
                      .toISOString()
                      .slice(0, 10)
                      .split('-')[2] !== today
                      ? {
                          color: 'red'
                        }
                      : {
                          color: 'black'
                        }
                  }
                >
                  Last Updated :{' '}
                  {
                    new Date(props.lastUpdated)
                      .toISOString()
                      .slice(0, 10)
                      .split('-')[2]
                  }{' '}
                  {monthNames[new Date(props.lastUpdated).getMonth()]}
                </Typography>
              </Grid>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                paddingRight={2}
              >
                <Button
                  color="primary"
                  /* disabled={} */
                  fullWidth
                  size="small"
                  type="submit"
                  variant="contained"
                  onClick={handlePriceModalOpen}
                >
                  Set Price
                </Button>
              </Box>
            </Grid>
          </CardContent>

          <div>
            {priceModal && (
              <div>
                <Dialog
                  open={priceModal}
                  onClose={handleCloseOrder}
                  aria-labelledby="form-dialog-title"
                  fullWidth={true}
                  maxWidth={'sm'}
                >
                  <DialogTitle>Set Price</DialogTitle>
                  <DialogContent>
                    <form className={classes.container}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          fullWidth
                          label="Price"
                          margin="normal"
                          name="price"
                          variant="outlined"
                          required
                          defaultValue={props.price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </FormControl>
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClosePriceModal} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleAddNewPrice} color="primary">
                      Ok
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
