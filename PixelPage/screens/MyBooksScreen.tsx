import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { useMyBooks } from '../context/MyBooksProvider';
import BookItem from '../components/Bookitem';
import { useNavigation } from '@react-navigation/native';

export default function MyBooksScreen() {
  const { savedBooks } = useMyBooks();
  const navigation = useNavigation();

  const handleSelectBook = (book) => {
    navigation.navigate('BookDetails', { book });
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={savedBooks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectBook(item)}>
            <BookItem book={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.isbn}  // Ensure you have a unique key for each item
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
