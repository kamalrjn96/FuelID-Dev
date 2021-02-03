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

export default function UpdateProfileDialog(props) {
  const classes = useStyles();
  const { currentUser } = useAuth();

  var userRef;
  if (currentUser) {
    userRef = db.collection('users').doc(currentUser.uid);
  }

  const [userData, setUserData] = useState();

  useEffect(() => {
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
  }, []);

  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), tag: '', value: '' }
  ]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstName, setfirstName] = useState(
    currentUser.displayName.split(' ')[0]
  );
  const [lastName, setlastName] = useState(
    currentUser.displayName.split(' ')[1]
  );

  const [mobileNumber, setmobileNumber] = useState();

  const handleChangeInput = (id, event) => {
    console.log(inputFields, id, event);

    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
        console.log(event.target.name, event.target.value);
      }

      return i;
    });

    setInputFields(newInputFields);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), tag: '', value: '' }]);
  };

  const handleRemoveFields = (id) => {
    let values = [...inputFields];
    /* values.pop(); */

    values = values.filter((value) => value.id !== id);
    console.log(
      values,
      values.filter((value) => value.id !== id)
    );

    setInputFields(values);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (firstName === '' || lastName === '') {
      return setError('Name Cannot be empty');
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
          displayName: `${firstName} ${lastName}`
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
        mobileNumber: mobileNumber ? mobileNumber : userData.mobileNumber,
        address: inputFields
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
                Update your profile
              </Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <form className={classes.root} noValidate>
              <TextField
                fullWidth
                label="First Name"
                margin="normal"
                name="firstName"
                variant="outlined"
                required
                defaultValue={firstName}
                onChange={(e) => setfirstName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Last Name"
                margin="normal"
                name="LastName"
                variant="outlined"
                required
                defaultValue={lastName}
                onChange={(e) => setlastName(e.target.value)}
              />
              {userData && (
                <TextField
                  fullWidth
                  label="Mobile number"
                  margin="normal"
                  name="mobileNumber"
                  variant="outlined"
                  required
                  defaultValue={userData.mobileNumber}
                  onChange={(e) => setmobileNumber(e.target.value)}
                />
              )}

              {userData &&
                userData.isCustomer &&
                inputFields &&
                inputFields.length > 0 &&
                inputFields.map(
                  (inputField) => (
                    console.log(inputField),
                    (
                      <div key={inputField.id}>
                        <TextField
                          name="tag"
                          label="Tag"
                          variant="outlined"
                          /* size="small" */
                          style={{ width: '25%' }}
                          defaultValue={inputField ? inputField.tag : ''}
                          onChange={(event) =>
                            handleChangeInput(inputField.id, event)
                          }
                        />
                        <TextField
                          name="value"
                          label="Value"
                          variant="outlined"
                          defaultValue={inputField ? inputField.value : ''}
                          style={{ width: '48%' }}
                          onChange={(event) =>
                            handleChangeInput(inputField.id, event)
                          }
                        />
                        <IconButton
                          disabled={inputFields && inputFields.length === 1}
                          onClick={() => handleRemoveFields(inputField.id)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <IconButton onClick={handleAddFields}>
                          <AddIcon />
                        </IconButton>
                      </div>
                    )
                  )
                )}
            </form>
          </Container>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleSubmit} color="primary">
          Update Profile
        </Button>

        <Button onClick={props.closeOrder} color="primary">
          Close
        </Button>
      </DialogActions>
    </div>
  );
}
