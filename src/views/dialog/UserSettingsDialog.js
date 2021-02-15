import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  colors,
  makeStyles,
  Button,
  Chip,
  Container
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';

import Fab from '@material-ui/core/Fab';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',

    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
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
  },

  button: {
    margin: theme.spacing(1)
  }
}));

export default function UserSettingsDialog(props) {
  const classes = useStyles();
  const [price, setPrice] = useState(props.price);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [minQuantity, setMinQuantity] = useState(0);
  const [startingStock, setStartingStock] = useState(0);
  const [maxFutureDay, setMaxFutureDay] = useState(0);

  let currentPriceRef;

  currentPriceRef = db.collection('priceForTheDay').doc('e8kgvrn1XGzqM4JYAG3X');

  useEffect(() => {
    return currentPriceRef.onSnapshot(function (doc) {
      if (doc) {
        console.log(doc.data());
        doc.data() && setPrice(doc.data().price);
        doc.data() && setMinQuantity(doc.data().minQuantity);
        doc.data() && setStartingStock(doc.data().startingStock);
        doc.data() && setMaxFutureDay(doc.data().maxFutureDay);
      }
    });
  }, []);

  const closeDrawer = () => {
    return props.closeOrder;
  };
  const handleChange = (name, value) => {
    switch (name) {
      case 'fuelPrice':
        if (isNaN(value)) {
          setError((prevError) => ({
            ...prevError,
            fuelPrice: {
              // object that we want to update

              message: 'Price has to be a valid number' // update the value of specific key
            }
          }));
        }
        if (!isNaN(value) && !Number(value)) {
          setError((prevError) => ({
            ...prevError,
            fuelPrice: {
              // object that we want to update
              message: 'Price cannot be 0' // update the value of specific key
            }
          }));
        }
        if (!isNaN(value) && !!Number(value)) {
          setError((prevError) => ({
            ...prevError,
            fuelPrice: null
          }));
          setPrice(value);
        }
        break;
      case 'startingStock':
        if (isNaN(value)) {
          setError((prevError) => ({
            ...prevError,
            startingStock: {
              // object that we want to update

              message: 'Stock has to be a valid number' // update the value of specific key
            }
          }));
        }
        if (!isNaN(value) && !Number(value)) {
          setError((prevError) => ({
            ...prevError,
            startingStock: {
              // object that we want to update
              message: 'Stock cannot be 0' // update the value of specific key
            }
          }));
        }
        if (!isNaN(value) && !!Number(value)) {
          setError((prevError) => ({
            ...prevError,
            startingStock: null
          }));
          setStartingStock(value);
        }
        break;
      case 'minQuantity':
        if (isNaN(value)) {
          setError((prevError) => ({
            ...prevError,
            minQuantity: {
              // object that we want to update

              message: 'Quantity has to be a valid number' // update the value of specific key
            }
          }));
        }
        if (!isNaN(value) && !Number(value)) {
          setError((prevError) => ({
            ...prevError,
            minQuantity: {
              // object that we want to update
              message: 'Minimum Quantity cannot be 0' // update the value of specific key
            }
          }));
        }
        if (!isNaN(value) && !!Number(value)) {
          setError((prevError) => ({
            ...prevError,
            minQuantity: null
          }));
          setMinQuantity(value);
        }
        break;
      case 'maxFutureDay':
        if (isNaN(value)) {
          setError((prevError) => ({
            ...prevError,
            maxFutureDay: {
              // object that we want to update

              message: 'PLease provide valid number' // update the value of specific key
            }
          }));
        }

        if (!isNaN(value) && !!Number(value)) {
          setError((prevError) => ({
            ...prevError,
            maxFutureDay: null
          }));
          setMaxFutureDay(value);
        }
        break;
      default:
        break;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      db.collection('priceForTheDay')
        .doc('e8kgvrn1XGzqM4JYAG3X')
        .update({
          price: parseInt(price),
          lastUpdated: Date.now(),
          minQuantity: minQuantity,
          maxFutureDay: maxFutureDay,
          startingStock: startingStock
        })
        .then(function () {
          console.log('Document successfully written!');
        });
    } catch (err) {
      console.log(err);
      console.log('Failed to get user data');
    }

    setLoading(false);
    props.closeOrder();
  }
  return (
    <div>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <Container maxWidth="sm">
            <Box mb={3}>
              <Typography color="textPrimary" variant="h2">
                Update settings
              </Typography>
            </Box>
            {/*  {error && <Alert severity="error">{error}</Alert>} */}
            <form className={classes.root} noValidate>
              <TextField
                fullWidth
                label="Fuel Price"
                margin="normal"
                name="fuelPrice"
                variant="outlined"
                required
                defaultValue={price}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              {error && error.fuelPrice && (
                <Alert severity="error">{error.fuelPrice.message}</Alert>
              )}
              {startingStock && (
                <TextField
                  fullWidth
                  label="Starting Stock"
                  margin="normal"
                  name="startingStock"
                  variant="outlined"
                  required
                  defaultValue={startingStock}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              )}
              {error && error.startingStock && (
                <Alert severity="error">{error.startingStock.message}</Alert>
              )}
              {minQuantity && (
                <TextField
                  fullWidth
                  label="Minimum Quantity"
                  margin="normal"
                  name="minQuantity"
                  variant="outlined"
                  required
                  type="number"
                  defaultValue={minQuantity}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              )}
              {error && error.minQuantity && (
                <Alert severity="error">{error.minQuantity.message}</Alert>
              )}

              <div>
                <TextField
                  fullWidth
                  label="Vehicle number"
                  margin="normal"
                  name="vehicleNumber"
                  variant="outlined"
                  required
                  disabled
                  /* onChange={(e) => setmobileNumber(e.target.value)} */
                />
                <TextField
                  fullWidth
                  label="Driver name"
                  margin="normal"
                  name="driverName"
                  variant="outlined"
                  required
                  disabled
                  /* onChange={(e) => setmobileNumber(e.target.value)} */
                />
                {maxFutureDay && (
                  <TextField
                    fullWidth
                    label="Advanced booking limit(days)"
                    margin="normal"
                    name="maxFutureDay"
                    variant="outlined"
                    required
                    defaultValue={maxFutureDay}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                )}
                {error && error.maxFutureDay && (
                  <Alert severity="error">{error.maxFutureDay.message}</Alert>
                )}
              </div>
            </form>
          </Container>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleSubmit} color="primary">
          Update Settings
        </Button>

        <Button onClick={props.closeOrder} color="primary">
          Close
        </Button>
      </DialogActions>
    </div>
  );
}
