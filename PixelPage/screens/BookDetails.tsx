import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Button, Pressable } from 'react-native';
import { useMyBooks } from '../context/MyBooksProvider';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const BookDetailsScreen = ({ route }) => {
  // Assuming you're passing a `book` object in your navigation route params
  const { book } = route.params;

  // Placeholder function for choosing reading status
  const onReadingStatusChange = (status) => {
    console.log('Reading status changed:', status);
  };

  // Placeholder function for choosing purchase format
  const onPurchaseFormatChange = (format) => {
    console.log('Purchase format changed:', format);
  };

  const {isBookSaved, onToggleSaved} = useMyBooks();

  const saved = isBookSaved(book);

  const navigation = useNavigation();

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
        <Text style={styles.description}>{book.description}</Text>
        <View style={styles.genreContainer}>
          {book.genres && book.genres.map((genre) => (
            <TouchableOpacity key={genre} style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.pageCount}>{`${book.pageCount} pages`}</Text>
        <Text style={styles.publication}>{`First published: ${book.publishedDate}`}</Text>
        {/* Implement dropdown or picker components for reading status and purchase format */}
        <Pressable
          style={[styles.button, saved ? { backgroundColor: 'lightgray' } : {backgroundColor: '#47AA71'}]}
          onPress={() => onToggleSaved(book)}
        >
          <Text style={styles.buttonText}>
            {saved ? 'Remove' : 'Want to Read'}
          </Text>
        </Pressable>
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
  buttonText:{
    color: "white",
    fontWeight: "600",
  },
  // Add styles for dropdowns/pickers and any other additional elements
});

export default BookDetailsScreen;
