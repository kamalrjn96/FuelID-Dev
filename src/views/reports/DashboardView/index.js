import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  AppBar,
  Toolbar,
  Paper
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import CustomerList from './CustomerList';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import Loading from '../../../state/Loading';
import Snackbar from '@material-ui/core/Snackbar';
import HomeIcon from '@material-ui/icons/Home';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(0.5)
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
  const [minQuantity, setMinQuantity] = useState(0);
  const [startingStock, setStartingStock] = useState(0);
  const [maxFutureDay, setMaxFutureDay] = useState(0);
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [allOrderHistory, setAllOrderHistory] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  let currentOrderRef;
  let currentPriceRef;
  let allOrderRef;
  let orderHistoryRef;
  let allOrderHistoryRef;

  const [value, setValue] = useState(0);
  const [orderPageValue, setOrderPageValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOrderPageChange = (event, newValue) => {
    setOrderPageValue(newValue);
  };

  let today = new Date().toISOString().slice(0, 10);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

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

    useEffect(() => {
      return db.collection('users').onSnapshot(function (data) {
        let userDataList = [];
        if (data) {
          data.forEach(function (doc) {
            console.log(doc);
            userDataList.push({
              ...doc.data(),
              id: doc.Df.key.path.segments[6]
            });
          });
        }
        setAllUsers(userDataList);
      });
    }, []);

    useEffect(() => {
      return currentPriceRef.onSnapshot(function (doc) {
        if (doc) {
          doc.data() && setPrice(doc.data().price);
          doc.data() && setMinQuantity(doc.data().minQuantity);
          doc.data() && setStartingStock(doc.data().startingStock);
          doc.data() && setMaxFutureDay(doc.data().maxFutureDay);
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
        .onSnapshot(function (doc) {
          if (doc) {
            setUserData(doc.data());
          }
        });
    } catch (err) {
      console.log(err);
      console.log('Failed to get user data');
    }
  }, [currentUser]);

  const handleOpenNotification = () => {
    setOpenNotification(true);
  };

  const showCurrentOrder = (order) => {
    return (
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <TotalCustomers
          order={order}
          userdata={userData}
          price={price}
          openNotification={handleOpenNotification}
        />
      </Grid>
    );
  };

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });

  const reports = [
    {
      title: 'Orders to be fulfilled',
      value: 15,
      icon: <SystemUpdateAltIcon />
    },
    {
      title: 'Completed Orders Today',
      value: 5,
      icon: <LocalOfferIcon />
    },
    {
      title: 'Cash Sales Today',
      value: '1,35,723',
      icon: <SystemUpdateAltIcon />
    },
    {
      title: 'Credit Sales Today',
      value: '87,273',
      icon: <LocalOfferIcon />
    },
    {
      title: `${month} Orders`,
      value: '1,35,723',
      icon: <InsertDriveFileIcon />
    },
    {
      title: `Opening Stock`,
      value: '10,000 Ltrs',
      icon: <InvertColorsIcon />
    },
    {
      title: `Available Stock`,
      value: '8,773 Ltrs',
      icon: <InvertColorsIcon />
    }
  ];

  return (
    <>
      {userData && userData.isOwner !== undefined && (
        <div>
          <Paper color={'white'} maxWidth={true}>
            <Tabs
              aria-label="ownerNavigationTabs"
              value={value}
              onChange={handleChange}
            >
              <Tab
                label={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: '10px'
                    }}
                  >
                    <HomeIcon p={2} fontSize="small" />{' '}
                    <p style={{ paddingLeft: '10px' }}>Home</p>
                  </div>
                }
              />
              <Tab
                label={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',

                      height: '10px'
                    }}
                  >
                    <ShoppingCartIcon p={2} fontSize="small" />{' '}
                    <p style={{ paddingLeft: '10px' }}>Orders</p>
                  </div>
                }
              />
              <Tab
                label={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',

                      height: '10px'
                    }}
                  >
                    <SupervisedUserCircleIcon p={2} fontSize="small" />{' '}
                    <p style={{ paddingLeft: '10px' }}>Customers</p>
                  </div>
                }
              />
            </Tabs>
          </Paper>
        </div>
      )}
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
                  <Budget
                    price={price}
                    userData={userData}
                    minQuantity={minQuantity}
                    startingStock={startingStock}
                    maxFutureDay={maxFutureDay}
                  />
                </Grid>
                {orders.map((order) => {
                  return showCurrentOrder(order);
                })}

                {orderHistory && orderHistory.length > 0 && (
                  <Grid item lg={12} md={12} xl={9} xs={12}>
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
              </Grid>
            </div>
          )}
          {userData && userData.isDriver && (
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
                    <LatestOrders
                      orders={allOrderHistory}
                      userdata={userData}
                    />
                  </Grid>
                )}
              </Grid>
            </div>
          )}
          {userData && userData.isOwner !== undefined && (
            <div>
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs lg={4}>
                    <TrafficByDevice />
                  </Grid>
                  <Grid item xs>
                    <Grid container spacing={3}>
                      <Grid item lg={4} sm={6} xl={3} xs={12}>
                        <Budget price={price} />
                      </Grid>

                      {reports.map((report) => {
                        return (
                          <Grid item lg={4} sm={6} xl={3} xs={12}>
                            <TotalProfit
                              title={report.title}
                              value={report.value}
                              icon={report.icon}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  {allOrderHistory && allOrderHistory.length > 0 && (
                    <Grid item lg={12} md={12} xl={9} xs={12}>
                      <LatestOrders
                        orders={allOrderHistory}
                        userdata={userData}
                      />
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <div className={classes.tab}>
                    <AppBar position="static">
                      <Tabs
                        value={orderPageValue}
                        onChange={handleOrderPageChange}
                        aria-label="orderPageTab"
                      >
                        <Tab label="All Orders" />
                        <Tab label="Pending Orders" />
                      </Tabs>
                    </AppBar>
                    <TabPanel value={orderPageValue} index={0}>
                      {allOrderHistory && allOrderHistory.length > 0 && (
                        <Grid item lg={12} md={12} xl={9} xs={12}>
                          <LatestOrders
                            orders={allOrderHistory}
                            userdata={userData}
                          />
                        </Grid>
                      )}
                    </TabPanel>
                    <TabPanel value={orderPageValue} index={1}>
                      {allOrders && allOrders.length > 0 ? (
                        <Grid item lg={12} md={12} xl={9} xs={12}>
                          <LatestOrders
                            orders={allOrders}
                            userdata={userData}
                          />
                        </Grid>
                      ) : (
                        `No Pending Orders`
                      )}
                    </TabPanel>
                  </div>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={2}>
                {allUsers && allUsers.length > 0 && (
                  <Grid item lg={12} md={12} xl={9} xs={12}>
                    <CustomerList users={allUsers} />
                  </Grid>
                )}
              </TabPanel>
            </div>
          )}
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={openNotification}
            autoHideDuration={5000}
            onClose={() => setOpenNotification(false)}
            key="TransitionLeft"
          >
            <Alert severity="error">Order Cancelled!</Alert>
          </Snackbar>
        </Container>
      </Page>
    </>
  );
};

export default Dashboard;
