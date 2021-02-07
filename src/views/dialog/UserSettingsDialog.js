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
  const [price, setPrice] = useState(92);
  const { currentUser } = useAuth();

  let currentPriceRef;

  currentPriceRef = db.collection('priceForTheDay').doc('e8kgvrn1XGzqM4JYAG3X');

  useEffect(() => {
    return currentPriceRef.onSnapshot(function (doc) {
      if (doc) {
        doc.data() && setPrice(doc.data().price);
      }
    });
  }, []);

  var userRef;
  if (currentUser) {
    userRef = db.collection('users').doc(currentUser.uid);
  }

  const [userData, setUserData] = useState();

  /* useEffect(() => {
    const fetchData = async () => {
      const data = await userRef.get();

      setUserData(data.data());
      data.data() &&
        data.data().address &&
        setInputFields(
          data.data().address.map((address) => {
            return { id: address.id, tag: address.tag, value: address.value };
          })
        );
      console.log(userData);
    };
    fetchData();
  }, []); */

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [minQuantity, setMinQuantity] = useState(0);
  const [lastName, setlastName] = useState(
    currentUser.displayName.split(' ')[1]
  );

  const [mobileNumber, setmobileNumber] = useState();

  async function handleSubmit(e) {
    e.preventDefault();

    if (minQuantity === 0) {
      return setError('Minimum Quantity Cannot be 0');
    }

    if (mobileNumber && typeof mobileNumber !== 'undefined') {
      let pattern = new RegExp(/^[0-9\b]+$/);
      if (!pattern.test(mobileNumber)) {
        return setError('Please enter only number');
      } else if (mobileNumber.length !== 10) {
        return setError('Please enter valid phone number');
      }
    }

    try {
      setError('');
      setLoading(true);

      // Updates the user attributes:

      currentUser
        .updateProfile({
          displayName: ` ${lastName}`
        })
        .then(
          function () {
            console.log('Name Updated');
          },
          function (error) {
            setError(error);
          }
        );

      let newUserData = {
        ...userData,
        mobileNumber: mobileNumber ? mobileNumber : userData.mobileNumber
      };
      console.log(newUserData);
      return db
        .collection('users')
        .doc(currentUser.uid)
        .set(newUserData)
        .then(() => props.closeOrder());
    } catch (err) {
      console.log(err);
      setError('Failed to Update account');
    }

    setLoading(false);
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
            {error && <Alert severity="error">{error}</Alert>}
            <form className={classes.root} noValidate>
              <TextField
                fullWidth
                label="Fuel Price"
                margin="normal"
                name="fuelPrice"
                variant="outlined"
                required
                defaultValue={price}
                onChange={(e) => setlastName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Starting Stock"
                margin="normal"
                name="startingStock"
                variant="outlined"
                required
                defaultValue={2000}
                onChange={(e) => setlastName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Minimum Quantity"
                margin="normal"
                name="minQuantity"
                variant="outlined"
                required
                type="number"
                onChange={(e) => setMinQuantity(e.target.value)}
              />

              <div>
                <TextField
                  fullWidth
                  label="Vehicle number"
                  margin="normal"
                  name="vehicleNumber"
                  variant="outlined"
                  required
                  onChange={(e) => setmobileNumber(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Driver name"
                  margin="normal"
                  name="driverName"
                  variant="outlined"
                  required
                  onChange={(e) => setmobileNumber(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Advanced booking limit(days)"
                  margin="normal"
                  name="maxFutureDay"
                  variant="outlined"
                  required
                  onChange={(e) => setmobileNumber(e.target.value)}
                />
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
