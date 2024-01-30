import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

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

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.authors.join(', ')}</Text>
        <Text style={styles.rating}>{`Rating: ${book.rating}`}</Text>
        <Text style={styles.description}>{book.description}</Text>
        <View style={styles.genreContainer}>
          {/* {book.genres.map((genre) => (
            <TouchableOpacity key={genre} style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))} */}
        </View>
        <Text style={styles.pageCount}>{`${book.pageCount} pages`}</Text>
        <Text style={styles.publication}>{`First published: ${book.publicationDate}`}</Text>
        {/* Implement dropdown or picker components for reading status and purchase format */}
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
  // Add styles for dropdowns/pickers and any other additional elements
});

export default BookDetailsScreen;
