import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig';

const CreateReviewScreen = ({ route, navigation }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const { book } = route.params;

  const fetchUserData = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        username: userData.username,
        userProfileImage: userData.profileImageUrl,
      };
    } else {
      console.log('No such user!');
      return {
        username: '',
        userProfileImage: '',
      };
    }
  };

  const handleReviewSubmit = async (bookId, reviewText, rating) => {
    // Assuming 'bookId' is the ID of the book being reviewed,
    // 'reviewText' is the text of the review,
    // and 'rating' is the rating given by the user.
    const user = await fetchUserData();

    const reviewData = {
      image: book.image,
      title: book.title,
      authors: book.authors,
      averageRating: book.averageRating,
      publishedDate: book.publishedDate,
      genres: book.genres,
      pageCount: book.pageCount,
      description: book.description,
      isbn: book.isbn,

      bookId,
      reviewText,
      rating,
      userId: auth.currentUser.uid, // Assuming you have access to the auth object
      timestamp: new Date(), // Adds a timestamp to the review
      likes: 0, // Initializes likes count for the review
      likedByUser: [],
      comments: [], // Initializes an array to hold comments on the review
      author: book.authors,
      cover: book.image,
      username: user.username,
      profileImage: user.userProfileImage,
    };
  
    try {
      // Reference to the reviews collection in Firestore
      const reviewsRef = collection(db, 'reviews');
      // Adding the new review to the Firestore collection
      await addDoc(reviewsRef, reviewData);
      console.log('Review submitted successfully!');
      navigation.navigate('Feed', { refresh: true });
    } catch (error) {
      console.error('Error submitting review: ', error);
    }
  };
  

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={40}
            color={i <= rating ? "#ffd700" : "#e3e3e3"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Review for {book.title}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setReviewText}
        value={reviewText}
        placeholder="Type your review here..."
        multiline
      />
      <View style={styles.starsContainer}>{renderStars()}</View>
      <TouchableOpacity style={styles.submitButton} onPress={() => handleReviewSubmit(book.isbn, reviewText, rating)}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#47AA71',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add other styles as needed
});

export default CreateReviewScreen;
