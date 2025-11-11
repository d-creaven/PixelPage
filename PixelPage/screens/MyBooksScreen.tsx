import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { useMyBooks } from '../context/MyBooksProvider';
import BookItem from '../components/BookItem';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLayoutEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Book } from '../props/Book.d';

export default function MyBooksScreen() {
  const { savedBooks } = useMyBooks();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CustomHeaderTitle = () => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
      { label: 'All', value: 'All' },
      { label: 'Reading', value: 'Reading' },
      { label: 'Want to Read', value: 'Want to Read' },
      { label: 'Finished', value: 'Finished' }
    ]);
  
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <DropDownPicker
          open={open}
          value={selectedCategory}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedCategory}
          setItems={setItems}
          listMode="SCROLLVIEW"
          containerStyle={{
            width: 130,
            // Aligns the dropdown within its parent view
          }}
        />
      </View>
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CustomHeaderTitle />,
      headerTitle: '', // Clear the default title
      // Ensure there's enough space for the headerLeft component, or it might be clipped or not fully visible.
      headerLeftContainerStyle: { paddingLeft: 10 },
    });
  }, [navigation, selectedCategory]);

  const handleSelectBook = (book: Book) => {
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
      {/* List of books */}
      <FlatList
        data={booksToDisplay}
        keyExtractor={(item) => item.isbn} // Make sure to have a unique id for each book
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectBook(item)}>
            <BookItem book={item} />
          </TouchableOpacity>
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
