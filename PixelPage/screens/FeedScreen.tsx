import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { auth, db } from '../FirebaseConfig';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import ReviewItem from '../components/ReviewItem';

const FeedScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Define fetchReviews function outside of useEffect
  const fetchReviews = async () => {
    const userRef = collection(db, 'users');
    const userDoc = await doc(userRef, auth.currentUser.uid);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();

    const following = userData?.following || [];
    following.push(auth.currentUser.uid);

    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef,
      where('userId', 'in', following),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = [];
      snapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() });
      });
      setReviews(fetchedReviews);
      setRefreshing(false); // Stop refreshing after data is fetched
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchReviews();
  }, []); // Call fetchReviews when the component mounts

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReviews(); // Call fetchReviews when refreshing
  }, []);

  const renderItem = ({ item }) => (
    <ReviewItem review={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

export default FeedScreen;
