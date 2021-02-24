import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles,
  Menu,
  MenuItem,
  Grid,
  Typography
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { DataGrid } from '@material-ui/data-grid';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const CustomerList = (props) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [row, setRow] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setRow(params.row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log(props.users);
    const updatedUsers = [];

    updatedUsers.push(
      ...props.users.map((user) => {
        return user;
      })
    );

    setUsers(updatedUsers);
  }, []);

  function changeOnHover(e) {
    e.target.style.cursor = 'pointer';
  }

  const columns = [
    { field: 'customerName', headerName: 'Name', width: 160 },
    {
      field: 'mobileNumber',
      headerName: 'Phone/Email',
      width: 160,
      renderCell: (params) => (
        <Grid container direction="column" justify="center" alignItems="center">
          <Typography color="textSecondary" gutterBottom variant="body2">
            {params.row.mobileNumber}
          </Typography>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {params.row.email}
          </Typography>
        </Grid>
      )
    },
    {
      field: 'addressValue',
      headerName: 'Address',
      width: 180,
      renderCell: (params) => params.row.address && params.row.address[0].value
    },
    { field: 'creditLimit', headerName: 'Credit Limit', width: 180 },
    { field: 'totalOrders', headerName: 'Total Orders', width: 180 },
    { field: 'orderValue', headerName: 'Order Value', width: 180 },
    { field: 'created', headerName: 'Customer Since', width: 180 },
    {
      field: 'actions',
      headerName: 'Action',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <MoreHorizIcon
          color="primary"
          size="small"
          onMouseOver={(e) => changeOnHover(e)}
          onClick={(e) => handleClick(e, params)}
        />
      )
    }
  ];

  return (
    <Card className={clsx(classes.root)}>
      {users && users.length !== 0 && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={users} columns={columns} pageSize={10} />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => console.log(row)}>
              Edit User details
            </MenuItem>
          </Menu>
        </div>
      )}
    </Card>
  );
};

CustomerList.propTypes = {
  className: PropTypes.string
};

export default CustomerList;
