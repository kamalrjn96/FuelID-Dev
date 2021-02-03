import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';

const Loading = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState();

  useEffect(() => {
    try {
      db.collection('users')
        .doc(currentUser.uid)
        .get()
        .then(function (doc) {
          if (doc) {
            setUserData(doc.data());
            console.log(doc.data());
            console.log(userData);
            setLoading(false);
          }
        });
    } catch (err) {
      console.log(err);
      console.log('Failed to get user data');
    }
  }, [currentUser]);
  return loading && <div>Loading...</div>;
};

export default Loading;
