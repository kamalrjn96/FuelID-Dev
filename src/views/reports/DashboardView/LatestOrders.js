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
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
          color="primary"
          label={
            params.value === 1
              ? 'In-Progress'
              : params.value === 2
              ? 'Delivered'
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
      renderCell: () => (
        <MoreVertIcon
          color="primary"
          size="small"
          onMouseOver={(e) => changeOnHover(e)}
        />
      )
    }
  ];

  return (
    <Card className={clsx(classes.root)}>
      {orders && orders.length !== 0 && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={orders} columns={columns} pageSize={10} />
        </div>
      )}
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
