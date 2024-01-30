import { ActivityIndicator, FlatList, TextInput, Button, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";
import { useLazyQuery } from "@apollo/client";
import BookItem from "../../components/Bookitem";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { searchQuery } from "./queries";
import { parseBook } from "../../services/bookService";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";


export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<BookProvider>("googleBooksSearch");

  const [runQuery, { data, loading, error }] = useLazyQuery(searchQuery);

  const navigation = useNavigation();

  const handleSelectBook = (book) => {
    // Navigate to the BookDetails screen with parameters
    navigation.navigate('BookDetails', { book });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          value={search} 
          onChangeText={setSearch}
          placeholder="Search Books" 
          style={styles.input}
        />
        <Button title='Search' onPress={() => runQuery({variables: {q: search}})}/>
      </View>

      <View style={styles.tabs}> 
        <Text 
          style={
            provider === "googleBooksSearch"
              ? {fontWeight: 'bold', color: "royalblue"}
              : {}
          }
          onPress={() => setProvider("googleBooksSearch")}
        >
          Google Books
        </Text>
        <Text 
          style={
            provider === "openLibrarySearch"
              ? {fontWeight: 'bold', color: "royalblue"}
              : {}
          }
          onPress={() => setProvider("openLibrarySearch")}
        >
          Open Libary
        </Text>
      </View>

      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={
          provider === "googleBooksSearch"
            ? data?.googleBooksSearch?.items 
            : data?.openLibrarySearch?.docs || []
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectBook(parseBook(item, provider))}>
            <BookItem book={parseBook(item, provider)}/>
          </TouchableOpacity>
        )} 
      />
    </SafeAreaView>
  );
}
