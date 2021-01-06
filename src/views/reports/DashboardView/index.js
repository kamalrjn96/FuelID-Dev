import React, { useState, useEffect } from 'react';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [price, setPrice] = useState(92);
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  let currentOrderRef;
  let allOrderRef;

  {
    currentUser &&
      currentUser.uid &&
      (currentOrderRef = db
        .collection('orders')
        .where('userID', '==', currentUser.uid)
        .where('orderStatus', '==', 1));

    useEffect(() => {
      const fetchData = async () => {
        const data = await currentOrderRef.get();

        let initialOrders = [];
        data.forEach(function (doc) {
          initialOrders.push(doc.data());
        });

        setOrders(initialOrders);
      };
      fetchData();
    }, []);

    useEffect(() => {
      return currentOrderRef.onSnapshot(function (data) {
        let updatedOrders = [];
        if (data) {
          data.forEach(function (doc) {
            updatedOrders.push(doc.data());
          });
        }
        setOrders(updatedOrders);
      });
    }, []);

    allOrderRef = db.collection('orders').where('orderStatus', '==', 1);

    useEffect(() => {
      const fetchData = async () => {
        const data = await allOrderRef.get();
        let initialOrders = [];

        data.forEach(function (doc) {
          initialOrders.push(doc.data());
        });

        setAllOrders(initialOrders);
      };
      fetchData();
    }, []);

    useEffect(() => {
      return allOrderRef.onSnapshot(function (data) {
        let updatedOrders = [];
        if (data) {
          data.forEach(function (doc) {
            updatedOrders.push(doc.data());
          });
        }
        setAllOrders(updatedOrders);
      });
    }, []);
  }

  const [userData, setUserData] = useState();

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
  }, [currentUser]);

  const showCurrentOrder = (order) => {
    return (
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <TotalCustomers order={order} userdata={userData} />
      </Grid>
    );
  };

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        {console.log(
          userData,
          userData && userData.isCustomer,
          userData && userData.isDriver
        )}
        {userData && userData.isCustomer && (
          <div>
            <Typography color="textPrimary" variant="h2">
              Welcome {currentUser && currentUser.displayName}
            </Typography>
            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <Budget price={price} />
              </Grid>
              {orders.map((order) => {
                return showCurrentOrder(order);
              })}
              {console.log(orders)}
              {/*  <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts />
          </Grid> */}
              {/* <Grid item lg={12} md={12} xl={9} xs={12}>
                <LatestOrders />
              </Grid> */}
            </Grid>
          </div>
        )}
        {userData && userData.isDriver !== undefined && (
          <div>
            <Typography color="textPrimary" variant="h2">
              Welcome {currentUser && currentUser.displayName}
            </Typography>
            <Grid container spacing={3}>
              {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
                <Budget price={price} />
              </Grid> */}

              {allOrders.map((order) => {
                return showCurrentOrder(order);
              })}
              {/*  <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts />
          </Grid> */}
              {/* <Grid item lg={12} md={12} xl={9} xs={12}>
                <LatestOrders />
              </Grid>*/}
            </Grid>
          </div>
        )}
      </Container>
    </Page>
  );
};

export default Dashboard;
