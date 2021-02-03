import React, { useState, useEffect } from 'react';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import Loading from '../../../state/Loading';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  tab: {
    backgroundColor: theme.palette.background.paper,
    width: '100%'
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(92);
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [allOrderHistory, setAllOrderHistory] = useState([]);
  let currentOrderRef;
  let currentPriceRef;
  let allOrderRef;
  let orderHistoryRef;
  let allOrderHistoryRef;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let today = new Date().toISOString().slice(0, 10);

  function TabPanel(props) {
    const { children, value, index } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  {
    currentUser &&
      currentUser.uid &&
      (currentOrderRef = db
        .collection('orders')
        .where('userID', '==', currentUser.uid)
        .where('orderStatus', '==', 1));

    currentPriceRef = db
      .collection('priceForTheDay')
      .doc('e8kgvrn1XGzqM4JYAG3X');

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

    /*   useEffect(() => {
      const fetchData = async () => {
        const doc = await currentPriceRef.get();

        doc.data() && setPrice(doc.data().price);
      };
      fetchData();
    }, []); */

    useEffect(() => {
      return currentPriceRef.onSnapshot(function (doc) {
        if (doc) {
          doc.data() && setPrice(doc.data().price);
        }
      });
    }, []);

    currentUser &&
      (orderHistoryRef = db
        .collection('orders')
        .where('userID', '==', currentUser.uid));

    useEffect(() => {
      const fetchData = async () => {
        const data = await orderHistoryRef.get();

        let initialOrders = [];
        data.forEach(function (doc) {
          if (doc.data().orderStatus !== 1) {
            initialOrders.push(doc.data());
          }
        });

        setOrderHistory(initialOrders);
      };
      fetchData();
    }, []);

    useEffect(() => {
      return orderHistoryRef.onSnapshot(function (data) {
        let updatedOrders = [];
        if (data) {
          data.forEach(function (doc) {
            if (doc.data().orderStatus !== 1) {
              updatedOrders.push(doc.data());
            }
          });
        }
        setOrderHistory(updatedOrders);
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

  currentUser &&
    currentUser.uid &&
    (allOrderHistoryRef = db.collection('orders'));

  useEffect(() => {
    const fetchData = async () => {
      const data = await allOrderHistoryRef.get();
      let initialOrders = [];

      data.forEach(function (doc) {
        initialOrders.push(doc.data());
      });

      setAllOrderHistory(initialOrders);
    };
    fetchData();
  }, []);

  useEffect(() => {
    return allOrderHistoryRef.onSnapshot(function (data) {
      let updatedOrders = [];
      if (data) {
        data.forEach(function (doc) {
          updatedOrders.push(doc.data());
        });
      }
      setAllOrderHistory(updatedOrders);
    });
  }, []);

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

  const showOrderHistory = (order) => {
    return (
      <Grid item lg={12} md={12} xl={9} xs={12}>
        <LatestOrders order={order} userdata={userData} />
      </Grid>
    );
  };

  return (
    <Page className={classes.root} title="Dashboard">
      {loading && <Loading />}
      <Container maxWidth={false}>
        {userData && userData.isCustomer && (
          <div>
            <Typography color="textPrimary" variant="h2">
              Welcome {currentUser && currentUser.displayName}
            </Typography>

            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <Budget price={price} userData={userData} />
              </Grid>
              {orders.map((order) => {
                return showCurrentOrder(order);
              })}

              {orderHistory && orderHistory.length > 0 && (
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  {/* <LatestOrders orders={orderHistory} userdata={userData} /> */}
                  <div className={classes.tab}>
                    <AppBar position="static">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="orderCreditHistoryTab"
                      >
                        <Tab label="Order History" />
                        <Tab label="Credit History" />
                      </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                      {orderHistory && orderHistory.length > 0 && (
                        <Grid item lg={12} md={12} xl={9} xs={12}>
                          <LatestOrders
                            orders={orderHistory}
                            userdata={userData}
                          />
                        </Grid>
                      )}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      Item Two
                    </TabPanel>
                  </div>
                </Grid>
              )}
              {/*  {orderHistory.map((order) => {
                return showOrderHistory(order);
              })} */}
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
              {allOrders.map((order) => {
                return showCurrentOrder(order);
              })}

              {allOrderHistory && allOrderHistory.length > 0 && (
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <LatestOrders orders={allOrderHistory} userdata={userData} />
                </Grid>
              )}

              {console.log(allOrderHistory)}

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
            </Grid>
          </div>
        )}
        {userData && userData.isOwner !== undefined && (
          <div>
            <Typography color="textPrimary" variant="h2">
              Welcome {currentUser && currentUser.displayName}
            </Typography>
            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <Budget price={price} />
              </Grid>
              {/* {allOrders.map((order) => {
                return showCurrentOrder(order);
              })} */}

              {allOrderHistory && allOrderHistory.length > 0 && (
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <LatestOrders orders={allOrderHistory} userdata={userData} />
                </Grid>
              )}

              {console.log(allOrderHistory)}

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
            </Grid>
          </div>
        )}
      </Container>
    </Page>
  );
};

export default Dashboard;
