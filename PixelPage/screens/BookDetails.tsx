import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Button, Pressable } from 'react-native';
import { useMyBooks } from '../context/MyBooksProvider';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Picker } from '@react-native-picker/picker';

const BookDetailsScreen = ({ route }) => {
  // Assuming you're passing a `book` object in your navigation route params
  const { book } = route.params;

  const {isBookSaved, onToggleSaved} = useMyBooks();

  const saved = isBookSaved(book);

  const navigation = useNavigation();

  const [descriptionExpanded, setDescriptionExpanded] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');

  const handleReviewPress = () => {
    // Navigation to the CreateReview screen
    // Assuming 'CreateReview' is the name of your screen where users write reviews
    navigation.navigate('Create Review', { book });
  };

  const handleSaveBook = () => {
    if (saved) {
      // If the book is already saved, unsave it
      onToggleSaved(book, selectedCategory); // Assuming onToggleSaved can also handle unsaving
    } else {
      // Only save if a category has been selected
      if (selectedCategory) {
        onToggleSaved(book, selectedCategory);
      } else {
        alert("Please select a category before saving.");
      }
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.bookCover} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.authors.join(', ')}</Text>
        <Text style={styles.rating}>
          {book.averageRating ? `Average Rating: ${book.averageRating}` : 'Rating not available'}
        </Text>
        <Text style={styles.description}>
          {book.description ? (
            descriptionExpanded ? 
            book.description : 
            `${book.description.substring(0, 200)}...`
          ) : (
            'No description available.'
          )}
        </Text>
        {book.description && book.description.length > 200 && (
          <Pressable
            onPress={() => setDescriptionExpanded(!descriptionExpanded)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>
              {descriptionExpanded ? 'Show Less' : 'Show More'}
            </Text>
          </Pressable>
        )}
        <View style={styles.genreContainer}>
          {book.genres && book.genres.map((genre) => (
            <TouchableOpacity key={genre} style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.pageCount}>{`${book.pageCount} pages`}</Text>
        <Text style={styles.publication}>{`First published: ${book.publishedDate}`}</Text>
  
        {/* Button container for Save and Review side by side */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSaveBook} style={saved ? styles.saveButton : styles.saveButton}>
          <Text style={styles.buttonText}>{saved ? 'Unsave' : 'Save'}</Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={handleReviewPress} style={styles.reviewButton}>
            <Text style={styles.buttonText}>Review</Text>
          </TouchableOpacity>
        </View>
  
        {/* Picker for category selection */}
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a Category" value="" />
          <Picker.Item label="Reading" value="Reading" />
          <Picker.Item label="Want to Read" value="Want to Read" />
          <Picker.Item label="Finished" value="Finished" />
        </Picker>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bookCover: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 18,
    color: 'grey',
  },
  rating: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  genreBadge: {
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  genreText: {
    fontSize: 14,
  },
  pageCount: {
    fontSize: 16,
  },
  publication: {
    fontSize: 16,
  },
  button:{
    backgroundColor: Colors.light.tint,
    alignSelf: "flex-start",
    marginTop: "auto",
    marginVertical: 10,
    borderRadius: 5,
    padding: 7,
    paddingHorizontal: 15,
  },
  showMoreButton: {
    padding: 10,
    alignItems: 'center'
  },
  showMoreText: {
    color: 'blue',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007bff', // Example save button color
    padding: 10,
    borderRadius: 5,
    marginRight: 5, // Add some space between the buttons
  },
  reviewButton: {
    flex: 1,
    backgroundColor: '#FFA500', // Example review button color
    padding: 10,
    borderRadius: 5,
    marginLeft: 5, // Add some space between the buttons
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  picker: {
    marginTop: 20, // Add some space above the picker
    width: '100%',
    // Additional styles for the picker
  },
  // Add styles for dropdowns/pickers and any other additional elements
});

export default BookDetailsScreen;
