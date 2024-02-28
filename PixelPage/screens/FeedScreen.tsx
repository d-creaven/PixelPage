import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../FirebaseConfig'; // Adjust the import path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

const FeedScreen = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsRef = collection(db, 'reviews'); // Adjust 'reviews' to your actual collection name
      const q = query(reviewsRef); // Add your query conditions if needed
      const querySnapshot = await getDocs(q);
      const fetchedReviews = [];
      querySnapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() });
      });
      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.bookTitle}>{item.bookTitle}</Text>
      <Text style={styles.reviewText}>{item.reviewText}</Text>
      <Text style={styles.rating}>Rating: {item.rating}</Text>
      {/* Add more details like likes, comments, etc. */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    marginTop: 5,
  },
  // Add styles for other elements as needed
});

export default FeedScreen;
