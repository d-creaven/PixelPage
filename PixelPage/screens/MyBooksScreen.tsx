import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { useMyBooks } from '../context/MyBooksProvider';
import BookItem from '../components/Bookitem';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLayoutEffect, useState } from 'react';

export default function MyBooksScreen() {
  const { savedBooks } = useMyBooks();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSelectBook = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const getFilteredBooks = () => {
    if (selectedCategory === 'All') {
      return savedBooks;
    }
    return savedBooks.filter(book => book.category === selectedCategory);
  };

  const booksToDisplay = getFilteredBooks();
  
  return (
    <View style={styles.container}>
      {/* Category selection (e.g., using a Picker as before) */}
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Reading" value="Reading" />
        <Picker.Item label="Want to Read" value="Want to Read" />
        <Picker.Item label="Finished" value="Finished" />
      </Picker>

      {/* List of books */}
      <FlatList
        data={booksToDisplay}
        keyExtractor={(item) => item.isbn} // Make sure to have a unique id for each book
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectBook(item)}>
            <BookItem book={item} />
          </TouchableOpacity>
          // Render your book item component
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

});
