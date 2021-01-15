import React, { useState } from 'react';
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
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const data = [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'refunded'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestOrders = (props) => {
  const classes = useStyles();
  const [orders] = useState(data);

  return (
    <Card className={clsx(classes.root)}>
      {console.log(props)}
      <CardHeader title="Order History" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Ref</TableCell>
                {props.userData && props.userData.isDriver && (
                  <TableCell>Customer name</TableCell>
                )}
                <TableCell>Location</TableCell>
                <TableCell>Date Ordered</TableCell>
                <TableCell>Date Delivered</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.orders.map((order) => (
                <TableRow key={order.orderID}>
                  <TableCell>{order.orderID}</TableCell>
                  {props.userData && props.userData.isDriver && (
                    <TableCell>{order.customerName}</TableCell>
                  )}
                  <TableCell>
                    {order.addressValue ? order.addressValue : 'Address'}
                  </TableCell>
                  <TableCell>
                    {moment(order.created).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(order.delivered).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {order.paymentType === 1 ? 'Cash' : 'Credit'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="primary"
                      label={
                        order.orderStatus === 2 ? 'Delivered' : 'Cancelled'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
