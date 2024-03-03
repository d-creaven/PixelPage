import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig';

const ReviewItem = ({ review }) => {

  const handleLikePress = () => console.log('Like pressed for review:', review.id);
  const handleCommentPress = () => console.log('Comment pressed for review:', review.id);

  // Renders rating stars
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= review.rating ? "star" : "star-outline"}
          size={20}
          color={i <= review.rating ? "#ffd700" : "#e3e3e3"}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={styles.reviewCard}>
      <View style={styles.topBar}>
        <Image source={{ uri: review.profileImage }} style={styles.profileImage} />
        <Text style={styles.username}>{review.username}</Text>
      </View>
      <View style={styles.bookInfoContainer}>
        <Image source={{ uri: review.cover }} style={styles.bookCover} />
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle}>{review.title}</Text>
          <Text style={styles.bookAuthor}>{review.author}</Text>
        </View>
      </View>
      {renderStars()}
      <Text style={styles.reviewText}>{review.reviewText}</Text>
      <View style={styles.interactionContainer}>
        <TouchableOpacity onPress={handleLikePress}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text>{review.likes}</Text>
        <TouchableOpacity onPress={handleCommentPress}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text>{review.comments.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  bookInfoContainer: {
    flexDirection: 'row',
  },
  bookCover: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
  },
  titleContainer: {
    marginLeft: 10,
    justifyContent: 'space-evenly',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: 'grey',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  reviewText: {
    fontSize: 14,
    marginTop: 5,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default ReviewItem;
