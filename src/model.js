import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { db } from './firebase';

const Model = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  let currentOrderRef;

  {
    currentUser &&
      currentUser.uid &&
      (currentOrderRef = db
        .collection('orders')
        .where('userID', '==', currentUser.uid)
        .where('orderStatus', '==', 1));

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
  }
  return orders;
};
export default Model;
