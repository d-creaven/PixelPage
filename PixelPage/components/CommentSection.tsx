import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { auth, db } from '../FirebaseConfig';

const CommentSection = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('reviewId', '==', reviewId));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Asynchronously update comments with usernames
      const updateCommentsWithUsernames = async () => {
        const updatedComments = await Promise.all(fetchedComments.map(async comment => {
          try {
            const userRef = doc(db, 'users', comment.userId);
            const userSnap = await getDoc(userRef);
            return {
              ...comment,
              userName: userSnap.exists() ? userSnap.data().username : 'Anonymous',
            };
          } catch (error) {
            console.error("Error fetching user data:", error);
            return comment; // Return the comment as is if fetching username fails
          }
        }));
  
        setComments(updatedComments);
      };
  
      updateCommentsWithUsernames();
    });
  
    return () => unsubscribe();
  }, [reviewId]);

  const handleCommentSubmit = async () => {
    if (newComment.trim() !== '') {
      await addDoc(collection(db, 'comments'), {
        reviewId,
        text: newComment,
        userId: auth.currentUser.uid, // Assuming you're using Firebase Authentication
        timestamp: new Date(), // Optional: for sorting or displaying when the comment was posted
      });
      setNewComment(''); // Clear input after submission
    }
  };

  return (
    <View style={styles.commentSection}>
        <FlatList
        data={comments}
        renderItem={({ item }) => (
            <Text style={styles.comment}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text>: {item.text}</Text>
            </Text>
        )}
        keyExtractor={item => item.id}
        />
      <TextInput
        style={styles.input}
        onChangeText={setNewComment}
        value={newComment}
        placeholder="Add a comment..."
      />
      <Button title="Post" onPress={handleCommentSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
    commentSection: {
      padding: 10,
    },
    comment: {
      padding: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 10,
    },
    userName: {
      fontWeight: 'bold',
      // You can add other styles here to make the username stand out even more
    },
  });
  
  export default CommentSection;
