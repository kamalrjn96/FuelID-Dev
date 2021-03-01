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
  Container,
  Menu,
  MenuItem
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { DataGrid } from '@material-ui/data-grid';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestOrders = (props) => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
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
    const updatedOrders = [];

    updatedOrders.push(
      ...props.orders.map((order) => {
        order['id'] = order.orderID;

        order['quantity'] =
          order.orderStatus !== 1 ? order.deliveredQuantity : order.quantity;
        order['completed'] = order.delivered
          ? order.delivered
          : order.cancelled;

        return order;
      })
    );

    setOrders(updatedOrders);
  }, []);

  function changeOnHover(e) {
    e.target.style.cursor = 'pointer';
  }

  const handleOrderDetails = (params) => {
    console.log(params.row);
  };

  const columns = [
    { field: 'orderID', headerName: 'Order Ref', width: 120 },
    { field: 'customerName', headerName: 'Customer name', width: 160 },
    { field: 'addressValue', headerName: 'Location', width: 180 },
    {
      field: 'created',
      headerName: 'Date Ordered',
      type: 'date',
      width: 160,
      renderCell: (params) => moment(params.value).format('DD/MM/YYYY HH:mm')
    },
    {
      field: 'completed',
      headerName: 'Date Completed',
      type: 'date',
      width: 160,
      renderCell: (params) =>
        params.value ? moment(params.value).format('DD/MM/YYYY HH:mm') : ''
    },

    {
      field: 'paymentType',
      headerName: 'Payment Method',
      renderCell: (params) => (params.value === 1 ? 'Cash' : 'Credit'),
      width: 180
    },
    {
      field: 'quantity',
      headerName: 'Quantity(Ltrs)',

      width: 150
    },
    {
      field: 'price',
      headerName: 'Amount(Rs)',

      width: 140
    },
    {
      field: 'orderStatus',
      headerName: 'Status',

      width: 100,
      renderCell: (params) => (
        <Chip
          style={
            params.value === 1
              ? {
                  backgroundColor: 'orange',
                  color: 'white'
                }
              : params.value === 2
              ? {
                  backgroundColor: 'green',
                  color: 'white'
                }
              : {
                  backgroundColor: 'red',
                  color: 'white'
                }
          }
          label={
            params.value === 1
              ? 'Pending'
              : params.value === 2
              ? 'Fulfilled'
              : 'Cancelled'
          }
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
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
      {orders && orders.length !== 0 && (
        <Container style={{ height: 400, width: '100%' }}>
          <DataGrid rows={orders} columns={columns} pageSize={10} />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>View Order details</MenuItem>
            {row.orderStatus === 2 && (
              <MenuItem onClick={() => console.log(row)}>View Invoice</MenuItem>
            )}
            {row.orderStatus === 2 && (
              <MenuItem onClick={handleClose}>Download Invoice</MenuItem>
            )}
          </Menu>
        </Container>
      )}
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
