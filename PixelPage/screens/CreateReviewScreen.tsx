import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

const CreateReviewScreen = ({ route, navigation }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const { book } = route.params;

  const handleReviewSubmit = () => {
    // Logic to submit the review to your database
    console.log('Review Text:', reviewText);
    console.log('Rating:', rating);
    // Navigate back to the book details or elsewhere as needed
    navigation.goBack();
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
      {/* Component to set rating, e.g., a set of touchable stars */}
      {/* ... */}
      <Button title="Submit Review" onPress={handleReviewSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Add other styles as needed
});

export default CreateReviewScreen;
