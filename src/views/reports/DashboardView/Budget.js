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

const Budget = (props) => {
  const classes = useStyles();

  const [openOrder, setOpenOrder] = useState(false);

  const handleClickOrderOpen = () => {
    setOpenOrder(true);
  };

  const handleCloseOrder = () => {
    setOpenOrder(false);
  };

  return (
    <Card className={clsx(classes.root)}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h3">
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
              closeOrder={handleCloseOrder}
            ></OrderDialog>
          </Dialog>
        )}
      </div>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
