import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig';
import CommentSection from './CommentSection';
import { useNavigation } from '@react-navigation/native';


const ReviewItem = ({ review }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const navigation = useNavigation();


  useEffect(() => {
    // Corrected path to fetch comments from the 'comments' collection
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('reviewId', '==', review.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setCommentCount(querySnapshot.size); // Update comment count in real-time
    });

    return () => unsubscribe(); // Clean up the listener
  }, [review.id]);

  useEffect(() => {
    const checkIfLiked = async () => {
      const likesRef = collection(db, 'userLikes'); 
      const q = query(likesRef, where('userId', '==', auth.currentUser.uid), where('reviewId', '==', review.id));
  
      const querySnapshot = await getDocs(q);
      setIsLiked(!querySnapshot.empty);
    };
  
    checkIfLiked();
  }, [review.id]);

  const handleLikePress = async () => {
    const likesRef = collection(db, 'userLikes'); // collection for tracking likes
    const q = query(likesRef, where('userId', '==', auth.currentUser.uid), where('reviewId', '==', review.id));
  
    const querySnapshot = await getDocs(q);
    const reviewRef = doc(db, 'reviews', review.id); // Reference to the review document
  
    if (querySnapshot.empty) {
      // Like the review: Add a document to 'userLikes' collection
      await addDoc(likesRef, { userId: auth.currentUser.uid, reviewId: review.id });
      setIsLiked(true);
  
      // Increment the like count on the review document
      await updateDoc(reviewRef, { likes: increment(1) });
    } else {
      // Unlike the review: Remove the document from 'userLikes' collection
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });
      setIsLiked(false);
  
      // Decrement the like count on the review document
      await updateDoc(reviewRef, { likes: increment(-1) });
    }
  };
  
  const handleCommentPress = () => {
    setShowComments(!showComments);
  };

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

  const navigateToBookDetails = () => {
    navigation.navigate('BookDetails', { book: review });
  };

  return (
    <View style={styles.reviewCard}>
      <View style={styles.topBar}>
        <Image source={{ uri: review.profileImage }} style={styles.profileImage} />
        <Text style={styles.username}>{review.username}</Text>
      </View>
      <View style={styles.bookInfoContainer}>
        <Image source={{ uri: review.cover }} style={styles.bookCover} />
        <TouchableOpacity onPress={navigateToBookDetails} style={styles.titleContainer}>
          {/* Adjust Text components to allow wrapping */}
          <Text style={styles.bookTitle}>{review.title}</Text>
          <Text style={styles.bookAuthor}>{review.author}</Text>
        </TouchableOpacity>
      </View>
      {renderStars()}
      <Text style={styles.reviewText}>{review.reviewText}</Text>
      <View style={styles.interactionContainer}>
        {/* Interaction icons and counts */}
      </View>
      {showComments && <CommentSection reviewId={review.id} />}
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
    alignItems: 'center',
    marginTop: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Adjust spacing between the like container and the next element if needed
  },
  likeCount: {
    marginLeft: 5, // Adjust the space between the heart icon and the like count text
  },
  titleContainer: {
    marginLeft: 10,
    flex: 1, // Add flex: 1 to ensure it takes up only the available space
  },
});

export default ReviewItem;
