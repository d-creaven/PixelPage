import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { db } from '../FirebaseConfig';

const CommentSection = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('reviewId', '==', reviewId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsArray);
    });

    return () => unsubscribe(); // Clean up subscription
  }, [reviewId]);

  const handleCommentSubmit = async () => {
    if (newComment.trim() !== '') {
      await addDoc(collection(db, 'comments'), {
        reviewId,
        text: newComment,
        // Add additional fields like userId, timestamp, etc., as needed
      });
      setNewComment(''); // Clear input after submission
    }
  };

  return (
    <View style={styles.commentSection}>
      <FlatList
        data={comments}
        renderItem={({ item }) => <Text style={styles.comment}>{item.text}</Text>}
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
  });
  
  export default CommentSection;
